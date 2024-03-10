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
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import { useFormik } from "formik";

const SocFilter = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const[order, setOrder] = useState("");
  const[porder, setPorder] = useState("");
  const[lorder, setLorder] = useState("");
  const[dorder, setDorder] = useState("");
  var [state, setState] = useState({
    users: null,
    porder: null,
    lorder: null,
    dorder:null,
  });

  useEffect(() => {
    getUsers();
    getPostorder();
    getLorder();
    getDeliverorder(); 
  }, []);

  const getUsers = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("orders").where("type","==","society").where("orderStatus","==","placed").get();
    setOrder(users.docs.length);
    // filter((x) => x.orderStatus === 'placed')

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid:userData.customerId,
        ddate:userData.datePlaced,
        mode:userData.paymentMethod,
        amount:userData.totalAmount,
        cname:userData.customerName,
        cemail:userData.customerEmail,
        cphno:userData.customerNumber,
        fno:userData.flatNo,
        wing:userData.wing,
        socName:userData.societyName,
        status:userData.orderStatus,
        oitems:userData.items.map(sub=>{
            return(sub.name)
        })

        // name: userData.name || "Not Defined",
        // whatsAppNumber: userData.whatsAppNumber || "-",
        // referralCode: userData.referralCode
        //   ? userData.referralCode.toString()
        //   : "",
        // primaryAddress:
        //   userData.addresses && userData.addresses.length > 0
        //     ? `${userData.addresses[0].line1}, ${userData.addresses[0].line2}, ${userData.addresses[0].city}, ${userData.addresses[0].state}`
        //     : "Not Defined",
        // id: user.id,
      };
    });
    setState({
      ...state,
      users: resolvedUsers,
    });
    setLoading(false);
    // console.log(users.date);
  };
//   console.log(state.users);
  const getPostorder = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("orders").where("type","==","society").where('orderStatus', '==', 'processed').get();
    setPorder(users.docs.length);

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid:userData.customerId,
        ddate:userData.datePlaced,
        mode:userData.paymentMethod,
        amount:userData.totalAmount,
        cname:userData.customerName,
        cemail:userData.customerEmail,
        cphno:userData.customerNumber,
        fno:userData.flatNo,
        wing:userData.wing,
        socName:userData.societyName,
        status:userData.orderStatus,
        oitems:userData.items.map(sub=>{
            return(sub.name)
        })
      };
    });
    setState({
      ...state,
      porder: resolvedUsers,
    });
    setLoading(false);
    console.log(users.date);
  };
//   console.log(state.users);
  const getLorder = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("orders").where("type","==","society").where('orderStatus', '==', 'picked').get();
    setLorder(users.docs.length);

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid:userData.customerId,
        ddate:userData.datePicked,
        mode:userData.paymentMethod,
        amount:userData.totalAmount,
        cname:userData.customerName,
        cemail:userData.customerEmail,
        cphno:userData.customerNumber,
        fno:userData.flatNo,
        wing:userData.wing,
        socName:userData.societyName,
        status:userData.orderStatus,
        oitems:userData.items.map(sub=>{
            return(sub.name)
        })
      };
    });
    setState({
      ...state,
      lorder: resolvedUsers,
    });
    setLoading(false);
    console.log(users.date);
  };
  const getDeliverorder = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("orders").where("type","==","society").where('orderStatus', '==', 'delivered').get();
    setDorder(users.docs.length);

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid:userData.customerId,
        ddate:userData.dateDelivered,
        mode:userData.paymentMethod,
        amount:userData.totalAmount,
        cname:userData.customerName,
        cemail:userData.customerEmail,
        cphno:userData.customerNumber,
        fno:userData.flatNo,
        wing:userData.wing,
        socName:userData.societyName,
        status:userData.orderStatus,
        oitems:userData.items.map(sub=>{
            return(sub.name)
        })
      };
    });
    setState({
      ...state,
      dorder: resolvedUsers,
    });
    setLoading(false);
    // console.log(users.date);
  };
  const prev = async (rowId) => {
    try {
      await firebase.firestore().collection("orders").doc(rowId).update({
        orderStatus : "placed"
      });
      history.push('/');
      history.replace("/users");
      // getUsers();
      // setRefresh(!refresh);
      // getPostorder();
      // alert("Unit Updated");
    }catch (error) {
    }
  };
  const edit = async (rowId) => {
    try {
      await firebase.firestore().collection("orders").doc(rowId).update({
        orderStatus : "processed"
      });
      history.push('/');
      history.replace("/users");
      // getPostorder();
      // setRefresh(!refresh);
      // getUsers();
      // getLorder();
      // alert("Unit Updated");
    }catch (error) {
    }
  };
  const del = async (rowId) => {
    try {
      await firebase.firestore().collection("orders").doc(rowId).update({
        orderStatus : "picked",
        datePicked : Date.now(),
        isCompleted:false
      });
      history.push('/');
      history.replace("/users");
    }catch (error) {
    }
  };
  const comp = async (rowId) => {
    try {
      await firebase.firestore().collection("orders").doc(rowId).update({
        orderStatus : "delivered",
        dateDelivered:Date.now(),
        isCompleted:true
      });
      history.push('/');
      history.replace("/users");
    }catch (error) {
    }
  };
  const onExportData = async (e) => {
    // console.log(e);
    const filteredData = e
      .filter((user) => {
        for (const filterKey in tableFilters) {
          console.log(
            String(user[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(user[filterKey]).search(
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
      .map((items) => ({
        name: items.name,
        price: items.discountedPrice,
      }));

    exportDataToXLSX(filteredData, "usersList");
  };
  const deleteVideo = (item,rowId) => {
    confirmAlert({
      title: "Cancel Order",
      message: <CRow>
      <CCol sm={12}>
      <CLabel style={{ marginLeft: "15px"}} rows="3">Status :</CLabel>
      <select
       style={{ marginLeft: "21px",border: "1px solid #d8dbe0",borderRadius: "0.25rem",textAlign: "left"}}
       id="dropdown"
       >
        <option value="Out Of Stock">Out Of Stock</option>
        <option value="Wrong Item">Wrong Item</option>
        <option value="Quality Issue">Quality Issue</option>
        <option value="Other">Other</option>
      </select>
      </CCol>
        <CLabel style={{ marginLeft: "15px"}}>Comment :</CLabel>
        <br></br>
        <div class="form-floating"style={{ marginLeft: "15px",color:"#333"}} rows="3">
        <textarea placeholder="Leave a comment here" name="textarea" id="floatingTextarea" />
      </div>
      </CRow>,
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("orders").doc(rowId).update({
              orderStatus : "cancelled",
              isCancelled:true,
              comment:document.getElementById("floatingTextarea").value,
              message:document.getElementById("dropdown").value
            });
            if(item.paymentMethod == "online"){
                await firebase.firestore().collection("testUser").doc(item.customerId).collection("wallet").add({
                  amount:item.totalAmount,
                  date:Date.now(),
                  message:"Amount Added to Wallet",
                  type:"credit" 
                });
                alert("Amount Added to Wallet");
              }
            alert("Order Cancelled!");
            getUsers();
            getPostorder();
            getLorder();
            getDeliverorder();
            setRefresh(!refresh);

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
  const view = async(data,rowId) => {
    history.push(
      {
      pathname: '/users/user',
      state: data,
      id: rowId
      }
    )
  };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center" style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>
            <span className="font-xl">Order List</span>
            <span>
              <CButton color="info" className="mr-3"
              //  onClick={() => onExportData(state.users)}
               >
                Export Data
              </CButton>
              {/* <CButton
                color="primary"
                // onClick={() => history.push("/users/create-user")}
              >
                Create User
              </CButton> */}
            </span>
          </CCardHeader>
          <CCardBody>
          <CTabs activeTab="home">
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="home">
                  Order Recieved {order}
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="profile">
                  Order Processed {porder}
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="messages">
                  Left For Delivery {lorder}
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="delivered">
                  Delivered Order {dorder}
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab="home">
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
                      { key: "ddate", label:"Order Date", filter: true},
                      { key: "orderId", label: "Order Id", filter: true},
                      { key: "cname", label: "User Details", filter: true},
                      // { key: "details", label: "User Details", filter: true},
                      { key: "wing", label: "Wing", filter: true},
                      { key: "fno", label: "Flat No", filter: true},
                      { key: "socName",label:"Society Name", filter: true},
                      { key: "oitems", label: "Order Details", filter: true},
                      { key: "amount", label: "Total Amount", filter: false },
                      { key: "payment", label: "Payment" , filter: false},
                      { key: "action", label: "Action" , filter: false},
                    ]}
                    scopedSlots={{
                      ddate: (item) => {
                        return (
                          <td>
                              {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit',hour: 'numeric', minute: 'numeric'}).format(item.ddate)}
                          </td>
                        );
                      },
                      orderId: (item) => {
                        return (
                          <td>
                              {item.oid}
                          </td>
                        );
                      },
                      cname: (item) => {
                          return (
                            <td>
                                <div><i class="fa fa-phone"></i>{item.cname}</div>
                                <div>{item.cemail}</div>
                                <div>{item.cphno}</div>
                            </td>
                          );
                        },
                      wing: (item) => {
                        return (
                          <td>
                              {item.wing}
                          </td>
                        );
                      },
                      fno: (item) => {
                        return (
                          <td>
                              {item.fno}
                          </td>
                        );
                      },
                      socName: (item) => {
                        return (
                          <td>
                              {item.socName}
                          </td>
                        );
                      },
                      oitems:(item)=>{
                          return(
                              <td>
                                  {
                                      item.items.map((sub) => {
                                        return(
                                            <div>{sub.name}</div>
                                        )
                                      })
                                  }
                              </td>
                          );
                      },
                      amount: (item) => {
                        return (
                          <td>
                              <b>₹</b>{item.amount}
                          </td>
                        );
                      },
                      payment: (item) => {
                        return (
                          <td>
                              {item.mode}
                          </td>
                        );
                      },
                      action: (item, index) => {
                        return (
                          <td>
                              {
                                 <CInputGroup style={{flexWrap: "nowrap"}}>
                                    <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => edit(item.id)}>Process</CButton>
                                    <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Refund/Cancel</CButton>
                                    </CInputGroup>
                              }<br></br>{
                                    <CInputGroup style={{flexWrap: "nowrap",marginTop:"-15px"}}>
                                      <CButton style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => view(item,item.id)}>View Order</CButton>
                                    </CInputGroup>
                              }
                          </td>
                        );
                      },
                    }}
                    hover
                    striped
                    columnFilter
                    tableFilter
                    sorter
                    // pagination
                    // itemsPerPageSelect
                    // itemsPerPage={30}
                    clickableRows
                    // onRowClick={(item) =>view(item.oid)}
                    
                  />
              </CTabPane>
              <CTabPane data-tab="profile">
                <CDataTable
                      loading={loading}
                      onColumnFilterChange={(e) => {
                        setTableFilters(e);
                      }}
                      onSorterValueChange={(e) => {
                        console.log(e);
                      }}
                      onTableFilterChange={(filter) => setTableFilters(filter)}
                      items={state.porder}
                      fields={[
                        { key: "ddate", label:"Order Date", filter: true},
                      { key: "orderId", label: "Order Id", filter: true},
                      { key: "cname", label: "User Details", filter: true},
                      { key: "wing", label: "Wing", filter: true},
                      { key: "fno", label: "Flat No", filter: true},
                      { key: "socName",label:"Society Name", filter: true},
                      { key: "oitems", label: "Order Details", filter: true},
                      { key: "amount", label: "Total Amount", filter: false },
                      { key: "payment", label: "Payment" , filter: false},
                      { key: "action", label: "Action" , filter: false},
                      ]}
                      scopedSlots={{
                        ddate: (item) => {
                          return (
                            <td>
                              {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit',hour: 'numeric', minute: 'numeric'}).format(item.ddate)}
                          </td>
                          );
                        },
                        orderId: (item) => {
                          return (
                            <td>
                                {item.oid}
                            </td>
                          );
                        },
                        cname: (item) => {
                            return (
                              <td>
                                  <div><i class="fa fa-phone"></i>{item.cname}</div>
                                  <div>{item.cemail}</div>
                                  <div>{item.cphno}</div>
                              </td>
                            );
                          },
                        wing: (item) => {
                          return (
                            <td>
                                {item.wing}
                            </td>
                          );
                        },
                        fno: (item) => {
                          return (
                            <td>
                                {item.fno}
                            </td>
                          );
                        },
                        socName: (item) => {
                          return (
                            <td>
                                {item.socName}
                            </td>
                          );
                        },
                        oitems:(item)=>{
                            return(
                                <td>
                                    {
                                        item.items.map((sub) => {
                                          return(
                                              <div>{sub.name}</div>
                                          )
                                        })
                                    }
                                </td>
                            );
                        },
                        amount: (item) => {
                          return (
                            <td>
                                <b>₹</b>{item.amount}
                            </td>
                          );
                        },
                        payment: (item) => {
                          return (
                            <td>
                                {item.mode}
                            </td>
                          );
                        },
                        action: (item) => {
                          return (
                            <td>
                                {
                                 <CInputGroup style={{flexWrap: "nowrap"}}>
                                    <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"55px" }} type="button" color="secondary" variant="outline"  onClick={() => del(item.id)}>Left For Delivery</CButton>
                                    <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"55px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Refund/Cancel</CButton>
                                    </CInputGroup>
                              }<br></br>{
                                    <CInputGroup style={{flexWrap: "nowrap",marginTop:"-15px"}}>
                                      <CButton style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"55px" }} type="button" color="secondary" variant="outline" onClick={() => view(item,item.id)}>View Order</CButton>
                                      <CButton style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", width:"120px",height:"55px" }} type="button" color="secondary" variant="outline"onClick={() => prev(item.id)} >Order Recieved</CButton>
                                    </CInputGroup>
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
                      // itemsPerPageSelect
                      // itemsPerPage={30}
                      clickableRows
                      // onRowClick={(item) => history.push(`/users/${item.id}`)}
                    />
              </CTabPane>
              <CTabPane data-tab="messages">
                <CDataTable
                      loading={loading}
                      onColumnFilterChange={(e) => {
                        setTableFilters(e);
                      }}
                      onSorterValueChange={(e) => {
                        console.log(e);
                      }}
                      onTableFilterChange={(filter) => setTableFilters(filter)}
                      items={state.lorder}
                      fields={[
                        { key: "ddate", label:"Delivery Date", filter: true},
                        { key: "orderId", label: "Order Id", filter: true},
                        { key: "cname", label: "User Details", filter: true},
                        // { key: "details", label: "User Details", filter: true},
                        { key: "wing", label: "Wing", filter: true},
                        { key: "fno", label: "Flat No", filter: true},
                        { key: "socName",label:"Society Name", filter: true},
                        { key: "oitems", label: "Order Details", filter: true},
                        { key: "amount", label: "Total Amount", filter: false },
                        { key: "payment", label: "Payment" , filter: false},
                        { key: "action", label: "Action" , filter: false},
                      ]}
                      scopedSlots={{
                        ddate: (item) => {
                          return (
                            <td>
                              {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit',hour: 'numeric', minute: 'numeric'}).format(item.ddate)}
                          </td>
                          );
                        },
                        orderId: (item) => {
                          return (
                            <td>
                                {item.oid}
                            </td>
                          );
                        },
                        cname: (item) => {
                            return (
                              <td>
                                  <div><i class="fa fa-phone"></i>{item.cname}</div>
                                  <div>{item.cemail}</div>
                                  <div>{item.cphno}</div>
                              </td>
                            );
                          },
                        wing: (item) => {
                          return (
                            <td>
                                {item.wing}
                            </td>
                          );
                        },
                        fno: (item) => {
                          return (
                            <td>
                                {item.fno}
                            </td>
                          );
                        },
                        socName: (item) => {
                          return (
                            <td>
                                {item.socName}
                            </td>
                          );
                        },
                        oitems:(item)=>{
                            return(
                                <td>
                                    {
                                        item.items.map((sub) => {
                                          return(
                                              <div>{sub.name}</div>
                                          )
                                        })
                                    }
                                </td>
                            );
                        },
                        amount: (item) => {
                          return (
                            <td>
                                <b>₹</b>{item.amount}
                            </td>
                          );
                        },
                        payment: (item) => {
                          return (
                            <td>
                                {item.mode}
                            </td>
                          );
                        },
                        action: (item, index) => {
                          return (
                            <td>
                                {
                                 <CInputGroup style={{flexWrap: "nowrap"}}>
                                    <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"55px" }} type="button" color="secondary" variant="outline" onClick={() => comp(item.id)}>Delivered</CButton>
                                    <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"55px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Refund/Cancel</CButton>
                                    </CInputGroup>
                              }<br></br>{
                                    <CInputGroup style={{flexWrap: "nowrap",marginTop:"-15px"}}>
                                      <CButton style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"55px" }} type="button" color="secondary" variant="outline" onClick={() => view(item,item.id)} >View Order</CButton>
                                      <CButton style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", width:"120px",height:"55px" }} type="button" color="secondary" variant="outline" onClick={() => edit(item.id)}>Order Processed</CButton>
                                    </CInputGroup>
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
                      // itemsPerPageSelect
                      // itemsPerPage={30}
                      clickableRows
                      // onRowClick={(item) => history.push(`/users/${item.id}`)}
                    />
              </CTabPane>
              <CTabPane data-tab="delivered">
                <CDataTable
                      loading={loading}
                      onColumnFilterChange={(e) => {
                        setTableFilters(e);
                      }}
                      onSorterValueChange={(e) => {
                        console.log(e);
                      }}
                      onTableFilterChange={(filter) => setTableFilters(filter)}
                      items={state.dorder}
                      fields={[
                        { key: "ddate", label:"Delivery Date", filter: true},
                        { key: "orderId", label: "Order Id", filter: true},
                        { key: "cname", label: "User Details", filter: true},
                        // { key: "details", label: "User Details", filter: true},
                        { key: "wing", label: "Wing", filter: true},
                        { key: "fno", label: "Flat No", filter: true},
                        { key: "socName",label:"Society Name", filter: true},
                        { key: "oitems", label: "Order Details", filter: true},
                        { key: "amount", label: "Total Amount", filter: false },
                        { key: "payment", label: "Payment" , filter: false},
                        { key: "action", label: "Action" , filter: false},
                      ]}
                      scopedSlots={{
                        ddate: (item) => {
                          return (
                            <td>
                              {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit',hour: 'numeric', minute: 'numeric'}).format(item.ddate)}
                          </td>
                          );
                        },
                        orderId: (item) => {
                          return (
                            <td>
                                {item.oid}
                            </td>
                          );
                        },
                        cname: (item) => {
                            return (
                              <td>
                                  <div><i class="fa fa-phone"></i>{item.cname}</div>
                                  <div>{item.cemail}</div>
                                  <div>{item.cphno}</div>
                              </td>
                            );
                          },
                        wing: (item) => {
                          return (
                            <td>
                                {item.wing}
                            </td>
                          );
                        },
                        fno: (item) => {
                          return (
                            <td>
                                {item.fno}
                            </td>
                          );
                        },
                        socName: (item) => {
                          return (
                            <td>
                                {item.socName}
                            </td>
                          );
                        },
                        oitems:(item)=>{
                            return(
                                <td>
                                    {
                                        item.items.map((sub) => {
                                          return(
                                              <div>{sub.name}</div>
                                          )
                                        })
                                    }
                                </td>
                            );
                        },
                        amount: (item) => {
                          return (
                            <td>
                                <b>₹</b>{item.amount}
                            </td>
                          );
                        },
                        payment: (item) => {
                          return (
                            <td>
                                {item.mode}
                            </td>
                          );
                        },
                        action: (item, index) => {
                          return (
                            <td>
                                {
                                  <CInputGroup style={{flexWrap: "nowrap"}}>
                                      <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"55px" }} type="button" color="secondary" variant="outline" onClick={() => alert("Item Delivered!")}>Delivered</CButton>
                                      <CButton style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", width:"120px",height:"55px" }} type="button" color="secondary" variant="outline" onClick={()=>del(item.id)}>Left For Delivery</CButton>
                                  </CInputGroup>
                                }<br></br>{
                                  <CInputGroup style={{flexWrap: "nowrap",marginTop:"-15px"}}>
                                    <CButton style={{ color: "#333",backgroundColor: "#00000000",borderColor: "#c7c6c6", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"55px" }} type="button" color="secondary" variant="outline" onClick={() => view(item,item.id)} >View Order</CButton>
                                  </CInputGroup>
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
                      // itemsPerPageSelect
                      // itemsPerPage={30}
                      clickableRows
                      // onRowClick={(item) => history.push(`/users/${item.id}`)}
                    />
              </CTabPane>
            </CTabContent>
          </CTabs>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default SocFilter;
