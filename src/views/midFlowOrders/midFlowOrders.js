import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import ServiceName from "../ServiceNameComponent";
import SubServiceName from "../SubServiceNameComponent";
import firebase from "../../config/fbconfig";
import CustomerName from "../CustomerNameComponent";

const MidFolowOrders = (props) => {
  const history = useHistory();

  const [state, setState] = useState({
    orders: null,
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
    // var today = new Date().format("yyyy-MM-ddThh:mm:ss")
    const value = (
      await firebase.firestore().collection("orders").get()
    ).docs.filter((doc) => {
      return !doc.data().provider_id;
    });
    // .catch(e => {
    //   setState({ ...state })
    // });

    // Promise.all(value.docs.map(doc => {
    //   return firebase.firestore().collection('providers').doc(doc.data().provider_id).get();
    // })).then(providers => {
    //   providers = providers.map(doc => ({ ...doc.data(), id: doc.id }));
    //   // console.log(providers);
    //   setState({
    //     ...state,

    //     orders: value.docs.filter(doc => {
    //       if (!(doc.data().provider_id && (doc.data().service && doc.data().service['service_id'] && doc.data().service['sub_service_id']))) {
    //         console.log(doc.data());
    //       }
    //       return doc.data().provider_id && (doc.data().service && doc.data().service['service_id'] && doc.data().service['sub_service_id']);
    //     }).map(doc => {

    //       return {
    //         ...doc.data(),
    //         provider_name: providers.find(provider => provider.id === doc.data().provider_id).name,
    //         id: doc.id,
    //       }
    //     }).sort(compare),

    //   })
    // })
    // console.log(value);

    setState({
      ...state,

      orders: value
        .map((doc) => {
          console.log(doc.data());
          return {
            ...doc.data(),
            id: doc.id,
          };
        })
        .filter(
          (order) => order.service.sub_service_id && order.service.service_id
        )
        .sort(compare),
    });
  };

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader color="secondary">Requested Orders</CCardHeader>
          <CCardBody>
            <CDataTable
              items={state.orders}
              fields={[
                { key: "ticketId", label: "Ticket ID", filter: true },

                { key: "timestamp", label: "Last updated", filter: true },
                // { key: 'provider_name', filter: true, label: 'Employee' },
                // { key: 'customer', filter: false },
                { key: "service name", filter: false },
                { key: "sub service name", filter: false },
                { key: "PaymentStatus", filter: false },

                { key: "status", label: "Work Status", filter: true },

                { key: "time", label: "Service Time", filter: true },
              ]}
              scopedSlots={{
                // 'provider_name': (item) => {
                //   return (<td>  <ServiceProviderName id={item["provider_id"]}></ServiceProviderName></td>);
                // },
                PaymentStatus: (item) => {
                  return (
                    <td>
                      {" "}
                      {item["amountPaid"] < item["total"] ? (
                        <CBadge color="danger">Pending</CBadge>
                      ) : (
                        <CBadge color="success">Paid</CBadge>
                      )}{" "}
                    </td>
                  );
                },

                customer: (item) => {
                  return (
                    <td>
                      {" "}
                      <CustomerName
                        id={item["customer_id"]}
                      ></CustomerName>{" "}
                    </td>
                  );
                },
                "service name": (item) => {
                  return (
                    <ServiceName
                      serviceId={item.service["service_id"]}
                    ></ServiceName>
                  );
                },
                "sub service name": (item) => {
                  return (
                    <SubServiceName
                      serviceId={item.service["service_id"]}
                      subServiceId={item.service["sub_service_id"]}
                    ></SubServiceName>
                  );
                },
              }}
              hover
              striped
              columnFilter
              clickableRows
              onRowClick={(item) => history.push(`/orders/${item.id}`)}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default MidFolowOrders;
