import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import firebase from "../../config/fbconfig";
import {
  getProvider,
  getUser,
  getOrder,
} from "../../utils/database_fetch_methods";

const Reviews = () => {
  const history = useHistory();
  //   const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    // fetching orders and filtering it for missing mandatory fields
    setLoading(true);
    const value = (
      await firebase
        .firestore()
        .collection("reviews")
        .orderBy("timestamp", "desc")
        .get()
    ).docs;
    // resolving individual reviews for meta field data
    let processedReviews = await Promise.all(
      value.map(async (doc) => {
        const review = doc.data();
        const [
          resolvedProvider,
          resolvedCustomer,
          resolvedOrder,
        ] = await Promise.all([
          getProvider(review.provider_id),
          getUser(review.customer_id),
          getOrder(review.order_id),
        ]);

        return {
          ...review,
          id: doc.id,
          provider_name: resolvedProvider.name
            ? resolvedProvider.name
            : resolvedProvider.phone,
          customer: resolvedCustomer.phone,
          ticket_id: resolvedOrder.ticketId,
        };
      })
    );
    setReviews(processedReviews);
    setLoading(false);
  };

  return (
    <CRow>
      {/* <CCol xl={12} className="d-flex justify-content-end">
        <CButton
          color="info"
          className="mb-2 mr-2"
          onClick={() => history.push(`/orders/requestedOrders`)}
        >
          Order Requests
        </CButton>
        <CButton
          color="primary"
          className="mb-2"
          onClick={() => history.push(`/orders/create_order`)}
        >
          Create Order
        </CButton>
      </CCol> */}
      <CCol xl={12}></CCol>
      <CCol xl={12}>
        <CCard>
          <CCardHeader color="secondary">Reviews</CCardHeader>
          <CCardBody>
            <CDataTable
              loading={loading}
              //   onColumnFilterChange={(e) => {
              //     setTableFilters(e);
              //   }}
              onSorterValueChange={(e) => {
                console.log(e);
              }}
              items={reviews}
              fields={[
                { key: "ticket_id" },
                { key: "provider_name", label: "Employee" },
                { key: "customer", label: "Customer" },
                { key: "reviewFromProvider", label: "Review From Employee" },
                { key: "timestamp" },
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

export default Reviews;
