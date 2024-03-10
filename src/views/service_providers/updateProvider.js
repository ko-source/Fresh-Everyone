import React, { useState, useEffect, createRef } from "react";

import {
  CAlert,
  CInput,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
  CSpinner,
  CTextarea,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { getProvider } from "../../utils/database_fetch_methods";
import { useFormik } from "formik";
import SearchableSelect from "../orders/searchableSelect";

const initialFormData = {
  name: null,
  phone: null,
  email: null,
  description: null,
  location: null,
};

const UpdateProvider = ({ match }) => {
  const formRef = createRef();
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(-1);
  const [requestStatus, setRequestStatus] = useState("inactive");

  const formData = useFormik({
    initialValues: initialFormData,
  });

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    console.log(match.params.id);
    if (match.params.id) {
      setLoading(true);
      setIsUpdate(true);
      const provider = await getProvider(match.params.id);
      console.log(provider);

      await formData.setFieldValue("name", provider.name);
      await formData.setFieldValue("phone", provider.phone.substring(3));
      // await formData.setFieldValue('whatsapp', provider.whatsapp.substring(3));
      await formData.setFieldValue("email", provider.email);
      await formData.setFieldValue("description", provider.description);
      await formData.setFieldValue("location", provider.location);

      const citiesDoc = await firebase.firestore().collection("cities").get();
      setCities(citiesDoc.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
  };

  const onUserFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.values);

    if (!formData.values.phone) {
      alert("Phone Number is mandatory");
      return;
    }

    try {
      setRequestStatus("inprogress");

      const providerData = {
        ...(formData.values.name && { name: formData.values.name }),
        ...(formData.values.phone && { phone: "+91" + formData.values.phone }),
        ...(formData.values.whatsapp && {
          whatsapp: "+91" + formData.values.phone,
        }),
        ...(formData.values.email && { email: formData.values.email }),
        ...(formData.values.description && {
          description: formData.values.description,
        }),
        ...(formData.values.location && { location: formData.values.location }),
      };

      if (city !== -1) {
        providerData.cities = firebase.firestore.FieldValue.arrayUnion(
          cities[city].name
        );
      }

      if (isUpdate) {
        await firebase
          .firestore()
          .collection("providers")
          .doc(match.params.id)
          .update(providerData);
        alert("Service Provider Updated");
        // history.goBack();
      } else {
        await firebase.firestore().collection("providers").add(providerData);
        alert("Service Provider Created");
        formData.resetForm();
      }

      setRequestStatus("success");
    } catch (error) {
      console.error(error);
      setRequestStatus("error");
    }

    setTimeout(() => {
      setRequestStatus("inactive");
    }, 3000);
  };

  return (
    <CRow>
      <CCol xl={3} />
      <CCol xl={6}>
        {requestStatus === "success" && (
          <CAlert
            color="success"
            closeButton
            onShowChange={(show) => {
              if (!show) {
                setRequestStatus(null);
              }
            }}
          >
            User Successfully {isUpdate ? "Updated" : "Created"}.
          </CAlert>
        )}
        {requestStatus === "error" && (
          <CAlert
            color="danger"
            closeButton
            onShowChange={(show) => {
              if (!show) {
                setRequestStatus(null);
              }
            }}
          >
            Oops! Some Error Occured, Please Try Again.
          </CAlert>
        )}

        <CCard>
          <CCardHeader color="primary text-light font-xl">
            {isUpdate ? "Update" : "Create New"} Service Provider
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <CSpinner color="info" />
            ) : (
              <CForm innerRef={formRef} onSubmit={onUserFormSubmit}>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "bold" }}>
                    Name <small>(Required)</small>
                  </CLabel>
                  <CInput
                    type="text"
                    placeholder="Name"
                    name="name"
                    required
                    value={formData.values.name}
                    onChange={(e) => {
                      formData.handleChange(e);
                      // setFormData({
                      //   ...formData.values,
                      //   name: e.target.value
                      // })
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "bold" }}>
                    Phone <small>(Required)</small>
                  </CLabel>
                  <CInput
                    required={true}
                    type="number"
                    placeholder="Phone"
                    name="phone"
                    value={formData.values.phone}
                    onChange={(e) => {
                      formData.handleChange(e);
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "bold" }}>
                    Whats App number
                  </CLabel>
                  <CInput
                    required={false}
                    type="number"
                    placeholder="whatsapp"
                    name="whatsapp"
                    value={formData.values.whatsapp}
                    onChange={(e) => {
                      formData.handleChange(e);
                    }}
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
                  <CLabel style={{ fontWeight: "bold" }}>Email</CLabel>
                  <CInput
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={formData.values.email}
                    onChange={(e) => {
                      formData.handleChange(e);
                      // setFormData({
                      //   ...formData.values,
                      //   name: e.target.value
                      // })
                    }}
                  />
                </CFormGroup>

                <CFormGroup>
                  <CLabel style={{ fontWeight: "bold" }}>
                    Location <small>(Required)</small>
                  </CLabel>
                  <CInput
                    required
                    type="text"
                    placeholder="Location"
                    name="location"
                    value={formData.values.location}
                    onChange={(e) => {
                      formData.handleChange(e);
                    }}
                  />
                  {/* <AddressInput address={formData.values.address} handleChange={formData.handleChange} ></AddressInput> */}
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "bold" }}>Description</CLabel>
                  <CTextarea
                    placeholder="Description"
                    rows="3"
                    name="description"
                    value={formData.values.description}
                    onChange={(e) => {
                      formData.handleChange(e);
                    }}
                  />
                </CFormGroup>
                <CButton
                  type="submit"
                  color="primary"
                  disabled={requestStatus !== "inactive"}
                >
                  {requestStatus === "inprogress" ? (
                    <CSpinner color="info" />
                  ) : isUpdate ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </CButton>
              </CForm>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xl={3} />
    </CRow>
  );
};

export default UpdateProvider;
