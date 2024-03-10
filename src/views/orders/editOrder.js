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
  // CPagination
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useFormik } from "formik";
import { firestore } from "firebase";
import SearchableSelect from "./searchableSelect";
import { getOrder as fetchOrderFromDB } from "../../utils/database_fetch_methods";

const initialFormState = {
  user: "-1",
  address: "-1",
  service: "-1",
  sub_service: "-1",
  provider: "-1",
  charge: "-1",
  date: "",
  time: "",
  duration: "",
  newUser: null,
  newAddress: null,
  userModal: false,
  addressModal: false,
};

const EditOrder = ({ match }) => {
  const formRef = createRef();

  // const [formState, setFormState] = useState(initialFormState);
  const formik = useFormik({ initialValues: initialFormState });
  // const newAddress = useFormik({
  //   initialValues: {
  //     line1: null,
  //     line2: null,
  //     state: null,
  //     city: null,
  //     country: null,
  //     pincode: null,
  //   },
  // });

  // const [isUpdate, setIsUpdate] = useState(false);
  const [userDetails, setUserDetails] = useState({
    users: [],
    addresses: [],
    // selected_user: "-1",
    // selected_address: "-1",
  });
  const [providerDetails, setProviderDetails] = useState({
    services: [],
    subservices: [],
    providers: [],
    charges: [],
    // selected_charge: "-1",
    // selected_service: "-1",
    // selected_sub_service: "-1",
    // selected_provider: "-1",
  });

  // const [orderDetails, setOrderDetails] = useState({
  //   date: null,
  //   time: null,
  //   duration: null
  // })

  const [collapse, setCollapse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [useraddress, setUserAddress] = useState("");

  const toggle = (e) => {
    e.preventDefault();
    setCollapse(!collapse);
  };

  useEffect(() => {
    fetchOrderData();
    getServices();
  }, []);

  const fetchOrderData = async () => {
    console.log(match.params.id);
    if (match.params.id) {
      setLoading(true);
      // setIsUpdate(true);
      const order = await fetchOrderFromDB(match.params.id);
      console.log(order);

      await setUsername(order.name);
      await setUserAddress(order.address.city);
      await formik.setFieldValue("name", order.name);
      await formik.setFieldValue("phone", order.address.city);
      // await formData.setFieldValue('whatsapp', order.whatsapp.substring(3));
      await formik.setFieldValue("email", order.service);
      await formik.setFieldValue("description", order.subservice);
      await formik.setFieldValue("location", order.provider);
      await formik.setFieldValue("location", order.charge);
      await formik.setFieldValue("location", order.date);
      await formik.setFieldValue("location", order.time);
      await formik.setFieldValue("location", order.duration);

      setLoading(false);
    }
  };

  const getServices = () => {
    firebase
      .firestore()
      .collection("services")
      .get()
      .then((value) => {
        setProviderDetails({
          ...providerDetails,
          subservices: [],
          providers: [],
          charges: [],
          // selected_charge: "-1",
          // selected_sub_service: "-1",
          // selected_provider: "-1",
          // selected_service: "-1",
          services: value.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id,
            };
          }),
        });
      })
      .catch((e) => {
        setProviderDetails({ ...providerDetails });
      });
  };

  // const toggleUserModal = (e) => {
  //   e.preventDefault();
  //   formik.setFieldValue("userModal", !formik.values.userModal);
  //   // setFormState({
  //   //   ...formState,
  //   //   userModal: !formState.userModal,
  //   // });
  // };

  // const toggleAddressModal = (e) => {
  //   e.preventDefault();
  //   // setFormState({
  //   //   ...formState,
  //   //   addressModal: !formState.addressModal,
  //   // });
  //   formik.setFieldValue("addressModal", !formik.values.addressModal);
  // };

  const getSubServices = (serviceIndex) => {
    formik.setFieldValue("sub_service", initialFormState.sub_service);
    formik.setFieldValue("provider", initialFormState.provider);
    formik.setFieldValue("charge", initialFormState.charge);

    if (serviceIndex === "-1") {
      setProviderDetails({
        ...providerDetails,
        subservices: [],
        providers: [],
        charges: [],
        // selected_charge: "-1",
        // selected_provider: "-1",
        // selected_sub_service: "-1",
      });
    } else {
      firebase
        .firestore()
        .collection("services")
        .doc(providerDetails.services[serviceIndex].id)
        .collection("subservices")
        .get()
        .then((subServices) => {
          setProviderDetails({
            ...providerDetails,
            providers: [],
            charges: [],
            // selected_charge: "-1",
            // selected_provider: "-1",
            // selected_sub_service: "-1",
            subservices: subServices.docs.map((subService) => {
              return {
                name: subService.data().name,
                id: subService.id,
              };
            }),
          });
        })
        .catch((e) => {
          // setProviderDetails({ ...providerDetails })
        });
    }
  };

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
          service["service_id"] ===
            providerDetails.services[formik.values.service].id &&
          service["sub_service_id"] ===
            providerDetails.subservices[formik.values.sub_service].id
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
  //       addresses: [],
  //     });
  //   } else {
  //     if (userDetails.users[userIndex]?.addresses != null) {
  //       setUserDetails({
  //         ...userDetails,
  //         // selected_address: "-1",
  //         addresses: userDetails.users[userIndex].addresses,
  //       });
  //     } else {
  //       setUserDetails({
  //         ...userDetails,
  //         // selected_address: "-1",
  //         addresses: [],
  //       });
  //     }
  //   }
  // };

  const getProviders = (subServiceIndex) => {
    // setFormState({
    //   ...formState,
    //   provider: '-1',
    //   charge: '-1',
    // })

    formik.setFieldValue("provider", initialFormState.provider);
    formik.setFieldValue("charge", initialFormState.charge);

    if (subServiceIndex === "-1") {
      setProviderDetails({
        ...providerDetails,
        // selected_charge: "-1",
        // selected_provider: "-1",
        charges: [],
        providers: [],
      });
    } else {
      firebase
        .firestore()
        .collection("services")
        .doc(providerDetails.services[formik.values.service].id)
        .collection("subservices")
        .doc(providerDetails.subservices[subServiceIndex].id)
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
                console.log(provider.data().name);
              } else {
                provider = (
                  await firebase
                    .firestore()
                    .collection("providers")
                    .where(firestore.FieldPath.documentId(), "==", providerId)
                    .get()
                ).docs[0];
                console.log(provider.data().name);
              }

              if (!!provider?.data() && provider?.data().verified === true) {
                if (!!provider?.data().blacklisted) {
                  if (provider?.data().blacklisted === false) {
                    resolvedProvider.push({
                      ...provider.data(),
                      id: provider.id,
                    });
                  }
                } else {
                  resolvedProvider.push({
                    ...provider.data(),
                    id: provider.id,
                  });
                }
              }
            }
            // subServiceData.providers.forEach(async providerId => {
            // })

            setProviderDetails({
              ...providerDetails,
              charges: [],
              providers: resolvedProvider,
              // selected_charge: "-1",
              // selected_provider: "-1",
            });

            // const list = [];
            // for (const i = 0; i < subService.data().providers.length; i++) {

            //   firebase.firestore().collection("providers").doc(subService.data().providers[i]).get().then((v) => {

            //     if (v.data()["verified"] === true) {
            //       list.push({
            //         ...v.data(),
            //         id: v.id,
            //       })

            //       setProviderDetails({
            //         ...providerDetails,
            //         charges: [],
            //         // selected_charge: "-1",
            //         // selected_provider: "-1",
            //         providers: list
            //       })
            //     }
            //   }).catch(e => {
            //     setProviderDetails({ ...providerDetails })
            //   })
            //     ;
            // }
          } else {
            setProviderDetails({
              ...providerDetails,
              charges: [],
              // selected_charge: "-1",
              // selected_provider: "-1",
              providers: [],
            });
          }
        });
    }
  };

  const addNewBooking = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (
      // (formik.values.address === "-1" && !newAddress.isValid)
      // || (formik.values.user === "-1" && formik.values.newUser === null)
      // ||
      formik.values.charges === "-1" ||
      formik.values.service === "-1" ||
      formik.values.sub_service === "-1" ||
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

    try {
      const orderObject = {
        // address,
        // amountPaid: 0.0,
        // customer_id: formik.values.user !== "-1" ? userDetails.users[formik.values.user].id :'+91'+ formik.values.newUser,
        duration: formik.values.duration,
        provider_id: providerDetails.providers[formik.values.provider].id,
        service: providerDetails.charges[formik.values.charge],
        // status: "new",
        time: formik.values.date + " " + formik.values.time,
        timestamp: new Date().toLocaleString("sv").substring(0, 16),
        // ticketId: address.state.substr(0, 2).toUpperCase() + Date.now(),
        total:
          formik.values.duration > rC
            ? Ch * rC + (Ch * rP * (formik.values.duration - rC)) / 100
            : formik.values.duration * Ch,
      };

      await firebase
        .firestore()
        .collection("orders")
        .doc(match.params.id)
        .update(orderObject);

      alert("Successfully Updated");
      // formState(initialFormState);
      formik.resetForm();
      setProviderDetails({
        ...providerDetails,
        subservices: [],
        providers: [],
        charges: [],
      });
      setUserDetails({
        ...userDetails,
        addresses: [],
      });
      // formRef.current.reset();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <CCard>
      <CCardHeader onClick={toggle}>Edit Order</CCardHeader>
      <CCardBody>
        <CForm innerRef={formRef} onSubmit={addNewBooking}>
          <CFormGroup>
            <CFormGroup>
              <h4> {username}</h4>
            </CFormGroup>
            <CFormGroup>
              <h4>{useraddress}</h4>
            </CFormGroup>

            <CFormGroup>
              <select
                required
                name="service"
                id="service"
                className="form-control"
                value={formik.values.service}
                onChange={(e) => {
                  formik.handleChange(e);
                  getSubServices(e.target.value);
                }}
              >
                <option value="-1">Select Service</option>
                {providerDetails.services.map((s, index) => {
                  return (
                    <option key={s.id} value={index}>
                      {s.name}
                    </option>
                  );
                })}
              </select>
            </CFormGroup>
            <CFormGroup>
              <select
                required
                name="sub_service"
                id="sub_service"
                className="form-control"
                value={formik.values.sub_service}
                onChange={(e) => {
                  formik.handleChange(e);

                  getProviders(e.target.value);
                }}
              >
                <option value={"-1"}>Select Sub Service</option>
                {providerDetails.subservices.map((s, index) => {
                  return (
                    <option key={index} value={index}>
                      {s.name}
                    </option>
                  );
                })}
              </select>
            </CFormGroup>
            <CFormGroup>
              <SearchableSelect
                placeholder="Select Provider"
                value={formik.values.provider}
                onChange={(value) => {
                  formik.setFieldValue("provider", value);
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
                Update Order
              </CButton>
            )}
          </CFormGroup>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default EditOrder;
