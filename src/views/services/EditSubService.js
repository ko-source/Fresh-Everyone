import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CInput,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const initialState = {
  price: 0,
  eta: 0,
};

const EditSubService = ({ match }) => {
  const serviceId = match.params.sid;
  const subServiceId = match.params.ssid;
  const db = firebase.firestore();

  const [loading, setLoading] = useState(false);
  const [submitLoading, setsubmitLoading] = useState(false);
  const [subService, setSubService] = useState(initialState);
  const [status, setStatus] = useState("");
  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    setLoading(true);
    const subServiceData = await db
      .collection("services")
      .doc(serviceId)
      .collection("subservices")
      .doc(subServiceId)
      .get();

    setSubService({
      ...subService,
      ...subServiceData.data(),
      id: subServiceData.id,
    });

    setLoading(false);
  };

  const handleChange = (e) => {
    setSubService({
      ...subService,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      String(subService.price).trim() === "" ||
      String(subService.eta).trim() === ""
    ) {
      alert("All Fields are Required");
      return;
    }

    if (subService.price <= 0 || subService.eta <= 0) {
      alert("Enter a valid Number");
      return;
    }

    setsubmitLoading(true);
    try {
      await db
        .collection("services")
        .doc(serviceId)
        .collection("subservices")
        .doc(subServiceId)
        .update({
          price: parseInt(subService.price),
          eta: parseInt(subService.eta),
        });
      alert("Sub Service Updated Successfully");
    } catch (err) {
      alert("Something went wrong!!");
    }

    setsubmitLoading(false);
  };

  return (
    <CCard>
      <CCardHeader>Edit Sub Service {`${subService.name || ""}`}</CCardHeader>
      <CCardBody>
        {!loading ? (
          <CForm onSubmit={handleSubmit}>
            <CFormGroup>
              <CLabel>Price</CLabel>
              <CInput
                type="number"
                placeholder="Price"
                name="price"
                value={subService.price}
                onChange={handleChange}
                required
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel>ETA</CLabel>
              <CInput
                type="number"
                placeholder="ETA"
                name="eta"
                value={subService.eta}
                onChange={handleChange}
                required
              />
            </CFormGroup>
            <CFormGroup>
              {submitLoading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <CButton type="submit" color="success" disabled={submitLoading}>
                  Edit Sub Service
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

export default EditSubService;
