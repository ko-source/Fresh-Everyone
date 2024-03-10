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
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import {
  getProvider,
  getService,
  getUser,
  getReferral,
} from "../../utils/database_fetch_methods";
import orderPdf from "../../utils/orderpdf";

const TeleCallers = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  var [state, setState] = useState({
    orders: null,
    collapse: false,
  });
  const [orderMaker, setOrderMaker] = useState("");

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
        setOrderMaker(resolvedCustomer);

        // Filtering orders whose tickedId starts with KE
        if (order.ticketId?.startsWith("KE")) {
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
          };
        }
        return undefined;
      })
    );
    // Removing orders wheres the data is undefined
    processedOrders = processedOrders.filter((order) => order !== undefined);
    processedOrders = processedOrders.sort(compare);
    setState({
      ...state,
      orders: processedOrders,
    });

    setLoading(false);
  };

  return (
    <CRow>
      <CCol xl={12} className="d-flex justify-content-end">
        <CButton
          color="info"
          className="mb-2 mr-2"
          onClick={() => history.push(`/orders/requestedOrders`)}
        >
          Order Requests
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
                { key: "ticketId", label: "Ticket ID", filter: true },
                { key: "timestamp", label: "Last updated", filter: true },
                // { key: 'provider_name', filter: true, label: 'Employee' },
                // { key: 'customer', filter: true, label: 'Customer' },
                { key: "service_name", filter: true },
                { key: "sub_service_name", filter: true },
                { key: "payment_status", filter: true },
                { key: "status", label: "Work Status", filter: true },
                { key: "time", label: "Service Time", filter: true },
                { key: "total_amount", label: "Total Amount", filter: true },
                { key: "referred_by", label: "Referred By", filter: true },
                { key: "show_details", label: "", filter: true },
                {
                  key: "Order_Bill",
                  label: "",
                  _style: { width: "5%" },
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
                // 'provider_name': (item) => {
                //   return (<td>  <ServiceProviderName id={item["provider_id"]} name={item.provider_name}></ServiceProviderName></td>);
                // },
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default TeleCallers;
