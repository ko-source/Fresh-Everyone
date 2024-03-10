import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CButton,
  CForm,
  CFormGroup,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
// import SearchableSelect from "../searchableSelect";
// import { getReferral, getUser } from "../../utils/database_fetch_methods";

const EditPayment = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setsubmitLoading] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    setLoading(true);
    const order = (
      await firebase.firestore().collection("orders").doc(match.params.id).get()
    ).data();
    console.log(order.payment_collection);
    setStatus(
      order.payment_collection ||
        (order.total
          ? order.amountPaid < order.total
            ? "Pending"
            : "Collected"
          : "Pending")
    );
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsubmitLoading(true);
    try {
      firebase.firestore().collection("orders").doc(match.params.id).update({
        payment_collection: status,
      });

      alert("Payment Collection Status Changed Successfully");
    } catch {
      alert("Something went wrong");
    }
    setsubmitLoading(false);
  };

  return (
    <CCard>
      <CCardHeader>Edit Payment</CCardHeader>
      <CCardBody>
        {!loading ? (
          <CForm onSubmit={handleSubmit}>
            <CFormGroup>
              <CDropdown className="mt-2">
                <CDropdownToggle caret color="info" varient={"outline"}>
                  {status}
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem header>Status</CDropdownItem>
                  <CDropdownItem divider />
                  <CDropdownItem onClick={() => setStatus("Collected")}>
                    Collected
                  </CDropdownItem>
                  <CDropdownItem onClick={() => setStatus("Pending")}>
                    Pending
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CFormGroup>
            <CFormGroup>
              {submitLoading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <CButton type="submit" color="success" disabled={submitLoading}>
                  Edit Payment
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

export default EditPayment;
