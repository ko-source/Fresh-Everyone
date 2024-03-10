import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CTabPane,
  CTabContent,
  CInputGroup,
  CLabel,
  CTextarea,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CImg,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useFormik } from "formik";

const CancelOrder = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const[order, setOrder] = useState("");
  const[porder, setPorder] = useState("");
  const[lorder, setLorder] = useState("");
  const[dorder, setDorder] = useState("");
  const[cat,setCat]=useState([]);
  var [state, setState] = useState({
    users: null,
    porder: null,
    lorder: null,
    dorder:null,
  });

  useEffect(() => {
    getUsers(); 
  }, []);

  const getUsers = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("orders").where("isCancelled","==",true).get();
    setOrder(users.docs.length);
    // filter((x) => x.orderStatus === 'placed')

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid:userData.uid,
        ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(userData.timeStamp),
        date:userData.timeStamp,
        // amount:userData.totalAmount,
        cname:userData.userName,
        cadd:userData.address,
        cphno:userData.userNumber,
        status:userData.orderStatus,
        message:userData.message,
        service:userData.serviceType,
      };
    });
    setState({
      ...state,
      users: resolvedUsers,
    });
    setCat(resolvedUsers);
    setLoading(false);
    // console.log(users.date);
  };

  const deleteVideo = (item,rowId) => {
    confirmAlert({
      title: "Delete Order",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("Users").doc(rowId).delete();
                alert("Order Deleted");
                history.push("/");
                history.replace("/users/cancelled-order");
                // history.goBack();
          },
        },
        {
          label: "No",
          // onClick: () => alert("Close"),
        },
      ],
      // childrenElement: () => 
      // customUI: ({ onClose }) => <div>Custom UI</div>,
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
      // overlayClassName: "overlay-custom-class-name"
    });

  };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center" style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>
            <span className="font-xl">Cancelled Order List</span>
            <span>
              {/* <CButton color="info" className="mr-3"
              //  onClick={() => onExportData()}
               >
                Export Data
              </CButton> */}
              {/* <CButton
                color="primary"
                // onClick={() => history.push("/users/create-user")}
              >
                Create User
              </CButton> */}
            </span>
          </CCardHeader>
          <CCardBody>
                <CDataTable
                            loading={loading}
                            onColumnFilterChange={(e) => {
                              setTableFilters(e);
                            }}
                            onSorterValueChange={(e) => {
                              console.log(e);
                            }}
                            onTableFilterChange={(filter) => setTableFilters(filter)}
                            items={state.users}
                            fields={[
                              { key: "srno", label:"Sr. No", filter: true},
                              { key: "id", label: "Order Id", filter: true},
                              { key: "cname", label: "User Details", filter: true},
                              { key: "cadd", label: "Address", filter: true},
                              // { key: "message", label: "Message", filter: true},
                              { key: "service", label: "Services", filter: true},
                              // { key: "action", label: "Action" , filter: false},
                            ]}
                            scopedSlots={{
                              srno: (item, index) => {
                                return (
                                  <td>
                                      {index+1}
                                  </td>
                                );
                              },
                              id: (item) => {
                                return (
                                  <td>
                                      {item.id}
                                  </td>
                                );
                              },
                              cname: (item) => {
                                  return (
                                    <td>
                                        <div><i class="fa fa-phone"></i>{item.cname}</div>
                                        <div>{item.cphno}</div>
                                    </td>
                                  );
                                },
                                cadd: (item) => {
                                  return (
                                    <td>
                                        {/* <div><i class="fa fa-phone"></i>{item.cname}</div> */}
                                        <div>{item.cadd}</div>
                                    </td>
                                  );
                                },
                                service: (item) => {
                                  return (
                                    <td>
                                        {item.service}
                                    </td>
                                  );
                                },
                                action: (item, index) => {
                                  return (
                                    <td>
                                        {
                                          <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Delete</CButton>
                                        //    <CInputGroup style={{flexWrap: "nowrap"}}>
                                        //       <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => edit(item.id)}>Process</CButton>
                                        //       <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Refund/Cancel</CButton>
                                        //       </CInputGroup>
                                        // }<br></br>{
                                        //       <CInputGroup style={{flexWrap: "nowrap",marginTop:"-15px"}}>
                                        //         <CButton style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => view(item,item.id)}>View Order</CButton>
                                        //       </CInputGroup>
                                        }
                                    </td>
                                  );
                                },
                            }}
                            hover
                            striped
                            columnFilter
                            // tableFilter
                            sorter
                            // pagination
                            // itemsPerPageSelect
                            // itemsPerPage={30}
                            clickableRows
                            // onRowClick={(item) =>view(item.id)}
                            
                          />
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default CancelOrder;
