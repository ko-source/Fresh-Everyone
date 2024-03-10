import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import {
    CButton,
  //   CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  //   CButton,
  CDataTable,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { getProvider, getService ,getUser} from "../../utils/database_fetch_methods";
// import { exportDataToXLSX } from "../../utils/exportData";
// import orderPdf from "../../utils/orderpdf";

const ReviewCall = () => {
  //   const history = useHistory();

  //   const [tableFilters, setTableFilters] = useState({});
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

  const updatedCallStatus = async (s , a) => {
    const updatecallStatus = {
      review_call_status: s,
    };
    try {
      await firebase
        .firestore()
        .collection("orders")
        .doc(a)
        .update(updatecallStatus);
         getOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const updatedMessageStatus = async (s , a) => {
    const updatemessageStatus = {
      review_message_status: s,
    };
    try {
      await firebase
        .firestore()
        .collection("orders")
        .doc(a)
        .update(updatemessageStatus);
         getOrders();
    } catch (error) {
      console.error(error);
    }
  };
  const getOrders = async () => {
    // fetching orders and filtering it for missing mandatory fields
    setLoading(true);
    const value = (
      await firebase.firestore().collection("orders").orderBy("timestamp", "desc")
      .limit(50).get()
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
        const [resolvedProvider, resolvedService ,resolvedCustomer] = await Promise.all([
          getProvider(order.provider_id),
          
          getService(order.service.service_id, order.service.sub_service_id),
          getUser(order.customer_id),
        ]);
        setOrderMaker(resolvedCustomer);
        const providers = [resolvedProvider]; // To store multiple providers
        
        //Getting all the providers
          
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
          customer: resolvedCustomer.name ? resolvedCustomer.name
          : "",  
          customer_phone : resolvedCustomer.phone
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

   

  return (
    <CRow>
   
      <CCol xl={12}></CCol>
      <CCol xl={12}>
        <CCard>
          <CCardHeader color="secondary">Review Call </CCardHeader>
          <CCardBody>
            <CDataTable
              loading={loading}
              items={state.orders}
              fields={[
                // { key: "id", label: "order ID", filter: true },
                { key: "ticketId", label: "Ticket ID", filter: true },
                { key: "service_name", filter: true },
                { key: "sub_service_name", filter: true },
                 
                { key: "provider_name", filter: true, label: "Supplier Name" },
                { key: "customer", filter: true, label: "Customer Name" },
                { key: "customer_phone", filter: true, label: "Customer Phone" },
                { key: "status", label: "Work Status", filter: true },
                { key: "review_call_status", label: "Review Call Status", filter: true },
                { key: "review_message_status", label: "Review Message Status", filter: true },
              ]}
              hover
              striped
              columnFilter
              scopedSlots={{
                customer_phone: (item, index) => {
                  return (
                    <td className="py-2">
                       <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() =>  window.location.href = "tel:{item.customer_phone}" }
                      >
                        {item.customer_phone}
                      </CButton>
                    </td>
                  );
                },
                review_call_status:  (item, index) => {
                  return (
                    <td>
                      <div>
                          <CDropdown className="mt-2">
                            <CDropdownToggle
                              caret
                              color="info"
                              varient={"outline"}
                            >
                              {item.review_call_status == undefined ? "Select Call Status" : item.review_call_status} 
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem header>Call Status</CDropdownItem>
                              <CDropdownItem divider />
                              <CDropdownItem
                                onClick={() => updatedCallStatus("CUSTOMER BUSY CALL AGAIN" ,item.id)}
                              >
                                CUSTOMER BUSY CALL AGAIN
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedCallStatus("REVIEW CALL COMPLETED" ,item.id)}
                              >
                                REVIEW CALL COMPLETED
                              </CDropdownItem>
                              
                              <CDropdownItem
                                onClick={() => updatedCallStatus("NUMBER NOT AVAILABLE" ,item.id)}
                              >
                                NUMBER NOT AVAILABLE
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedCallStatus("REVIEW NOT DONE" ,item.id)}
                              >
                                REVIEW NOT DONE
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedCallStatus("CUSTOMER NOT ATTENDED 1" ,item.id)}
                              >
                                CUSTOMER NOT ATTENDED 1
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedCallStatus("CUSTOMER NOT ATTENDED 2" ,item.id)}
                              >
                                CUSTOMER NOT ATTENDED 2
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedCallStatus("CUSTOMER NOT ATTENDED 3" ,item.id)}
                              >
                                CUSTOMER NOT ATTENDED 3
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedCallStatus("CUSTOMER NOT ATTENDED 4" ,item.id)}
                              >
                                CUSTOMER NOT ATTENDED 4
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedCallStatus("COMPLETED MESSAGE & CALL" ,item.id)}
                              >
                                COMPLETED MESSAGE & CALL
                              </CDropdownItem>

                               
                              
                            </CDropdownMenu>
                          </CDropdown>
                        </div>
                    </td>
                  );
                },

                review_message_status:  (item, index) => {
                  return (
                    <td>
                      <div>
                          <CDropdown className="mt-2">
                            <CDropdownToggle
                              caret
                              color="info"
                              varient={"outline"}
                            >
                              {item.review_message_status == undefined ? "Select Message Status" : item.review_message_status} 
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem header>Message Status</CDropdownItem>
                              <CDropdownItem divider />
                              <CDropdownItem
                                onClick={() => updatedMessageStatus("MESSAGE NOT SEND" ,item.id)}
                              >
                                MESSAGE NOT SEND
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedMessageStatus("MESSAGE SEND" ,item.id)}
                              >
                                MESSAGE SEND
                              </CDropdownItem>
                              
                              <CDropdownItem
                                onClick={() => updatedMessageStatus("MESSAGE REVIEW COMPLETED" ,item.id)}
                              >
                                MESSAGE REVIEW COMPLETED
                              </CDropdownItem>
                              
                            </CDropdownMenu>
                          </CDropdown>
                        </div>
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

export default ReviewCall;
