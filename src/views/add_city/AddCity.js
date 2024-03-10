import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CButton,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import SearchableSelect from "../orders/searchableSelect";

const AddCity = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setsubmitLoading] = useState(false);
  // const [providers, setProviders] = useState([]);
  // const [provider, setProvider] = useState(-1);
  const [city, setCity] = useState("");

  useEffect(() => {
    // getProviders();
  }, []);

  // const getProviders = async () => {
  //   setLoading(true);
  //   const db = firebase.firestore();
  //   const services = {};
  //   const subServices = {};
  //   const providersData = await db.collection("providers").get();

  //   const resolvedProviders = await Promise.all(
  //     providersData.docs.map(async (providerData) => {
  //       const service = providerData.data().services;
  //       const serviceId = service ? service[0]?.service_id : null;
  //       let serviceName = "";
  //       if (serviceId) {
  //         if (services[serviceId]) serviceName = services[serviceId].name;
  //         else {
  //           const service = await db
  //             .collection("services")
  //             .doc(serviceId)
  //             .get();
  //           services[serviceId] = {
  //             id: service.id,
  //             ...service.data(),
  //           };
  //           serviceName = service.data()?.name;
  //         }
  //       }

  //       return {
  //         id: providerData.id,
  //         ...providerData.data(),
  //         serviceName: serviceName || "No Service",
  //       };
  //     })
  //   );

  //   setProviders(resolvedProviders);
  //   setLoading(false);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (city.trim() === "") {
      alert("All fields are required!!");
      return;
    }

    setsubmitLoading(true);
    try {
      const docs = await (
        await firebase
          .firestore()
          .collection("cities")
          .where("name", "==", city.trim().toUpperCase())
          .get()
      ).docs;
      if (docs.length > 0) {
        alert("City Already Added!");
      } else {
        await firebase.firestore().collection("cities").add({
          name: city.trim().toUpperCase(),
        });
        alert("City added successfully");
        setCity("");
      }
    } catch (err) {
      alert("Something went wrong!!");
    }
    setsubmitLoading(false);
  };

  // const displayCities = (index) => {
  //   const cities = providers[index].cities;
  //   return cities ? cities.join(", ") : "No Cities Assigned";
  // };

  return (
    <CCard>
      <CCardHeader>Add City</CCardHeader>
      <CCardBody>
        {!loading ? (
          <CForm onSubmit={handleSubmit}>
            {/* <CFormGroup>
              <SearchableSelect
                placeholder="Select Provider"
                onChange={(value) => {
                  setProvider(value);
                }}
                list={providers.map((provider, i) => ({
                  name: `${provider.name} | ${provider.phone} | ${provider.serviceName}`,
                  value: i,
                }))}
              />
            </CFormGroup>
            {provider !== -1 && (
              <CFormGroup>
                <CLabel
                  style={{
                    marginLeft: "6px",
                  }}
                >
                  Cities
                </CLabel>
                <br />
                <CLabel
                  style={{
                    marginLeft: "6px",
                  }}
                >
                  {displayCities(provider)}
                </CLabel>
              </CFormGroup>
            )} */}

            <CFormGroup>
              <CInput
                placeholder="City"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </CFormGroup>
            <CFormGroup>
              {submitLoading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <CButton type="submit" color="success" disabled={submitLoading}>
                  Add City
                </CButton>
              )}
            </CFormGroup>
          </CForm>
        ) : (
          <CSpinner size="small" color="info" />
        )}
      </CCardBody>
    </CCard>
  );
};

export default AddCity;
