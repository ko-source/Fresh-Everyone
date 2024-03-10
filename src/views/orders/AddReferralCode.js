import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormGroup,
  CButton,
  CSpinner,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import SearchableSelect from "./searchableSelect";
import { getReferral, getUser } from "../../utils/database_fetch_methods";

const AddReferralCode = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setsubmitLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [referrer, setReferrer] = useState(-1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const user = await getUser(match.params.id);
    const usersDoc = await firebase
      .firestore()
      .collection("users")
      .where("phone", "!=", user.phone || "")
      .get();
    const ref = await getReferral(match.params.id);
    setUsers(
      usersDoc.docs.map((doc, index) => {
        if (doc.data().name === ref || doc.data().phone === ref) {
          setReferrer(index);
        }
        return {
          ...doc.data(),
          id: doc.id,
        };
      })
    );
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsubmitLoading(true);
    const db = firebase.firestore();

    try {
      db.collection("users")
        .doc(match.params.id)
        .update({ referralCode: users[referrer].id });
      alert("Referrer Added");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
    setsubmitLoading(false);
  };

  return (
    <CCard>
      <CCardHeader>Edit Referrer</CCardHeader>
      <CCardBody>
        {!loading ? (
          <CForm onSubmit={handleSubmit}>
            <CFormGroup>
              <CFormGroup>
                <SearchableSelect
                  placeholder={`${
                    referrer === -1
                      ? "Select Referrer"
                      : `${users[referrer].name} | ${users[referrer].phone}`
                  }`}
                  value={referrer}
                  onChange={(value) => {
                    setReferrer(value);
                  }}
                  list={users.map((user, i) => ({
                    name: `${user.name} | ${user.phone}`,
                    value: i,
                  }))}
                />
              </CFormGroup>
              {submitLoading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <CButton type="submit" color="success" disabled={submitLoading}>
                  Edit Referrer
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

export default AddReferralCode;
