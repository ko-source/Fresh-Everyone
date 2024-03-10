import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CButton,
  CDataTable,
  CRow,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";

const LoginsList = () => {
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [logins, setLogins] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  useEffect(() => {
    getLogins();
  }, []);

  const getLogins = async () => {
    setLoading(true);

    const loginData = await (
      await firebase.firestore().collection("admins").doc("admin").get()
    ).data();

    const resolvedLogins = loginData.subadmins
      .filter((admin) => admin.accessTo)
      .map((admin) => {
        return {
          ...admin,
          createdAt: admin.timestamp?.toDate().toString(),
        };
      });
    resolvedLogins.sort(compare);
    setLogins(resolvedLogins);
    setLoading(false);
  };

  const deleteLogin = async (item, index) => {
    setDeleteLoading(true);
    if (!item.timestamp) delete item.timestamp;
    delete item.createdAt;
    try {
      await firebase
        .firestore()
        .collection("admins")
        .doc("admin")
        .update({
          subadmins: firebase.firestore.FieldValue.arrayRemove(item),
        });
      const filteredLogins = logins.filter((x, i) => i !== index);
      alert("Login Removed Successfully");
      setLogins(filteredLogins);
    } catch (err) {
      alert("Something went wrong!! Unable to delete login");
    }
    setDeleteLoading(false);
  };

  function compare(b, a) {
    var id = "timestamp";
    if (a[id] < b[id]) {
      return -1;
    }
    if (a[id] > b[id]) {
      return 1;
    }
    return 0;
  }

  const onExportData = async () => {
    const filteredData = logins
      .filter((login) => {
        for (const filterKey in tableFilters) {
          console.log(
            String(login[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(login[filterKey]).search(
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
      .map((login) => ({
        username: login.username,
        accessTo: login.accessTo,
        createdAt: login.createdAt,
      }));

    exportDataToXLSX(filteredData, "loginsList");
  };

  return (
    <CRow>
      <CCol xl={12} className="d-flex justify-content-end">
        <CButton color="info" className="mb-2 mr-2" onClick={onExportData}>
          Export Data
        </CButton>
      </CCol>
      <CCol xl={12}></CCol>
      <CCol xl={12}>
        <CCard>
          <CCardHeader color="secondary">Logins List</CCardHeader>
          <CCardBody>
            <CDataTable
              loading={loading}
              onColumnFilterChange={(e) => {
                console.log(e);
                setTableFilters(e);
              }}
              onSorterValueChange={(e) => {
                console.log(e);
              }}
              items={logins}
              fields={[
                { key: "username", filter: true },
                { key: "accessTo", filter: true },
                {
                  key: "createdAt",
                  filter: true,
                  label: "Created At",
                },
                {
                  key: "deleteLogin",
                  filter: false,
                  sort: false,
                },
              ]}
              scopedSlots={{
                deleteLogin: (item, index) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => deleteLogin(item, index)}
                        disabled={deleteLoading}
                      >
                        Delete Login
                      </CButton>
                    </td>
                  );
                },
              }}
              hover
              striped
              columnFilter
              onPageChange={(e) => {
                console.log(e);
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default LoginsList;
