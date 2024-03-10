import React, { useState, useEffect, createRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInputGroup,
  CButton,
  CCollapse,
  CRow,
  CInputGroupPrepend,
  CInputGroupText,
  CSpinner,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useFormik } from "formik";
import { firestore } from "firebase";
import SearchableSelect from "./searchableSelect";

const initialFormState = {
  user: "-1",
  address: "-1",
  service: "-1",
  sub_service: "-1",
  provider: "-1",
  supervisor: "-1",
  charge: "-1",
  date: "",
  time: "",
  duration: "",
  newUser: null,
  newAddress: null,
  userModal: false,
  addressModal: false,
  supervisor_service: ""
};

export const CreateOrder = ({ match }) => {
  const formRef = createRef();

  const [formState, setFormState] = useState(initialFormState);
  const formik = useFormik({ initialValues: initialFormState });

  const newAddress = useFormik({
    initialValues: {
      line1: null,
      line2: null,
      state: null,
      city: null,
      country: null,
      pincode: null,
    },
  });

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

  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(-1);

  const [collapse, setCollapse] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = (e) => {
    e.preventDefault();
    setCollapse(!collapse);
  };
  const [supervisorServices, setSupervisorServices] = useState([]);

  useEffect(() => {
    getUsers();
    // getServices();
    getCities();
    getSupervisor()
  }, []);

  const getUsers = () => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((value) => {
        let addresses = [];
        const users = value.docs.map((doc, i) => {
          if (match.params.userId && match.params.userId === doc.id) {
            formik.setFieldValue("user", i);
            if (
              doc.data().addresses != null &&
              doc.data().addresses.length > 0
            ) {
              addresses = doc.data().addresses;
              if (addresses.length === 1) {
                formik.setFieldValue("address", 0);
              }
            }
          }

          return {
            ...doc.data(),
            id: doc.id,
          };
        });

        setUserDetails({
          ...userDetails,
          selected_user: "-1",
          selected_address: "-1",
          addresses,
          users,
        });
      })
      .catch((e) => {
        console.log(e);
        setUserDetails({ ...userDetails });
      });
  };

  const getCities = async () => {
    const citiesDoc = await firebase.firestore().collection("cities").get();
    setCities(citiesDoc.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const getServices = (city) => {
    formik.setFieldValue("service", initialFormState.service);

    formik.setFieldValue("sub_service", initialFormState.sub_service);
    formik.setFieldValue("provider", initialFormState.provider);
    formik.setFieldValue("charge", initialFormState.charge);
    firebase
      .firestore()
      .collection("services")
      .where("cities", "array-contains", cities[city].name)

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

  const toggleUserModal = (e) => {
    e.preventDefault();
    formik.setFieldValue("userModal", !formik.values.userModal);
    // setFormState({
    //   ...formState,
    //   userModal: !formState.userModal,
    // });
  };

  const toggleAddressModal = (e) => {
    e.preventDefault();
    // setFormState({
    //   ...formState,
    //   addressModal: !formState.addressModal,
    // });
    formik.setFieldValue("addressModal", !formik.values.addressModal);
  };

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
                ...subService.data(),
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
  async function getSupervisorList(serviceIndex) {
    let selectedServiceProviders = [...supervisorServices[serviceIndex].providers];
    var resolvedProvider = [];
    if (selectedServiceProviders != null) {
      let batches = [];
      while (selectedServiceProviders.length) {
        // firestore limits batches to 10
        const batch = selectedServiceProviders.splice(0, 10);

        // add the batch request to to a queue
        batches.push(
          new Promise(response => {
            firebase
              .firestore()
              .collection("providers")
              .where(firestore.FieldPath.documentId(), "in", batch)
              .get()
              .then(results => response(results.docs.map(result => ({ ...result.data(), id: result.id })).filter(item => item.verified)))
          })
        )
      }
      let content = await Promise.all(batches);
      resolvedProvider = content.flat();
    }
    setSuperisorList(resolvedProvider);
  }
  const [superisorList, setSuperisorList] = useState([]);

  const getSupervisor = async () => {
    const resolvedProvider = await firebase
      .firestore()
      .collection("/services/tssSVIVmt35yrydUZxW8/subservices")
      .get()
      .then(async (subServices) => {
        const resolvedServices = [];
        for (const subService of subServices.docs) {
          if (subService.data().providers != null) {
            const subServiceData = subService.data();
            // const resolvedProvider = [];

            // for (const providerId of subServiceData.providers) {
            //   let provider;

            //   if (providerId instanceof String) {
            //     provider = await firebase
            //       .firestore()
            //       .collection("providers")
            //       .doc(providerId)
            //       .get();
            //   } else {
            //     provider = (
            //       await firebase
            //         .firestore()
            //         .collection("providers")
            //         .where(firestore.FieldPath.documentId(), "==", providerId)
            //         .get()
            //     ).docs[0];
            //   }

            //   if (!!provider?.data() && provider?.data().verified === true) {
            //     resolvedProvider.push({
            //       ...provider.data(),
            //       id: provider.id,
            //     });
            //   }
            // }

            resolvedServices.push({
              ...subServiceData,
              id: subService.id,
              // providers: resolvedProvider,
            });
          }
        }

        return resolvedServices;
      });

    setSupervisorServices(resolvedProvider);
  }
  const getAddresses = (userIndex) => {
    // setFormState({
    //   ...formState,
    //   address: '-1'
    // });

    if (userIndex === "-1") {
      setUserDetails({
        ...userDetails,
        // selected_address: "-1",
        addresses: [],
      });
    } else {
      if (userDetails.users[userIndex]?.addresses != null) {
        setUserDetails({
          ...userDetails,
          // selected_address: "-1",
          addresses: userDetails.users[userIndex].addresses,
        });
      } else {
        setUserDetails({
          ...userDetails,
          // selected_address: "-1",
          addresses: [],
        });
      }
    }
  };

  const getProviders = async (subServiceIndex) => {
    // setFormState({
    //   ...formState,
    //   provider: '-1',
    //   charge: '-1',
    // })

    formik.setFieldValue("provider", initialFormState.provider);
    formik.setFieldValue("charge", initialFormState.charge);
    formik.setFieldValue("supervisor", initialFormState.supervisor);

    if (subServiceIndex === "-1") {
      setProviderDetails({
        ...providerDetails,
        // selected_charge: "-1",
        // selected_provider: "-1",
        charges: [],
        providers: [],
      });
    } else {
      // firebase
      //   .firestore()
      //   .collection("services")
      //   .doc(providerDetails.services[formik.values.service].id)
      //   .collection("subservices")
      //   .doc(providerDetails.subservices[subServiceIndex].id)
      //   .get()
      //   .then(async (subService) => {

      //   });
      let subService = providerDetails.subservices[subServiceIndex]

      let selectedServiceProviders = [...subService.providers];
      let resolvedProvider = [];

      if (selectedServiceProviders != null) {
        let batches = [];
        while (selectedServiceProviders.length) {
          // firestore limits batches to 10
          const batch = selectedServiceProviders.splice(0, 10);

          // add the batch request to to a queue
          batches.push(
            new Promise(response => {
              firebase
                .firestore()
                .collection("providers")
                .where(firestore.FieldPath.documentId(), "in", batch)
                .where("cities", "array-contains", cities[city].name)

                .get()
                .then(results => response(results.docs.map(result => ({ ...result.data(), id: result.id })).filter(item => item.verified)))
            })
          )
        }
        let content = await Promise.all(batches);
        resolvedProvider = content.flat();
      }
      setProviderDetails({
        ...providerDetails,
        charges: [],
        providers: resolvedProvider,

      });
    }
  };

  const checkCity = (provider) => {
    const providerCities = provider.data().cities;
    if (!providerCities) return false;
    for (let i = 0; i < providerCities.length; i++) {
      if (providerCities[i].toLowerCase() === cities[city].name.toLowerCase())
        return true;
    }
    return false;
  };

  const addNewBooking = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (
      (formik.values.address === "-1" && !newAddress.isValid) ||
      (formik.values.user === "-1" && formik.values.newUser === null) ||
      formik.values.charges === "-1" ||
      formik.values.service === "-1" ||
      formik.values.sub_service === "-1" ||
      formik.values.provider === "-1" ||
      formik.values.date === null ||
      formik.values.time === null ||
      formik.values.duration === null ||
      city === -1
    ) {
      alert("All fields are mandatory");
      setLoading(false);
      return;
    }

    const rC = providerDetails.charges[formik.values.charge].reduceChargeAfter;
    const rP =
      providerDetails.charges[formik.values.charge].reduceChargePercent;
    const Ch = providerDetails.charges[formik.values.charge].charge;

    const address =
      formik.values.address !== "-1"
        ? userDetails.addresses[formik.values.address]
        : newAddress.values;

    // const ticketId = address.state.substr(0, 2).toUpperCase() + Date.now();

    const shortService = String(
      providerDetails.services[formik.values.service]?.name
    )
      .split(" ")
      .map((data) => data.substring(0, 1).toUpperCase())
      .join("")
      .trim();
    const shortSubsService = String(
      providerDetails.subservices[formik.values.sub_service]?.name
    )
      .split(" ")
      .map((data) => data.substring(0, 1).toUpperCase())
      .join("")
      .trim();
    const ticketId =
      address.state.substring(0, 2).toUpperCase() +
      cities[city]?.name.substring(0, 2).toUpperCase() +
      shortService +
      shortSubsService +
      Date.now();

    try {
      const orderObject = {
        address,
        amountPaid: 0.0,
        customer_id:
          formik.values.user !== "-1"
            ? userDetails.users[formik.values.user].id
            : "+91" + formik.values.newUser,
        duration: formik.values.duration,
        city: cities[city]?.name,
        provider_id: providerDetails.providers[formik.values.provider].id,
        service: providerDetails.charges[formik.values.charge],
        status: "new",
        time: formik.values.date + " " + formik.values.time,
        timestamp: new Date().toLocaleString("sv").substring(0, 16),
        ticketId: ticketId,
        total:
          formik.values.duration > rC
            ? Ch * rC + (Ch * rP * (formik.values.duration - rC)) / 100
            : formik.values.duration * Ch,
      };

      console.log(orderObject);

      console.log(ticketId);

      await firebase.firestore().collection("orders").add(orderObject);
      // console.log(orderObject);
      if (formik.values.supervisor !== "-1") {
        const supervisorJobData = {
          service: providerDetails.charges[formik.values.charge].service_id,
          provider: superisorList[formik.values.supervisor].id,
          parent_TicketId: ticketId,
          status: "new",
          timestamp: new Date(),
          last_updated: new Date(),
        };
        // console.log(supervisorJobData);
        await firebase
          .firestore()
          .collection("supervisorJobs")
          .add(supervisorJobData);
      }

      alert("Successfully Booked");
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

      <CCardHeader onClick={toggle}>New Booking</CCardHeader>
      <CCardBody>
        <CForm innerRef={formRef} onSubmit={addNewBooking}>
          <CFormGroup>
            {match.params.userId ? (
              <CInput
                type="text"
                value={userDetails.users[formik.values.user]?.phone}
                readOnly
              />
            ) : (
              <>
                <SearchableSelect
                  placeholder="Select User"
                  onChange={(value) => {
                    formik.setFieldValue("user", value);
                    getAddresses(value);
                  }}
                  list={userDetails.users.map((user, i) => ({
                    name: user.phone,
                    value: i,
                  }))}
                />
                <CButton
                  color="link"
                  className="px-0"
                  onClick={toggleUserModal}
                >
                  Didn't find the user?
                </CButton>
              </>
            )}

            <CCollapse show={formik.values.userModal}>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText>+91</CInputGroupText>
                </CInputGroupPrepend>
                <CInput
                  type="number"
                  id="newUser"
                  name="newUser"
                  value={formik.values.newUser || ""}
                  placeholder="phone number (10 digits)"
                  onChange={(e) => {
                    // setFormState({
                    //   ...formState,
                    //   newUser: "+91" + e.target.value
                    // })
                    formik.handleChange(e);
                  }}
                />
              </CInputGroup>
            </CCollapse>
          </CFormGroup>
          <CFormGroup>
            <select
              required
              name="address"
              id="address"
              className="form-control"
              value={formik.values.address}
              onChange={(e) => {
                formik.handleChange(e);
              }}
            >
              <option value={"-1"}>Select Address</option>

              {userDetails.addresses.map((s, index) => {
                return (
                  <option key={index} value={index}>
                    {s.line1}
                    {","}
                    {s.line2}
                    {","}
                    {s.city}
                    {","}
                    {s.state}
                    {","}
                    {s.country}
                    {","}
                    {s.pincode}
                  </option>
                );
              })}
            </select>
            <CButton color="link" className="px-0" onClick={toggleAddressModal}>
              {match.params.userId
                ? "Add new address"
                : "Didn't find the address?"}
            </CButton>
            <CCollapse show={formik.values.addressModal}>
              <CInputGroup>
                <CInput
                  required={formik.values.address === "-1" ? true : false}
                  name="line1"
                  type="text"
                  placeholder="Line1"
                  onChange={(e) => {
                    newAddress.handleChange(e);
                  }}
                />
                <CInput
                  type="text"
                  placeholder="Line2"
                  name="line2"
                  required={formik.values.address === "-1" ? true : false}
                  onChange={(e) => {
                    newAddress.handleChange(e);
                  }}
                />
                <CInput
                  type="text"
                  placeholder="City"
                  name="city"
                  required={formik.values.address === "-1" ? true : false}
                  onChange={(e) => {
                    newAddress.handleChange(e);
                  }}
                />
                <CInput
                  type="text"
                  placeholder="State"
                  name="state"
                  required={formik.values.address === "-1" ? true : false}
                  onChange={(e) => {
                    newAddress.handleChange(e);
                  }}
                />
                <CInput
                  type="text"
                  placeholder="Country"
                  name="country"
                  required={formik.values.address === "-1" ? true : false}
                  onChange={(e) => {
                    newAddress.handleChange(e);
                  }}
                />
                <CInput
                  type="number"
                  placeholder="Pincode"
                  name="pincode"
                  required={formik.values.address === "-1" ? true : false}
                  onChange={(e) => {
                    newAddress.handleChange(e);
                  }}
                />
              </CInputGroup>
            </CCollapse>
          </CFormGroup>
          <CFormGroup>
            <SearchableSelect
              placeholder="Select City"
              onChange={(value) => {
                setCity(value);
                getServices(value)
              }}
              list={cities.map((city, i) => ({
                name: city.name,
                value: i,
              }))}
            />
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
                // formState.handleChange(e);
                // providerDetails.selected_sub_service = e.target.value
                // setFormState({
                //   ...formState,
                //   sub_service: e.target.value,
                //   provider: '-1',
                //   charge: '-1',
                // })
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
            <select
              required

              className="form-control"
              value={formik.values.provider}
              onChange={(e) => {

                formik.setFieldValue("provider", e.target.value);
                getCharges(e.target.value);
              }}
            >
              <option value={"-1"}>Select Service Provider</option>
              {providerDetails.providers.map((provider, index) => {
                return (
                  <option key={index} value={index} style={{ background: provider.status ? "#90EE90" : "#ffcccb" }} >
                    {`${provider.name} | ${provider.phone}`}
                  </option>
                );
              })}
            </select>
          </CFormGroup>
          {/* <CFormGroup>
            <SearchableSelect
              placeholder="Select Provider"
              value={formik.values.provider}
              onChange={(value) => {
                formik.setFieldValue("provider", value);
                getCharges(value);
              }}
              list={providerDetails.providers.map((provider, i) => ({
                name: `${provider.name} | ${provider.phone}`,
                value: i,
              }))}
            />
          </CFormGroup> */}

          <CFormGroup>
            <select
              required
              name="charge"
              id="charge"
              value={formik.values.charge}
              className="form-control"
              onChange={(e) => {
                // formState.handleChange(e);
                // setFormState({
                //   ...formState,
                //   charge: e.target.value
                // })
                formik.handleChange(e);

                // setProviderDetails({
                //   ...providerDetails,
                //   selected_charge: e.target.value
                // })
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
          {/* <CFormGroup>
            <SearchableSelect
              placeholder="Select Supervisor"
              value={formik.values.supervisor}
              onChange={(value) => {
                formik.setFieldValue("supervisor", value);
                // getCharges(value);
              }}
              list={providerDetails.providers.map((provider, i) => ({
                name: `${provider.name} | ${provider.phone}`,
                value: i,
              }))}
            />
          </CFormGroup> */}
          <CFormGroup>
            <select
              required
              name="service"
              id="service"
              className="form-control"
              value={formik.values.supervisor_service}
              onChange={(e) => {
                formik.setFieldValue("supervisor_service", e.target.value);


                getSupervisorList(e.target.value);
              }}
            >
              <option value="-1">Select Supervisor Service</option>
              {supervisorServices.map((s, index) => {
                return (
                  <option key={s.id} value={index}>
                    {s.name}
                  </option>
                );
              })}
            </select>
          </CFormGroup>
          <CFormGroup>
            <CFormGroup>
              <SearchableSelect
                placeholder="Select Supervisor"
                value={formik.values.supervisor}
                onChange={(value) => {

                  // return;
                  let v = supervisorServices[formik.values.supervisor_service].providers.indexOf(superisorList[value].id)


                  formik.setFieldValue("supervisor", v);
                }}
                list={superisorList.map((provider, i) => {
                  return {
                    name: `${provider.name} | ${provider.phone}`,
                    value: i,
                  }


                })}
              />
            </CFormGroup>
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
                    // formState.handleChange(e);
                    // setFormState({
                    //   ...formState,
                    //   date: e.target.value
                    // })
                    formik.handleChange(e);

                    // setOrderDetails({
                    //   ...orderDetails,
                    //   date: e.target.value
                    // })
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
                    // formState.handleChange(e);
                    // setFormState({
                    //   ...formState,
                    //   time: e.target.value
                    // })
                    formik.handleChange(e);

                    // setOrderDetails({
                    //   ...orderDetails,
                    //   time: e.target.value
                    // })
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
                // formState.handleChange(e);
                formik.handleChange(e);
                // setFormState({
                //   ...formState,
                //   duration: e.target.value
                // })
                // setOrderDetails({
                //   ...orderDetails,
                //   duration: parseFloat(e.target.value)
                // })
              }}
            />
          </CFormGroup>
          {loading ? (
            <CSpinner size="small" color="info" />
          ) : (
            <CButton type="submit" color="success" disabled={loading}>
              Create Order
            </CButton>
          )}
        </CForm>
      </CCardBody>
    </CCard>
  );
};
