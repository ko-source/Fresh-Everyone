import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CButton,
  CDataTable,
  CRow,
  CSpinner,
} from "@coreui/react";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CWidgetProgress,
  CWidgetSimple,
  CForm,
  CTextarea,
  CFormGroup,
} from "@coreui/react";
// import { freeSet } from "@coreui/icons";
// import ServiceName from "../ServiceNameComponent";
// import SubServiceName from "../SubServiceNameComponent";
import firebase from "../../config/fbconfig";
// import CIcon from "@coreui/icons-react";
// import CustomerName from "../CustomerNameComponent";
// import ServiceProviderName from "../ServiceProviderNameComponent";
import {
  getProvider,
  getService,
  getUser,
  getReferral,
} from "../../utils/database_fetch_methods";
import { exportDataToXLSX } from "../../utils/exportData";
import orderPdf from "../../utils/orderpdf";

const Orders = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  var [state, setState] = useState({
    orders: null,
    collapse: false,
  });
  const [orderMaker, setOrderMaker] = useState("");

  const [lastOrder, setLastOrder] = useState("");

  const [pageLoading, setPageLoading] = useState(false);

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
      status: s,
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
    const docs = (
      await firebase
        .firestore()
        .collection("orders")
        .orderBy("timestamp", "desc")
        .limit(50)
        .get()
    ).docs;

    setLastOrder(docs[docs.length - 1]);

    const value = docs.filter((doc) => {
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
        const [
          resolvedProvider,
          resolvedService,
          resolvedCustomer,
          resolvedReferral,
        ] = await Promise.all([
          getProvider(order.provider_id),
          getService(order.service.service_id, order.service.sub_service_id),
          getUser(order.customer_id),
          // getUser(order.ref)
          getReferral(order.customer_id),
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
        setOrderMaker(resolvedCustomer);
        return {
          ...order,
          id: doc.id,
          provider_name: resolvedProvider.name
            ? resolvedProvider.name
            : resolvedProvider.phone,
          service_name: resolvedService.service.name,
          sub_service_name: resolvedService.sub_service.name,
          customer: resolvedCustomer.phone,
          payment_status: order.total
            ? order.amountPaid < order.total
              ? "pending"
              : "paid"
            : "pending",
          total_amount: order.total,
          referred_by: resolvedReferral,
          supervisorName: resolvedSupervisor?.supervisorName || "Not Assigned",
        };
      })
    );

    processedOrders = processedOrders.sort(compare);

    setState({
      ...state,
      orders: processedOrders,
    });

    setLoading(false);
  };

  const onExportData = async () => {
    const filteredData = state.orders
      .filter((order) => {
        // return Object.keys(tableFilters).reduce((p, c) => {
        //   return String(order[c]).includes(tableFilters[c]) && p
        // }, true)
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
        timestamp: order.timestamp,
        city: order.city,
        provider_name: order.provider_name,
        customer: order.customer,
        service_name: order.service_name,
        sub_service_name: order.sub_service_name,
        payment_status: order.payment_status,
        status: order.status,
        time: order.time,
        total_amount: order.total,
        supervisorName: order.supervisorName,
      }));

    exportDataToXLSX(filteredData, "ordersList");
  };

  const loadMoreOrders = async () => {
    setPageLoading(true);
    const docs = (
      await firebase
        .firestore()
        .collection("orders")
        .orderBy("timestamp", "desc")
        .startAfter(lastOrder)
        .limit(50)
        .get()
    ).docs;

    setLastOrder(docs[docs.length - 1]);

    const value = docs.filter((doc) => {
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
        const [
          resolvedProvider,
          resolvedService,
          resolvedCustomer,
          resolvedReferral,
        ] = await Promise.all([
          getProvider(order.provider_id),
          getService(order.service.service_id, order.service.sub_service_id),
          getUser(order.customer_id),
          // getUser(order.ref)
          getReferral(order.customer_id),
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
        setOrderMaker(resolvedCustomer);
        return {
          ...order,
          id: doc.id,
          provider_name: resolvedProvider.name
            ? resolvedProvider.name
            : resolvedProvider.phone,
          service_name: resolvedService.service.name,
          sub_service_name: resolvedService.sub_service.name,
          customer: resolvedCustomer.phone,
          payment_status: order.total
            ? order.amountPaid < order.total
              ? "pending"
              : "paid"
            : "pending",
          total_amount: order.total,
          referred_by: resolvedReferral,
          supervisorName: resolvedSupervisor?.supervisorName || "Not Assigned",
        };
      })
    );

    processedOrders = processedOrders.sort(compare);

    setState({
      ...state,
      orders: [...state.orders, ...processedOrders],
    });

    setPageLoading(false);
  };

  return (
    <CRow>
      <CCol xl={12} className="d-flex justify-content-end">
        <CButton color="info" className="mb-2 mr-2" onClick={onExportData}>
          Export Data
        </CButton>
        <CButton
          color="info"
          className="mb-2 mr-2"
          onClick={() => history.push(`/orders/requestedOrders`)}
        >
          Order Requests
        </CButton>
        <CButton
          color="info"
          className="mb-2 mr-2"
          onClick={() => history.push(`/orders/cancelledOrders`)}
        >
          Cancelled Orders
        </CButton>
        <CButton
          color="primary"
          className="mb-2"
          onClick={() => history.push(`/orders/create_order`)}
        >
          Create Order
        </CButton>
      </CCol>
      <CCol xl={12}></CCol>
      <CCol xl={12}>
        <CCard>
          <CCardHeader color="secondary">Orders</CCardHeader>
          <CCardBody>
            <CDataTable
              loading={loading}
              onColumnFilterChange={(e) => {
                setTableFilters(e);
              }}
              onSorterValueChange={(e) => {
                console.log(e);
              }}
              items={state.orders}
              fields={[
                // { key: "id", label: "order ID", filter: true },
                { key: "ticketId", label: "Ticket ID", filter: true },
                { key: "timestamp", label: "Last updated", filter: true },
                { key: "provider_name", filter: true, label: "Employee" },
                { key: "city", filter: true },
                {
                  key: "supervisorName",
                  filter: true,
                  label: "Supervisor Name",
                },
                { key: "customer", filter: true, label: "Customer" },
                { key: "service_name", filter: true },
                { key: "sub_service_name", filter: true },
                { key: "payment_status", filter: true },
                { key: "status", label: "Work Status", filter: true },
                { key: "time", label: "Service Time", filter: true },
                { key: "total_amount", label: "Total Amount", filter: true },
                { key: "referred_by", label: "Work Referred By", filter: true },
                { key: "show_details", label: "", filter: false },
                {
                  key: "Order_Bill",
                  label: "",
                  // _style: { width: '5%' },
                  sorter: false,
                  filter: false,
                },
                {
                  key: "Duplicate_Order",
                  label: "",
                  // _style: { width: '5%' },
                  sorter: false,
                  filter: false,
                },
                {
                  key: "supervise_Order",
                  label: "",
                  // _style: { width: '5%' },
                  sorter: false,
                  filter: false,
                },
                {
                  key: "editReferrer",
                  label: "",
                  // _style: { width: '5%' },
                  sorter: false,
                  filter: false,
                },
              ]}
              scopedSlots={{
                ticketId: (item, index) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      >
                        {item.ticketId}
                      </CButton>
                    </td>
                  );
                },

                status:  (item, index) => {
                  return (
                    <td>
                      <div>
                          <CDropdown className="mt-2">
                            <CDropdownToggle
                              caret
                              color="info"
                              varient={"outline"}
                            >
                              {item.status}
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem header>Status</CDropdownItem>
                              <CDropdownItem divider />
                              <CDropdownItem
                                onClick={() => updatedStatus("New" ,item.id)}
                              >
                                New
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("SURVEY COMPLETED" ,item.id)}
                              >
                                SURVEY COMPLETED
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("ESTIMATE PREPARING" ,item.id)}
                              >
                                ESTIMATE PREPARING
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("RECIEVED PO" , item.id)}
                              >
                                RECIEVED PO
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("RESCHEDULED" ,item.id)}
                              >
                                RESCHEDULED 
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("BILL PENDING" ,item.id)}
                              >
                                BILL PENDING 
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("BILL SUBMITTED" ,item.id)}
                              >
                                BILL SUBMITTED 
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("BILL SETTLED" ,item.id)}
                              >
                                BILL SETTLED 
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("SUBMITTED ESTIMATE" ,item.id)}
                              >
                                SUBMITTED ESTIMATE 
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("WORK CANCELLED(AD)" ,item.id)}
                              >
                                WORK CANCELLED(AD) 
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("CUSTOMER CANCELLED" ,item.id)}
                              >
                                CUSTOMER CANCELLED
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </div>
                    </td>
                  );
                },

                payment_status: (item) => {
                  return (
                    <td>
                      {item.payment_status === "pending" ? (
                        <CBadge color="danger"> Pending </CBadge>
                      ) : (
                        <CBadge color="success">Paid</CBadge>
                      )}
                    </td>
                  );
                },
                Order_Bill: (item, index) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          orderPdf(item);
                        }}
                      >
                        Download Pdf
                      </CButton>
                    </td>
                  );
                },
                show_details: (item, index) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      >
                        Show Details
                      </CButton>
                    </td>
                  );
                },
                Duplicate_Order: (item, index) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() =>
                          history.push(`/orders/duplicateOrder/${item.id}`)
                        }
                      >
                        Duplicate Order
                      </CButton>
                    </td>
                  );
                },
                supervise_Order: (item, index) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() =>
                          history.push(`/orders/supervisor/${item.id}`)
                        }
                      >
                        Supervise Order
                      </CButton>
                    </td>
                  );
                },
                editReferrer: (item, index) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() =>
                          history.push(`editReferral/${item.customer_id}`)
                        }
                      >
                        Edit Referrer
                      </CButton>
                    </td>
                  );
                },
              }}
              hover
              striped
              columnFilter
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginBlock: 10,
              }}
            >
              {pageLoading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <CButton
                  color="primary"
                  disabled={pageLoading || loading}
                  // variant="ghost"
                  shape="square"
                  size="sm"
                  onClick={loadMoreOrders}
                >
                  Load More
                </CButton>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Orders;
