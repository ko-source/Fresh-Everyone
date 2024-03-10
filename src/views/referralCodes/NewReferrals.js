import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const NewReferrals = () => {
  //   const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const [referrals, setReferrals] = useState([]);
  useEffect(() => {
    getReferrals();
  }, []);

  const getReferrals = async () => {
    setLoading(true);
    const referralDoc = (
      await firebase.firestore().collection("newReferrals").get()
    ).docs;

    setReferrals(
      referralDoc.map((referral) => ({
        ...referral.data(),
        id: referral.id,
      }))
    );
    setLoading(false);
  };

  return (
    <CRow>
      <CCol xl={12}></CCol>
      <CCol xl={12}>
        <CCard>
          <CCardHeader color="secondary">New Referrals</CCardHeader>
          <CCardBody>
            <CDataTable
              loading={loading}
              onSorterValueChange={(e) => {
                console.log(e);
              }}
              items={referrals}
              fields={[
                { key: "user", label: "Customer" },
                { key: "referredTo" },
              ]}
              hover
              striped
              columnFilter
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default NewReferrals;
