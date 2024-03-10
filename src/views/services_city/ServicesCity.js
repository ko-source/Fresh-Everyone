import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import SearchableSelect from "../orders/searchableSelect";

const ServicesCity = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setsubmitLoading] = useState(false);

  const [services, setServices] = useState([]);
  const [service, setService] = useState(-1);
  const [serviceCities, setServiceCities] = useState([]);

  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(-1);

  const db = firebase.firestore();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);

    // Services
    const servicesDocs = await db.collection("services").get();
    setServices(
      servicesDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );

    // Citites
    const citiesDoc = await db.collection("cities").get();
    setCities(citiesDoc.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (city === -1 || service === -1) {
      alert("All fields are required!!");
      return;
    }

    const isPresent = serviceCities.findIndex(
      (serviceCity) => serviceCity === cities[city].name
    );

    if (isPresent !== -1) {
      alert("City Already present");
      return;
    }

    setsubmitLoading(true);
    try {
      await db
        .collection("services")
        .doc(services[service].id)
        .update({
          cities: firebase.firestore.FieldValue.arrayUnion(cities[city].name),
        });
      setServiceCities([...serviceCities, cities[city].name]);
      alert("City Added Successfully");
    } catch (err) {
      alert("Something went wrong!!");
    }
    setsubmitLoading(false);
  };

  return (
    <CCard>
      <CCardHeader>Add City</CCardHeader>
      <CCardBody>
        {!loading ? (
          <CForm onSubmit={handleSubmit}>
            <CFormGroup>
              <SearchableSelect
                placeholder="Select Service"
                onChange={(value) => {
                  setService(value);
                  setServiceCities(services[value].cities || []);
                }}
                list={services.map((service, i) => ({
                  name: service.name,
                  value: i,
                }))}
              />
            </CFormGroup>
            <CFormGroup>
              <SearchableSelect
                placeholder="Select City"
                onChange={(value) => {
                  setCity(value);
                }}
                list={cities.map((city, i) => ({
                  name: city.name,
                  value: i,
                }))}
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
            {!!serviceCities.length && (
              <>
                <CFormGroup>
                  <CLabel
                    style={{
                      marginLeft: "6px",
                    }}
                  >
                    Added Cities
                  </CLabel>
                </CFormGroup>
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    flexWrap: "wrap",
                  }}
                >
                  {serviceCities.map((city, i) => (
                    <input
                      key={i}
                      value={city}
                      style={{
                        textAlign: "center",
                        marginInline: "3px",
                        marginBlock: "3px",
                      }}
                      disabled
                    />
                  ))}
                </div>
              </>
            )}
          </CForm>
        ) : (
          <CSpinner size="small" color="info" />
        )}
      </CCardBody>
    </CCard>
  );
};

export default ServicesCity;
