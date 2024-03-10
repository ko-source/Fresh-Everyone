import React, { useState, useEffect, createRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CButton,
  CRow,
  CSpinner,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useFormik } from "formik";
import { firestore } from "firebase";
import SearchableSelect from "./searchableSelect";
import { getOrder as fetchOrderFromDB } from "../../utils/database_fetch_methods";

const initialFormState = {
  provider: "-1",
  charge: "-1",
  date: "",
  time: "",
  duration: "",
  // userModal: false,
  // addressModal: false,
};

export const DuplicateOrder = ({ match }) => {
  const formRef = createRef();

  const formik = useFormik({ initialValues: initialFormState });

  const [providerDetails, setProviderDetails] = useState({
    providers: [],
    charges: [],
  });

  const [collapse, setCollapse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gettingOrder, setGettingOrder] = useState(true);

  var [state, setState] = useState({
    details: null,
  });

  const toggle = (e) => {
    e.preventDefault();
    setCollapse(!collapse);
  };

  useEffect(() => {
    // getUsers();
    console.log(match.params.id);

    setGettingOrder(true);
    getOrder()
      .then((order) => getProviders(order))
      .then(() => {
        setGettingOrder(false);
      });
    // getServices();
  }, []);

  const getCharges = (providerIndex) => {
    formik.setFieldValue("charge", initialFormState.charge);

    if (providerIndex === "-1") {
      setProviderDetails({
        ...providerDetails,
        // selected_charge: "-1",
        charges: [],
      });
    } else {
      const resolvedCharges = providerDetails.providers[
        providerIndex
      ].services.filter((service) => {
        if (
          service["charge"] !== undefined &&
          service["charge_type"] !== undefined &&
          service["service_id"] === state.details.service.service_id &&
          service["sub_service_id"] === state.details.service.sub_service_id
        ) {
          return true;
        } else {
          return false;
        }
      });

      setProviderDetails({
        ...providerDetails,
        // selected_charge: "-1",
        charges: resolvedCharges,
      });
    }
  };

  // const getAddresses = (userIndex) => {
  //   // setFormState({
  //   //   ...formState,
  //   //   address: '-1'
  //   // });

  //   if (userIndex === "-1") {
  //     setUserDetails({
  //       ...userDetails,
  //       // selected_address: "-1",
  //       addresses: []
  //     });

  //   } else {
  //     if (userDetails.users[userIndex]?.addresses != null) {
  //       setUserDetails({
  //         ...userDetails,
  //         // selected_address: "-1",
  //         addresses: userDetails.users[userIndex].addresses
  //       })
  //     } else {
  //       setUserDetails({
  //         ...userDetails,
  //         // selected_address: "-1",
  //         addresses: []
  //       })
  //     }
  //   }
  // }

  const getProviders = async (order) => {
    // let providers = await firebase.firestore().collection("providers").where('verified', '==', true).get();

    // const resolvedProvider = providers.docs
    //   .filter(provider => !!provider?.data() && provider?.data().verified === true)
    //   .map(provider => {
    //     if (!!provider?.data().blacklisted && provider?.data().blacklisted == false) {
    //       return {
    //         ...provider.data(),
    //         id: provider.id,
    //       };
    //     } else {
    //       return {
    //         ...provider.data(),
    //         id: provider.id,
    //       }
    //     }
    //   });

    const resolvedProvider = await firebase
      .firestore()
      .collection("services")
      .doc(order.service.service_id)
      .collection("subservices")
      .doc(order.service.sub_service_id)
      .get()
      .then(async (subService) => {
        if (subService.data().providers != null) {
          const subServiceData = subService.data();
          const resolvedProvider = [];

          for (const providerId of subServiceData.providers) {
            let provider;

            if (providerId instanceof String) {
              provider = await firebase
                .firestore()
                .collection("providers")
                .doc(providerId)
                .get();
            } else {
              provider = (
                await firebase
                  .firestore()
                  .collection("providers")
                  .where(firestore.FieldPath.documentId(), "==", providerId)
                  .get()
              ).docs[0];
            }

            if (!!provider?.data() && provider?.data().verified === true) {
              resolvedProvider.push({
                ...provider.data(),
                id: provider.id,
              });
            }
          }

          return resolvedProvider;
        } else {
          return [];
        }
      });

    setProviderDetails({
      ...providerDetails,
      providers: resolvedProvider,
      charges: [],
    });
  };

  const addNewBooking = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (
      formik.values.charges === "-1" ||
      formik.values.provider === "-1" ||
      formik.values.date === null ||
      formik.values.time === null ||
      formik.values.duration === null
    ) {
      alert("All fields are mandatory");
      setLoading(false);
      return;
    }

    const rC = providerDetails.charges[formik.values.charge].reduceChargeAfter;
    const rP =
      providerDetails.charges[formik.values.charge].reduceChargePercent;
    const Ch = providerDetails.charges[formik.values.charge].charge;

    // const address = formik.values.address !== "-1" ? userDetails.addresses[formik.values.address] : newAddress.values;
    const address = state.details.address;
    try {
      const orderObject = {
        address,
        amountPaid: 0.0,
        customer_id: state.details.customer_id,
        duration: formik.values.duration,
        provider_id: providerDetails.providers[formik.values.provider].id,
        service: providerDetails.charges[formik.values.charge],
        status: "new",
        time: formik.values.date + " " + formik.values.time,
        timestamp: new Date().toLocaleString("sv").substring(0, 16),
        ticketId: address.state.substr(0, 2).toUpperCase() + Date.now(),
        parent_ticketId:
          state.details.parent_ticketId || state.details.ticketId,
        total:
          formik.values.duration > rC
            ? Ch * rC + (Ch * rP * (formik.values.duration - rC)) / 100
            : formik.values.duration * Ch,
      };

      await firebase.firestore().collection("orders").add(orderObject);

      if (!state.details.parent_ticketId) {
        await firebase
          .firestore()
          .collection("orders")
          .doc(match.params.id)
          .update({
            parent_ticketId: state.details.ticketId,
          });
      }

      alert("Successfully Booked");
      // formState(initialFormState);
      formik.resetForm();
      setProviderDetails({
        ...providerDetails,
        providers: [],
        charges: [],
      });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const getOrder = async () => {
    const order = await fetchOrderFromDB(match.params.id);

    setState({
      ...state,
      details: order,
    });

    return order;
  };

  return gettingOrder ? (
    <CSpinner size="small" color="info" />
  ) : (
    <CCard>
      <CCardHeader onClick={toggle}>Duplicate order for same user</CCardHeader>
      <CCardBody>
        <CForm innerRef={formRef} onSubmit={addNewBooking}>
          <CFormGroup>
            <CFormGroup>
              <SearchableSelect
                placeholder="Select Provider"
                value={formik.values.provider}
                onChange={(value) => {
                  formik.setFieldValue("provider", value);
                  console.log(value);
                  // getServices(value);
                  getCharges(value);
                }}
                list={providerDetails.providers.map((provider, i) => ({
                  name: `${provider.name} | ${provider.phone} | ${provider.location}`,
                  value: i,
                }))}
              />
            </CFormGroup>

            <CFormGroup>
              <select
                required
                name="charge"
                id="charge"
                value={formik.values.charge}
                className="form-control"
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              >
                <option value={"-1"}>Select Charge</option>
                {providerDetails.charges.map((s, index) => {
                  return (
                    <option key={index} value={index}>
                      {s.charge} {s.charge_type}
                    </option>
                  );
                })}
              </select>
            </CFormGroup>
            <CFormGroup>
              <CRow>
                <CCol>
                  <CInput
                    required
                    name="date"
                    id="date"
                    value={formik.values.date}
                    type="date"
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                </CCol>
                <CCol>
                  <CInput
                    required
                    name="time"
                    id="time"
                    value={formik.values.time}
                    type="time"
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                </CCol>
              </CRow>
            </CFormGroup>
            <CFormGroup>
              <CInput
                name="duration"
                id="duration"
                value={formik.values.duration}
                type="number"
                required
                placeholder="Enter duration of service"
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
            </CFormGroup>
            {loading ? (
              <CSpinner size="small" color="info" />
            ) : (
              <CButton type="submit" color="success" disabled={loading}>
                Duplicate Order
              </CButton>
            )}
          </CFormGroup>
        </CForm>
      </CCardBody>
    </CCard>
  );
};
