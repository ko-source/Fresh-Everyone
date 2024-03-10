import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
const VerifiedServiceProviders = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getServiceProviders();
  }, []);

  const getServiceProviders = () => {
    setLoading(true);
    firebase
      .firestore()
      .collection("providers")
      .where("verified", "==", true)
      .get()
      .then(async (value) => {
        const data = await Promise.all(
          value.docs.map(async (val) => {
            let service_name = "Not Defined";
            if (val.data()?.services?.length > 0) {
              service_name = await (
                await firebase
                  .firestore()
                  .collection("services")
                  .doc(val.data().services[0]?.service_id)
                  .get()
              ).data()?.name;
            }
            return {
              id: val.id,
              ...val.data(),
              service_name,
            };
          })
        );
        setProviders(data);
        setLoading(false);
      });
  };

  const onExportData = async () => {
    const filteredData = providers
      .filter((order) => {
        // return Object.keys(tableFilters).reduce((p, c) => {
        //   return String(order[c]).includes(tableFilters[c]) && p
        // }, true)
        for (const filterKey in tableFilters) {
          console.log(
            String(order[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(order[filterKey]).search(
              new RegExp(tableFilters[filterKey], "i")
            ) >= 0
          ) {
            continue;
          } else {
            return false;
          }
        }
        return true;
      })
      .map((order) => ({
        phone: order.phone,
        name: order.name,
        location: order.location,
      }));

    exportDataToXLSX(filteredData, "verifiedProvidersList");
  };

  return (
    <CRow>
      <CCol xl={12} className="d-flex justify-content-end">
        <CButton color="info" className="mb-2 mr-2" onClick={onExportData}>
          Export Data
        </CButton>
      </CCol>
      <CCol xl={12}>
        <CCard>
          <CCardHeader color="secondary">Verified Providers</CCardHeader>
          <CCardBody>
            <CDataTable
              items={providers}
              loading={loading}
              fields={[
                { key: "phone", _classes: "font-weight-bold" },
                "name",
                "service_name",
                "location",
              ]}
              hover
              striped
              columnFilter
              sorter
              clickableRows
              onRowClick={(item) =>
                history.push(`/service_providers/${item.id}`)
              }
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default VerifiedServiceProviders;
