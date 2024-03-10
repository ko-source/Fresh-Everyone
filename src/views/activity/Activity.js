import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import {
  //   CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  //   CButton,
  CDataTable,
  CRow,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { getProvider, getService } from "../../utils/database_fetch_methods";
// import { exportDataToXLSX } from "../../utils/exportData";
// import orderPdf from "../../utils/orderpdf";

const Activity = () => {
  //   const history = useHistory();

  //   const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  var [state, setState] = useState({
    orders: null,
    collapse: false,
  });

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
        const [resolvedProvider, resolvedService] = await Promise.all([
          getProvider(order.provider_id),
          getService(order.service.service_id, order.service.sub_service_id),
        ]);

        const providers = [resolvedProvider]; // To store multiple providers
        const parentId = order.parent_ticketId;
        //Getting all the providers
        if (parentId && order.ticketId !== parentId) {
          const tempOrder = (
            await firebase
              .firestore()
              .collection("orders")
              .where("ticketId", "==", parentId)
              .get()
          ).docs;
          const tempProviders = await Promise.all(
            tempOrder.map((order) => {
              return getProvider(order.data().provider_id);
            })
          );
          providers.push(...tempProviders);
        }

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
              status: doc.data()?.status,
              remark: doc.data()?.remark,
              supervisorTimestamp: doc.data().last_updated,
              supervisorName:
                provider.data()?.name ||
                provider.data()?.phone ||
                "Not Assigned",
            };
          })
        );
        // Extracting name or phone and joining with with ,
        const resolvedProviders = providers
          .map((provider) => provider?.name || provider?.phone)
          .join(", ");
        return {
          ...order,
          id: doc.id,
          provider_name: resolvedProviders,
          service_name: resolvedService.service.name,
          sub_service_name: resolvedService.sub_service.name,
          supervisorName: resolvedSupervisor?.supervisorName || "Not Assigned",
          supervisorTimestamp:
            resolvedSupervisor?.supervisorTimestamp?.toDate() || "Not Assigned",
          supervisorStatus: resolvedSupervisor?.status || "-",
          supervisorRemark: resolvedSupervisor?.remark || "-",
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

  //   const onExportData = async () => {
  //     const filteredData = state.orders
  //       .filter((order) => {
  //         // return Object.keys(tableFilters).reduce((p, c) => {
  //         //   return String(order[c]).includes(tableFilters[c]) && p
  //         // }, true)
  //         for (const filterKey in tableFilters) {
  //           console.log(
  //             String(order[filterKey]).search(
  //               new RegExp("tableFilters[filterKey]", "i")
  //             )
  //           );
  //           if (
  //             String(order[filterKey]).search(
  //               new RegExp(tableFilters[filterKey], "i")
  //             ) >= 0
  //           ) {
  //             continue;
  //           } else {
  //             return false;
  //           }
  //         }
  //         return true;
  //       })
  //       .map((order) => ({
  //         ticketId: order.ticketId,
  //         timestamp: order.timestamp,
  //         provider_name: order.provider_name,
  //         customer: order.customer,
  //         service_name: order.service_name,
  //         sub_service_name: order.sub_service_name,
  //         payment_status: order.payment_status,
  //         status: order.status,
  //         time: order.time,
  //         total_amount: order.total,
  //         supervisorName: order.supervisorName,
  //       }));

  //     exportDataToXLSX(filteredData, "ordersList");
  //   };

  return (
    <CRow>
      {/* <CCol xl={12} className="d-flex justify-content-end">
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
      </CCol> */}
      <CCol xl={12}></CCol>
      <CCol xl={12}>
        <CCard>
          <CCardHeader color="secondary">Activity</CCardHeader>
          <CCardBody>
            <CDataTable
              loading={loading}
              items={state.orders}
              fields={[
                { key: "ticketId", label: "Ticket ID", filter: true },
                { key: "service_name", filter: true },
                { key: "sub_service_name", filter: true },
                {
                  key: "supervisorName",
                  filter: true,
                  label: "Supervisor Name",
                },
                {
                  key: "supervisorTimestamp",
                  filter: true,
                  label: "Supervisor Response Time",
                },
                {
                  key: "supervisorStatus",
                  filter: true,
                },
                {
                  key: "supervisorRemark",
                  filter: true,
                },
                { key: "provider_name", filter: true, label: "Providers" },
              ]}
              hover
              striped
              columnFilter
              scopedSlots={{
                supervisorStatus: (item, index) => {
                  return (
                    <td style={{ textAlign: "center" }}>
                      <span>{item.supervisorStatus}</span>
                    </td>
                  );
                },
                supervisorRemark: (item, index) => {
                  return (
                    <td style={{ textAlign: "center" }}>
                      <span>{item.supervisorRemark}</span>
                    </td>
                  );
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Activity;
