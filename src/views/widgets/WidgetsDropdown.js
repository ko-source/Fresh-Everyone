import React, { useEffect, useState } from "react";
import { CWidgetDropdown, CRow, CCol, CSpinner } from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router-dom";

const WidgetsDropdown = () => {
  const history = useHistory();
  const [orders, setOrders] = useState("");
  const [users, setUsers] = useState("");
  const [services, setServices] = useState("");
  const [providers, setProviders] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);

  useEffect(() => {
    getVideos();;
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("Orders").get();
    setUsers(videos.docs.length)

    const vid =  await firebase.firestore().collection("users").get();
    setOrders(vid.docs.length)

    const vi =  await firebase.firestore().collection("vendors").get();
    setServices(vi.docs.length)

    const vide =  await firebase.firestore().collection("rider").get();
    setProviders(vide.docs.length)
    setLoading(false);
  };

  // render
  return (
    <CRow>
      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-primary"
          text={users}
          header="Order"
          style={{
            height: 165,
          }}
          onClick={(e)=>{history.push("/bills")}}
          // footerSlot={
          //   loading && (
          //     <div
          //       style={{
          //         display: "grid",
          //         placeItems: "center",
          //         height: 100,
          //         position: "relative",
          //         alignItems: "center",
          //       }}
          //     >
          //       <CSpinner color="primary" />
          //     </div>
          //   )
          // }
        ></CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-info"
          text={orders.toString()}
          header="Users"
          style={{
            height: 165,
          }}
          onClick={(e)=>{history.push("/blogs/user-Orderhistory")}}
          // footerSlot={
          //   loading && (
          //     <div
          //       style={{
          //         display: "grid",
          //         placeItems: "center",
          //         height: 100,
          //         position: "relative",
          //         alignItems: "center",
          //       }}
          //     >
          //       <CSpinner color="primary" />
          //     </div>
          //   )
          // }
        ></CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-warning"
          text={services.toString()}
          header="Vendors"
          style={{
            height: 165,
          }}
          onClick={(e)=>{history.push("/blogs/vendor-Orderhistory")}}
          // footerSlot={
          //   loading && (
          //     <div
          //       style={{
          //         display: "grid",
          //         placeItems: "center",
          //         height: 100,
          //         position: "relative",
          //         alignItems: "center",
          //       }}
          //     >
          //       <CSpinner color="primary" />
          //     </div>
          //   )
          // }
        ></CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetDropdown
          color="gradient-danger"
          text={providers.toString()}
          header="Riders"
          style={{
            height: 165,
          }}
          onClick={(e)=>{history.push("/property-pg")}}
          // footerSlot={
          //   loading && (
          //     <div
          //       style={{
          //         display: "grid",
          //         placeItems: "center",
          //         height: 100,
          //         position: "relative",
          //         alignItems: "center",
          //       }}
          //     >
          //       <CSpinner color="primary" />
          //     </div>
          //   )
          // }
        ></CWidgetDropdown>
      </CCol>
    </CRow>
  );
};

export default WidgetsDropdown;
