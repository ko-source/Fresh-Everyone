import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CButton,
  CDataTable,
  CRow,
  CBadge,
  CInput,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import firebase from "../../config/fbconfig";
import { getProvider, getUser } from "../../utils/database_fetch_methods";
import { exportDataToXLSX } from "../../utils/exportData";

const Payments = () => {
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(null);
  const history = useHistory();
  const [submitLoading, setSubmitLoading] = useState(false);
  useEffect(() => {
    getOrders();
  }, []);

  function compare(b, a) {
    var id = "timestamp";
    if (a[id] < b[id]) {
      return -1;
    }
    if (a[id] > b[id]) {
      return 1;
    }
    return 0;
  }


  const updatedStatus = async (s , a) => {
    const updateStatus = {
      payment_mode: s,
    };
    try {
      await firebase
        .firestore()
        .collection("orders")
        .doc(a)
        .update(updateStatus);
         getOrders();
    } catch (error) {
      console.error(error);
    }
  };
  const getOrders = async () => {
    // fetching orders and filtering it for missing mandatory fields
    setLoading(true);
    const value = (
      await firebase.firestore().collection("orders").get()
    ).docs.filter((doc) => {
      if (
        !(
          doc.data().provider_id &&
          doc.data().customer_id &&
          doc.data().service &&
          doc.data().service["service_id"] &&
          doc.data().service["sub_service_id"]
        )
      ) {
        // console.log(doc.data());
      }
      return (
        doc.data().provider_id &&
        doc.data().customer_id &&
        doc.data().service &&
        doc.data().service["service_id"] &&
        doc.data().service["sub_service_id"]
      );
    });

    // resolving individual orders for meta field data
    let processedOrders = await Promise.all(
      value.map(async (doc) => {
        const order = doc.data();
        const [resolvedProvider, resolvedCustomer] = await Promise.all([
          getProvider(order.provider_id),
          getUser(order.customer_id),
        ]);
        const supervisorsDocs = await firebase
          .firestore()
          .collection("supervisorJobs")
          .where("parent_TicketId", "==", order.ticketId || "")
          .get();
        const [resolvedSupervisor] = await Promise.all(
          supervisorsDocs.docs.map(async (doc) => {
            const provider = await firebase
              .firestore()
              .collection("providers")
              .doc(doc.data().provider)
              .get();
            return {
              supervisorName:
                provider.data()?.name ||
                provider.data()?.phone ||
                "Not Assigned",
            };
          })
        );
        return {
          ...order,
          id: doc.id,
          provider_name: resolvedProvider.name
            ? resolvedProvider.name
            : resolvedProvider.phone,
          customer: resolvedCustomer.phone,
          payment_status: order.total
            ? order.amountPaid < order.total
              ? "pending"
              : "paid"
            : "pending",
          supervisorName: resolvedSupervisor?.supervisorName || "Not Assigned",
          payment_collection:
            order.payment_collection ||
            (order.total
              ? order.amountPaid < order.total
                ? "Pending"
                : "Collected"
              : "Pending"),
          amountPending: order.amountPending || order.total - order.amountPaid,
        };
      })
    );

    processedOrders = processedOrders.sort(compare);

    setOrders(processedOrders);

    setLoading(false);
  };

  const onExportData = async () => {
    const filteredData = orders
      .filter((order) => {
        for (const filterKey in tableFilters) {
          console.log(
            String(order[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(order[filterKey]).search(
              new RegExp(tableFilters[filterKey], "i")
            ) >= 0
          ) {
            continue;
          } else {
            return false;
          }
        }
        return true;
      })
      .map((order) => ({
        ticketId: order.ticketId,
        provider_name: order.provider_name,
        payment_status: order.payment_status,
        supervisorName: order.supervisorName,
      }));

    exportDataToXLSX(filteredData, "ordersList");
  };

  const updatePendingAmount = (amount, index) => {
    setOrders(
      orders.map((order, i) => {
        if (i === index) {
          return {
            ...order,
            amountPending: amount,
          };
        } else return order;
      })
    );
  };

  const updatePaidAmount = (amount, index) => {
    setOrders(
      orders.map((order, i) => {
        if (i === index) {
          return {
            ...order,
            amountPaid: amount,
          };
        } else return order;
      })
    );
  };

  const submitAmount = (paid, pending, id) => {
    if (
      paid.toString().trim() === "" ||
      pending.toString().trim() === "" ||
      !id
    ) {
      alert("Fill All fields");
      return;
    }
    setSubmitLoading(true);
    firebase
      .firestore()
      .collection("orders")
      .doc(id)
      .update({ amountPaid: parseInt(paid), amountPending: parseInt(pending) })
      .then((data) => {
        alert("Amount Updated Successfully");
        setSubmitLoading(false);
      })
      .catch((err) => {
        alert("Something went wrong");
        setSubmitLoading(false);
      });
  };

  return (
    <CRow>
      <CCol xl={12} className="d-flex justify-content-end">
        <CButton color="info" className="mb-2 mr-2" onClick={onExportData}>
          Export Data
        </CButton>
      </CCol>
      <CCol xl={12}></CCol>
      <CCol xl={12}>
        <CCard>
          <CCardHeader color="secondary">Payments</CCardHeader>
          <CCardBody>
            <CDataTable
              loading={loading}
              onColumnFilterChange={(e) => {
                console.log(e);
                setTableFilters(e);
              }}
              onSorterValueChange={(e) => {
                console.log(e);
              }}
              items={orders}
              fields={[
                // { key: "id", label: "order ID", filter: true },
                { key: "ticketId", label: "Ticket ID", filter: true },
                { key: "provider_name", filter: true, label: "Employee" },
                {
                  key: "supervisorName",
                  filter: true,
                  label: "Supervisor Name",
                },
                { key: "payment_status", filter: true },
                { key: "payment_mode", label: "Payment Mode", filter: true },
                { key: "payment_collection", filter: true },
                {
                  key: "editPaymentCollection",
                  label: "",
                  sorter: false,
                  filter: false,
                },
                {
                  key: "amountPaidField",
                  label: "Amount Paid",
                  filter: false,
                  sorter: true,
                },
                {
                  key: "amountPendingField",
                  label: "Amount Pending",
                  filter: false,
                  sorter: true,
                },
                {
                  key: "submitAmount",
                  label: "",
                  filter: false,
                  sorter: true,
                },
              ]}
              scopedSlots={{
                payment_collection: (item, index) => {
                  return (
                    <td>
                      {item.payment_collection === "Pending" ? (
                        <CBadge color="danger"> Pending </CBadge>
                      ) : (
                        <CBadge color="success">Collected</CBadge>
                      )}
                    </td>
                  );
                },
                editPaymentCollection: (item, index) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`payments/edit/${item.id}`)}
                      >
                        Edit Payment Collection
                      </CButton>
                    </td>
                  );
                },

                payment_mode:  (item, index) => {
                  return (
                    <td>
                      <div>
                          <CDropdown className="mt-2">
                            <CDropdownToggle
                              caret
                              color="info"
                              varient={"outline"}
                            >
                              {item.payment_mode == undefined ? "Select Mode" : item.payment_mode} 
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem header>Payment Mode</CDropdownItem>
                              <CDropdownItem divider />
                              <CDropdownItem
                                onClick={() => updatedStatus("Online" ,item.id)}
                              >
                                Online
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("Cash" ,item.id)}
                              >
                                Cash
                              </CDropdownItem>
                              
                              
                            </CDropdownMenu>
                          </CDropdown>
                        </div>
                    </td>
                  );
                },
                amountPaidField: (item, index) => {
                  return (
                    <td className="py-2">
                      <CInput
                        type="number"
                        value={item.amountPaid}
                        onChange={(e) =>
                          updatePaidAmount(e.target.value, index)
                        }
                      />
                    </td>
                  );
                },
                amountPendingField: (item, index) => {
                  return (
                    <td className="py-2">
                      <CInput
                        type="number"
                        value={item.amountPending}
                        onChange={(e) =>
                          updatePendingAmount(e.target.value, index)
                        }
                      />
                    </td>
                  );
                },
                submitAmount: (item, index) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        disabled={submitLoading}
                        onClick={() =>
                          submitAmount(
                            item.amountPaid,
                            item.amountPending,
                            item.id
                          )
                        }
                      >
                        Update Payment
                      </CButton>
                    </td>
                  );
                },
              }}
              hover
              striped
              columnFilter
              onPageChange={(e) => {
                console.log(e);
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Payments;
