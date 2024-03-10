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
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { getUser } from "../../utils/database_fetch_methods";
import { useFormik } from "formik";

const initialFormData = {
  name: null,
  phone: null,
  address: [],
  whatsAppNumber: null,
};

const CreateNewUser = ({ match }) => {
  const formRef = createRef();
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [requestStatus, setRequestStatus] = useState("inactive");

  const formData = useFormik({
    initialValues: initialFormData,
  });

  // const isAnyAddressFieldFillder = formData.values.address.line1 || formData.values.address.line2 || formData.values.address.city || formData.values.address.state || formData.values.address.pincode || formData.values.address.country;

  useEffect(() => {
    fetchUserData();
  }, []);

  const addAddress = () => {
    const newAddressList = [
      ...formData.values.address,
      {
        line1: null,
        line2: null,
        city: null,
        state: null,
        pincode: null,
        country: null,
      },
    ];

    formData.setFieldValue("address", newAddressList);
  };

  const deleteAddress = (index) => {
    formData.values.address.splice(index, 1);

    // formData.setFieldValue('address')
  };

  const fetchUserData = async () => {
    if (match.params.id) {
      setLoading(true);
      setIsUpdate(true);
      const user = await getUser(match.params.id);
      console.log(user);

      await formData.setFieldValue("name", user.name);
      await formData.setFieldValue("phone", user.phone.substring(3));
      await formData.setFieldValue(
        "whatsApp",
        user.whatsAppNumber?.substring(3)
      );
      if (user.addresses && user.addresses?.length > 0) {
        await formData.setFieldValue("address", [
          ...user.addresses?.map((address) => ({
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: address.country,
          })),
        ]);
      }

      setLoading(false);
      // setFormData({
      //   ...formData.values,
      //   name: user.name,
      //   phone: user.phone.substring(3)
      // })
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

      const userData = {
        ...(formData.values.name && { name: formData.values.name }),
        ...(formData.values.phone && { phone: "+91" + formData.values.phone }),
        ...(formData.values.address && { addresses: formData.values.address }),
        ...(formData.values.whatsAppNumber && {
          whatsAppNumber: "+91" + formData.values.whatsAppNumber,
        }),
      };

      if (isUpdate) {
        await firebase
          .firestore()
          .collection("users")
          .doc(match.params.id)
          .update(userData);
        alert("User Updated");
        // history.goBack();
      } else {
        await firebase.firestore().collection("users").add(userData);
        alert("User Created");
        formData.resetForm();
      }

      // setFormData(initialFormData);
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
            {isUpdate ? "Update" : "Create New"} User
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <CSpinner color="info" />
            ) : (
              <CForm innerRef={formRef} onSubmit={onUserFormSubmit}>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "bold" }}>Name</CLabel>
                  <CInput
                    type="text"
                    placeholder="Name"
                    name="name"
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
                {/* WhatsApp Number */}
                <CFormGroup>
                  <CLabel style={{ fontWeight: "bold" }}>
                    WhatsApp Number
                  </CLabel>
                  <CInput
                    required={true}
                    type="number"
                    placeholder="WhatsApp Number"
                    name="whatsAppNumber"
                    value={formData.values.whatsAppNumber}
                    onChange={(e) => {
                      formData.handleChange(e);
                      // setFormData({
                      //   ...formData.values,
                      //   phone: e.target.value
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
                      // setFormData({
                      //   ...formData.values,
                      //   phone: e.target.value
                      // })
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <div className="d-flex justify-content-between align-items-center">
                    <CLabel style={{ fontWeight: "bold" }}>Addresses</CLabel>
                    {formData.values.address.length === 0 && (
                      <CButton
                        color="info"
                        size="sm"
                        variant="ghost"
                        onClick={() => addAddress()}
                      >
                        Add Address
                      </CButton>
                    )}
                  </div>
                  {formData.values.address.map((address, index) => (
                    <AddressInput
                      address={address}
                      index={index}
                      handleDelete={deleteAddress}
                      handleChange={formData.handleChange}
                    ></AddressInput>
                  ))}
                  {formData.values.address.length > 0 && (
                    <div className="d-flex justify-content-end">
                      <CButton
                        color="info"
                        size="sm"
                        variant="ghost"
                        onClick={() => addAddress()}
                      >
                        Add Another Address
                      </CButton>
                    </div>
                  )}
                </CFormGroup>
                <CButton
                  type="submit"
                  color="primary"
                  disabled={requestStatus !== "inactive"}
                >
                  {requestStatus === "inprogress" ? (
                    <CSpinner color="info" />
                  ) : isUpdate ? (
                    "Update User"
                  ) : (
                    "Create User"
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

const AddressInput = ({ handleChange, handleDelete, index, address }) => {
  // const isAnyAddressFieldFillder = address.line1 || address.line2 || address.city || address.state || address.pincode || address.country;

  return (
    <div className="px-3 pt-3 mb-3 b-a-1">
      <CFormGroup>
        <div className="d-flex justify-content-between">
          <CLabel style={{ fontWeight: "bold" }}>Address {index + 1}</CLabel>
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={() => handleDelete(index)}
          >
            Delete
          </CButton>
        </div>
        <CLabel>
          Line 1 <small>(Required)</small>
        </CLabel>
        <CInput
          type="text"
          placeholder="Address Line 1"
          name={`address.${index}.line1`}
          value={address.line1}
          required
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </CFormGroup>
      <CFormGroup>
        <CLabel>
          Line 2 <small>(Required)</small>
        </CLabel>
        <CInput
          type="text"
          placeholder="Address Line 2"
          required
          name={`address.${index}.line2`}
          value={address.line2}
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </CFormGroup>
      <CFormGroup row={true}>
        <CCol>
          <CLabel>
            City <small>(Required)</small>
          </CLabel>
          <CInput
            type="text"
            placeholder="Example - Udaipur"
            required
            name={`address.${index}.city`}
            value={address.city}
            onChange={(e) => {
              handleChange(e);
              // setFormData({
              //   ...formData.values,
              //   address: {
              //     ...formData.values.address,
              //     city: e.target.value
              //   }
              // })
            }}
          />
        </CCol>
        <CCol>
          <CLabel>
            Pincode <small>(Required)</small>
          </CLabel>
          <CInput
            type="text"
            placeholder="Example - 305007"
            required
            value={address.pincode}
            name={`address.${index}.pincode`}
            onChange={(e) => {
              handleChange(e);
              // setFormData({
              //   ...formData.values,
              //   address: {
              //     ...formData.values.address,
              //     pincode: e.target.value
              //   }
              // })
            }}
          />
        </CCol>
      </CFormGroup>
      <CFormGroup row={true}>
        <CCol>
          <CLabel>
            State <small>(Required)</small>
          </CLabel>
          <CInput
            type="text"
            placeholder="Example - Rajasthan"
            required
            name={`address.${index}.state`}
            value={address.state}
            onChange={(e) => {
              handleChange(e);
              // setFormData({
              //   ...formData.values,
              //   address: {
              //     ...formData.values.address,
              //     state: e.target.value
              //   }
              // })
            }}
          />
        </CCol>
        <CCol>
          <CLabel>
            Country <small>(Required)</small>
          </CLabel>
          <CInput
            type="text"
            placeholder="Expample - India"
            name={`address.${index}.country`}
            value={address.country}
            required
            onChange={(e) => {
              handleChange(e);
              // setFormData({
              //   ...formData.values,
              //   address: {
              //     ...formData.values.address,
              //     country: e.target.value
              //   }
              // })
            }}
          />
        </CCol>
      </CFormGroup>
    </div>
  );
};

export default CreateNewUser;
