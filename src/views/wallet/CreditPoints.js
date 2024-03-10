import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CForm,
  CRow,
  CFormGroup,
  CLabel,
  CInput,
  CInputGroup,
  CButton,
  CProgress,
  CProgressBar,
  CSpinner,
  CTextarea
} from "@coreui/react";
import ServiceName from "../ServiceNameComponent";
import SubServiceName from "../SubServiceNameComponent";
import firebase from "../../config/fbconfig";
import CustomerName from "../CustomerNameComponent";
import { useFormik } from "formik";

const CreditPoints = (props) => {
  const history = useHistory();

  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const PriceData = {mobile : "",}
  const [mobile, setMobile] = useState([PriceData]);
  const [validated, setValidated] = useState(false);

  const [state, setState] = useState({
    orders: null,
  });
  const initialFormData = {
      amount:"",
    message:"",
  };
 
  const formData = useFormik({
    initialValues: initialFormData,
  });

  useEffect(() => {
    // getOrders();
  }, []);


 const credit = async (e) => {
    const form = e.currentTarget
    if (form.checkValidity() === false) {
        e.preventDefault()
        alert("All fields are required!")
        e.stopPropagation()
      }else{
        e.preventDefault()
        setValidated(true)
        await firebase.firestore().collection("User").doc(props.location.state.id).collection("wallet").add({
            amount:formData.values.amount,
            date:Date.now(),
            message:formData.values.message,
            type:"credit" 
        });
        await firebase.firestore().collection("User").doc(props.location.state.id).update({
            wallet:firebase.firestore.FieldValue.increment(formData.values.amount.valueOf())
        });
        alert("Points credited to Customer's Wallet");
        formData.resetForm();
    }
 }
  // const getOrders = async () => {
  //   // var today = new Date().format("yyyy-MM-ddThh:mm:ss")
  //   const value = (
  //     await firebase.firestore().collection("orders").get()
  //   ).docs.filter((doc) => {
  //     return !doc.data().provider_id;
  //   });
  //   // .catch(e => {
  //   //   setState({ ...state })
  //   // });

  //   // Promise.all(value.docs.map(doc => {
  //   //   return firebase.firestore().collection('providers').doc(doc.data().provider_id).get();
  //   // })).then(providers => {
  //   //   providers = providers.map(doc => ({ ...doc.data(), id: doc.id }));
  //   //   // console.log(providers);
  //   //   setState({
  //   //     ...state,

  //   //     orders: value.docs.filter(doc => {
  //   //       if (!(doc.data().provider_id && (doc.data().service && doc.data().service['service_id'] && doc.data().service['sub_service_id']))) {
  //   //         console.log(doc.data());
  //   //       }
  //   //       return doc.data().provider_id && (doc.data().service && doc.data().service['service_id'] && doc.data().service['sub_service_id']);
  //   //     }).map(doc => {

  //   //       return {
  //   //         ...doc.data(),
  //   //         provider_name: providers.find(provider => provider.id === doc.data().provider_id).name,
  //   //         id: doc.id,
  //   //       }
  //   //     }).sort(compare),

  //   //   })
  //   // })
  //   // console.log(value);

  //   setState({
  //     ...state,

  //     orders: value
  //       .map((doc) => {
  //         console.log(doc.data());
  //         return {
  //           ...doc.data(),
  //           id: doc.id,
  //         };
  //       })
  //       .filter(
  //         (order) => order.service.sub_service_id && order.service.service_id
  //       )
  //       // .sort(compare),
  //   });
  // };

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Credit Points</CCardHeader>
          <CCardBody>
            <CForm id="form" noValidate validated={validated}>
              <CFormGroup>
                      <CRow className="g-3 align-items-center">
                          <CCol md="3" sm="3">
                              <CLabel>Enter Points</CLabel>
                          </CCol>
                          <CCol sm={5}>
                            <CInputGroup className="mb-3">
                              <CInput
                                required
                                type="number"
                                placeholder="Enter Points to be credited"
                                name="amount"
                                value={formData.values.amount}
                                onChange={(e) => {
                                formData.handleChange(e);
                                // setFormData({
                                //   ...formData.values,
                                //   name: e.target.value
                                // })
                                }}
                                />   
                            </CInputGroup>
                          </CCol>
                      </CRow>
                
            </CFormGroup>
            <CFormGroup>
            <CRow className="g-3 align-items-center">
                    <CCol md="3" sm="3">
                              <CLabel>Message</CLabel>
                    </CCol>
                    <CCol sm={6}>
                    <CTextarea
                      required 
                      type="text"
                      placeholder="Enter Message"
                      name="message"
                      value={formData.values.message}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                </CRow>
            </CFormGroup>
            {showProgress && (
                    <CProgress className="mb-3">
                    <CProgressBar value={progress}>{progress}%</CProgressBar>
                    </CProgress>
                )}

                <CFormGroup>
                <CCol md={12}style={{ display: "flex" }}>
                    {submitLoading ? (
                    <CSpinner size="small" color="info" />
                    ) : (
                    <CButton type="submit" style={{color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c",marginLeft: "auto",marginRight:"auto",marginTop:"10px"}} disabled={submitLoading}
                    onClick={credit}
                    >
                            Credit Points
                            </CButton>
                    )}
                    </CCol>
                    </CFormGroup>
            </CForm>
            {/* <CDataTable
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
            /> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CreditPoints;
