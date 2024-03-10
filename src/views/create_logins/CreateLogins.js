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
  CCardTitle,
} from "@coreui/react";
import nav from "../../containers/_nav";

import firebase from "../../config/fbconfig";

const CreateLogins = ({ match }) => {
  const [submitLoading, setsubmitLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const navigation = nav.map((nav) => nav.name);
  const navigation = nav
    .filter((nav) => nav.name !== "Logins List")
    .map((nav) => nav.name);
  useEffect(() => {}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsubmitLoading(true);
    const accessTo = navigation.filter(
      (nav) => document.getElementById(nav).checked
    );
    if (username.trim() === "" || password.trim() === "") {
      alert("Username and password is required");
      setsubmitLoading(false);
      return;
    }
    if (accessTo.length === 0) {
      alert("Select atleast 1 role");
      setsubmitLoading(false);
      return;
    }

    const adminObject = {
      username: username,
      password: password,
      accessTo: accessTo,
      timestamp: new Date(),
    };

    await firebase
      .firestore()
      .collection("admins")
      .doc("admin")
      .update({
        subadmins: firebase.firestore.FieldValue.arrayUnion(adminObject),
      });

    alert("Login Created Successfully");
    setUsername("");
    setPassword("");
    accessTo.map((nav) => (document.getElementById(nav).checked = false));
    setsubmitLoading(false);

    // console.log(accessTo);
    // const order = document.getElementById("orders");
    // console.log(order.checked);
  };

  return (
    <CCard>
      <CCardHeader>Create Logins</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CFormGroup>
            <CInput
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </CFormGroup>
          <CFormGroup>
            <CInput
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CFormGroup>
          <CFormGroup>
            <CCardTitle>Access To</CCardTitle>
          </CFormGroup>
          <CFormGroup>
            {navigation.map((nav, index) => {
              return (
                <CFormGroup key={index}>
                  <div
                    style={{
                      height: 30,
                    }}
                    key={index}
                  >
                    <input type="checkbox" id={nav} name={nav} />
                    <span
                      style={{
                        marginLeft: 5,
                        fontSize: 18,
                      }}
                    >
                      {nav}
                    </span>
                  </div>
                </CFormGroup>
              );
            })}
          </CFormGroup>

          <CFormGroup>
            {submitLoading ? (
              <CSpinner size="small" color="info" />
            ) : (
              <CButton type="submit" color="success" disabled={submitLoading}>
                Submit
              </CButton>
            )}
          </CFormGroup>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default CreateLogins;
