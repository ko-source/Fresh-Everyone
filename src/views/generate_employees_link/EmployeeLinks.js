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

const EmployeeLinks = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  var [state, setState] = useState({
    links: null,
  });
  useEffect(() => {
    getEmployeeLinks();
  }, []);

  const getEmployeeLinks = async () => {
    setLoading(true);
    const links = await firebase.firestore().collection("links").get();
    console.log(links.docs.length);

    const resolvedLinks = links.docs.map((link) => {
      const linkData = link.data();

      return {
        ...linkData,
        employeeId: linkData.employeeId,
        link: linkData.link || "-",
        orders: linkData.orders || [],
      };
    });

    console.log(resolvedLinks);

    setState({
      ...state,
      links: resolvedLinks,
    });
    setLoading(false);
  };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span className="font-xl">Links</span>
            <span>
              <CButton
                color="primary"
                onClick={() => history.push("/links/generate-link")}
              >
                Generate Link
              </CButton>
            </span>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.links}
              fields={[
                { key: "employeeId", label: "Employee Id" },
                { key: "link" },
                { key: "orders" },
              ]}
              hover
              striped
              columnFilter
              // pagination
              // tableFilter
              sorter
              // itemsPerPageSelect
              // itemsPerPage={30}
              clickableRows
              //   onRowClick={(item) => history.push(`/users/${item.id}`)}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default EmployeeLinks;
