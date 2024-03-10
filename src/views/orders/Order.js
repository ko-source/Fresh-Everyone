import React, { useState, useEffect } from "react";

import {
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CWidgetProgress,
  CWidgetSimple,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CTextarea,
  CButton,
  CFormGroup,
} from "@coreui/react";
import { useFormik } from "formik";

import firebase from "../../config/fbconfig";
import { useHistory } from "react-router-dom";
import ServiceName from "../ServiceNameComponent";
import SubServiceName from "../SubServiceNameComponent";
import CustomerName from "../CustomerNameComponent";
import ServiceProviderName from "../ServiceProviderNameComponent";
// import OrderTicketId from "../OrderTicketIdComponent";
import {
  getOrder as fetchOrderFromDB,
  getProvider,
  getService,
} from "../../utils/database_fetch_methods";

const Order = ({ match }) => {
  const history = useHistory();
  var [state, setState] = useState({
    details: null,
  });
  var [providers, setProviders] = useState({
    providerList: [],
    selected_charge: "-1",
    charges: [],
    selected_provider: "-1",
  });
  // const id=match.params.id;
  // let [status, setStatus] = useState("");

  const updateProvider = async () => {
    if (
      providers.selected_charge === "-1" ||
      providers.selected_provider === "-1"
    ) {
      alert("All fields are mandatory");
      return;
    }

    const reduceChargeAfter =
      providers.charges[providers.selected_charge].reduceChargeAfter;
    const reduceChargePercent =
      providers.charges[providers.selected_charge].reduceChargePercent;
    const charge = providers.charges[providers.selected_charge].charge;

    const updateObject = {
      service: providers.charges[providers.selected_charge],
      provider_id: providers.providerList[providers.selected_provider].id,
      timestamp: new Date().toLocaleString("sv").substring(0, 16),
      status: "new",
      total:
        state.details.duration > reduceChargeAfter
          ? charge * reduceChargeAfter +
            (charge *
              reduceChargePercent *
              (state.details.duration - reduceChargeAfter)) /
              100
          : state.details.duration * charge,
    };

    try {
      await firebase
        .firestore()
        .collection("orders")
        .doc(match.params.id)
        .update(updateObject);
      getOrder();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    const order = await fetchOrderFromDB(match.params.id);
    const provider = order.provider_id
      ? await getProvider(order.provider_id)
      : null;

    setState({
      ...state,
      provider,
      details: order,
    });
  };

  const getCharges = () => {
    if (providers.selected_provider === "-1") {
      setProviders({
        ...providers,
        selected_charge: "-1",
        charges: [],
      });
    } else {
      setProviders({
        ...providers,
        selected_charge: "-1",
        charges: providers.providerList[
          providers.selected_provider
        ].services.filter((doc) => {
          if (
            doc["charge"] !== undefined &&
            doc["charge_type"] !== undefined &&
            doc["service_id"] === state.details.service.service_id &&
            doc["sub_service_id"] === state.details.service.sub_service_id
          )
            return true;
          return false;
        }),
      });
    }
  };

  const getEligibleProvidersList = async () => {
    const services = await getService(
      state.details.service.service_id,
      state.details.service.sub_service_id
    );

    let providersList = [];

    if (services.sub_service.providers != null) {
      providersList = await Promise.all(
        services.sub_service.providers
          .filter((provider) => provider !== state.details.provider_id)
          .map(async (provider) => {
            const resolverProvider = (
              await firebase
                .firestore()
                .collection("providers")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "==",
                  provider
                )
                .where("verified", "==", true)
                .get()
            ).docs[0];

            if (!resolverProvider) {
              return null;
            }

            return {
              ...resolverProvider.data(),
              id: resolverProvider.id,
            };
          })
      );
      providersList = providersList.filter((provider) => provider !== null);
    }

    console.log(providersList);
    setProviders({
      selected_charge: -1,
      charges: [],
      providerList: providersList,
    });

    // firebase.firestore().collection('services').doc(state.details.service.service_id).collection('subservices').doc(state.details.service.sub_service_id).get().then((value) => {

    //   console.log(value.data());
    //   if (value.data().providers != null) {
    //     var list = [];
    //     for (var i = 0; i < value.data().providers.length; i++) {

    //       if (typeof value.data().providers[i] !== 'string') {
    //         continue;
    //       }

    //       firebase.firestore().collection("providers").doc(value.data().providers[i]).get().then((v) => {

    //         if (v.data()["verified"] === true && v.id !== state.details.provider_id) {
    //           list.push({
    //             ...v.data(),
    //             id: v.id,

    //           })
    //           setProviders({
    //             ...providers,
    //             selected_charge: -1,
    //             charges: [],
    //             providerList: list
    //           })

    //         }
    //       }).catch(e => {
    //       })
    //         ;
    //     }
    //   } else {

    //   }

    // });
  };

  const updatedStatus = async (s) => {
    const updateStatus = {
      status: s,
    };
    try {
      await firebase
        .firestore()
        .collection("orders")
        .doc(match.params.id)
        .update(updateStatus);
      getOrder();
    } catch (error) {
      console.error(error);
    }
  };
  const formik = useFormik({ initialValues: {note:""} });

  const addNote = async (e) => {
    e.preventDefault();

      await firebase
        .firestore()
        .collection("orders")
        .doc(match.params.id)
        .update(
          {
            notes:firebase.firestore.FieldValue.arrayUnion(formik.values.note)
          })
          ;

    getOrder()

  };
  return state.details !== null ? (
    <CRow>
      <CCol lg={12}>
        <CFormGroup>
          <CButton
            variant={"outline"}
            onClick={() => history.push(`/orders/editOrder/${match.params.id}`)}
            color={"danger"}
          >
            Edit Order
          </CButton>
        </CFormGroup>
      </CCol>

      <CCol lg={12}>
        <CCard>
          <div className="table-responsive">
            <table className="table">
              {state.details ? (
                <tbody>
                  <tr>
                    <th>Service</th>
                    <ServiceName
                      serviceId={state.details.service.service_id}
                    ></ServiceName>
                  </tr>
                  <tr>
                    <th>Sub Service</th>
                    <SubServiceName
                      serviceId={state.details.service.service_id}
                      subServiceId={state.details.service.sub_service_id}
                    ></SubServiceName>
                  </tr>
                  <tr>
                    <th>Time</th>
                    <td>{state.details.time}</td>
                  </tr>
                  <tr>
                    <th>Ticket ID</th>
                    <td>{state.details.ticketId}</td>
                  </tr>

                  <tr>
                    <th>Charge per unit</th>
                    <td>{state.details.service.charge}</td>
                  </tr>
                  <tr>
                    <th>Charge type</th>
                    <td>{state.details.service.charge_type}</td>
                  </tr>
                  <tr>
                    <th>Duration</th>
                    <td>{state.details.duration}</td>
                  </tr>
                  <tr>
                    {" "}
                    <th>Guaranteed</th>
                    <td>{state.details.service.guaranteed ? "yes" : "no"}</td>
                  </tr>
                  {state.details.customer_id !== null ? (
                    <tr>
                      <th>Customer</th>
                      <td
                        onClick={() => {
                          history.push("/users/" + state.details.customer_id);
                          // history.go(0)
                        }}
                      >
                        <CustomerName
                          id={state.details.customer_id}
                        ></CustomerName>
                      </td>
                    </tr>
                  ) : (
                    <></>
                  )}
                  <tr>
                    <th>Provider</th>
                    <td
                      onClick={() => {
                        if (state.details.provider_id) {
                          history.push(
                            "/service_providers/" + state.details.provider_id
                          );
                        }
                        // history.go(0)
                      }}
                    >
                      {state.provider && (
                        <ServiceProviderName
                          id={state.details.provider_id}
                          name={state.provider.name}
                        ></ServiceProviderName>
                      )}
                    </td>
                  </tr>

                  {state.details.customer_id !== null ? (
                    <tr>
                      <th>Order Status</th>
                      <td
                        onClick={() => {
                          // history.push('/users/' + state.details.customer_id)
                          // history.go(0)
                        }}
                      >
                        {/*{state.details.status}*/}
                        <div>
                          <CDropdown className="mt-2">
                            <CDropdownToggle
                              caret
                              color="info"
                              varient={"outline"}
                            >
                              {state.details.status}
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem header>Status</CDropdownItem>
                              <CDropdownItem divider />
                              <CDropdownItem
                                onClick={() => updatedStatus("New")}
                              >
                                New
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("SURVEY COMPLETED")}
                              >
                                SURVEY COMPLETED
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("ESTIMATE PREPARING")}
                              >
                                ESTIMATE PREPARING
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => updatedStatus("RECIEVED PO")}
                              >
                                RECIEVED PO
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedStatus("RESCHEDULED")}
                              >
                                RESCHEDULED
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedStatus("BILL PENDING")}
                              >
                                BILL PENDING 
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedStatus("BILL SUBMITTED")}
                              >
                                BILL SUBMITTED
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedStatus("BILL SETTLED")}
                              >
                                BILL SETTLED
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedStatus("SUBMITTED ESTIMATE")}
                              >
                                SUBMITTED ESTIMATE
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedStatus("WORK CANCELLED(AD)")}
                              >
                                WORK CANCELLED(AD)
                              </CDropdownItem>

                              <CDropdownItem
                                onClick={() => updatedStatus("CUSTOMER CANCELLED")}
                              >
                                CUSTOMER CANCELLED
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <></>
                  )}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td>
                      {" "}
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}{" "}
            </table>
          </div>
        </CCard>
      </CCol>
      <CCol lg={6}>
        <CCard>
          <CCardHeader>
            <CButton
              color="info"
              onClick={(e) => {
                getEligibleProvidersList();
              }}
            >
              Fetch Alternate service provider
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CFormGroup>
              <select
                required
                className="form-control"
                value={providers.selected_provider}
                onChange={(e) => {
                  providers.selected_provider = e.target.value;
                  getCharges();
                }}
              >
                <option value={"-1"}>Select Service Provider</option>

                {providers.providerList.map((s, index) => {
                  return (
                    <option key={index} value={index}>
                      {s.name}
                      {" | "}
                      {s.phone}
                    </option>
                  );
                })}
              </select>
            </CFormGroup>
            <CFormGroup>
              <select
                required
                className="form-control"
                value={providers.selected_charge}
                onChange={(e) => {
                  setProviders({
                    ...providers,
                    selected_charge: e.target.value,
                  });
                }}
              >
                <option value={"-1"}>Select Charge</option>

                {providers.charges.map((s, index) => {
                  return (
                    <option key={index} value={index}>
                      {s.charge} {s.charge_type}
                    </option>
                  );
                })}
              </select>
            </CFormGroup>
            <CFormGroup>
              <CButton
                onClick={(e) => {
                  e.preventDefault();
                  updateProvider();
                }}
                color={"primary"}
              >
                Update
              </CButton>
            </CFormGroup>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={6}>
        <CCard>
          <CCardHeader>
           Notes
          </CCardHeader>
          <CCardBody>

<CForm onSubmit={addNote}  >
  <CFormGroup>
<CTextarea name="note"
onChange={(e) => {
                  formik.handleChange(e);
                }}>

</CTextarea>
  </CFormGroup>
  <CButton
             type="submit"
                color="primary"
              >
                Add Note
              </CButton>
</CForm>

          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>Notes</CCardHeader>
          <CCardBody>
            <div className="table-responsive">
              <table className="table">
                {state.details !== null && state.details.notes != null ? (
                  <tbody>
                    {state.details.notes.map((item) => {
                      return (
                        <>
                          {
                            <tr>
                              <td>{item}</td>
                            </tr>
                          }
                        </>
                      );
                    })}
                  </tbody>
                ) : (
                  <></>
                )}
              </table>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={6}>
        <CWidgetProgress
          color="success"
          footer={
            state.details !== null
              ? (state.details.amountPaid * 100) / state.details.total + "%"
              : " "
          }
          value={
            state.details !== null
              ? (state.details.amountPaid * 100) / state.details.total
              : 0
          }
          text="Paid / Total"
          header={
            state.details !== null
              ? state.details.amountPaid + " / " + state.details.total
              : " "
          }
        />
      </CCol>

      <CCol lg={6}>
        <CWidgetSimple
          header="Status"
          text={state.details !== null ? state.details.status : " "}
        >
          {state.details !== null ? state.details.timestamp : " "}
        </CWidgetSimple>
      </CCol>
      <CCol lg={12}>
        <CWidgetSimple
          text={
            state.details !== null
              ? state.details.address.line1 +
                "," +
                state.details.address.line2 +
                "," +
                state.details.address.city +
                "," +
                state.details.address.state +
                "," +
                state.details.address.country +
                "," +
                state.details.address.pincode
              : " "
          }
          header="Address"
        ></CWidgetSimple>
      </CCol>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>Payment Details</CCardHeader>
          <CCardBody>
            <div className="table-responsive">
              <table className="table">
                {state.details !== null && state.details.payments != null ? (
                  <tbody>
                    {state.details.payments.map((item) => {
                      return (
                        <>
                          {
                            <tr>
                              <td>{item.id}</td>
                              <td>{item.amount}</td>
                            </tr>
                          }
                        </>
                      );
                    })}
                  </tbody>
                ) : (
                  <></>
                )}
              </table>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  ) : (
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Order;
