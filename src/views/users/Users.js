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
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useFormik } from "formik";

const Users = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const[order, setOrder] = useState("");
  const[porder, setPorder] = useState("");
  const[lorder, setLorder] = useState("");
  const[dorder, setDorder] = useState("");
  const[cat,setCat]=useState([]);
  const[data,setData]=useState([]);
  
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
    // getPackage();
  }, []);

  // const getPackage = async () =>{
  //   const response=await firebase.firestore().collection("generalData").doc("data").get();
  //   response.data().packersName.map(sub1 =>{
  //       return(data.push(sub1))
  //     })
  //   setData([...data,data])
  // };
  const getUsers = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("Services").where("isCancelled","==",false).where("isCancelled","==",false).where("status","==","Pending").get();
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
        // payment:userData.payment,
        // packedBy:userData.packedBy,
        // oitems:userData.items.map(sub=>{
        //     return(sub.name)
        // })
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
  // console.log(cat);
  const getPostorder = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("Services").where("isCancelled","==",false).where("isCancelled","==",false).where("status","==","Accepted").get();
    setPorder(users.docs.length);

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
      porder: resolvedUsers,
    });
    setLoading(false);
    console.log(users.date);
  };
//   console.log(state.users);
  const getLorder = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("orders").where("userType","==","Society").where("isCancelled","==",false).where("isCancelled","==",false).where('orderStatus', '==', 'picked').get();
    setLorder(users.docs.length);

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid:userData.customerId,
        // ddate:userData.datePicked,
        ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(userData.datePicked),
        date:userData.datePicked,
        amount:userData.totalAmount,
        cname:userData.customerName,
        cemail:userData.customerEmail,
        cphno:userData.customerNumber,
        fno:userData.flatNo,
        wing:userData.wing,
        socName:userData.societyName,
        status:userData.orderStatus,
        payment:userData.payment,
        packedBy:userData.packedBy,
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
    const users = await firebase.firestore().collection("orders").where("userType","==","Society").where("isCancelled","==",false).where("isCancelled","==",false).where('orderStatus', '==', 'delivered').get();
    setDorder(users.docs.length);

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid:userData.customerId,
        // ddate:userData.dateDelivered,
        ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(userData.dateDelivered),
        date:userData.dateDelivered,
        amount:userData.totalAmount,
        cname:userData.customerName,
        cemail:userData.customerEmail,
        cphno:userData.customerNumber,
        fno:userData.flatNo,
        wing:userData.wing,
        socName:userData.societyName,
        status:userData.orderStatus,
        payment:userData.payment,
        packedBy:userData.packedBy,
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
// console.log(state.users);
  const onExportData = async (e) => {
    state.users = cat;
    const filteredData = state.users
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
      .map((item) => ({
        name: item.cname,
        number:item.cphno,
        wing: item.wing,
        flatNo:item.fno,
        societyName:item.socName,
        order:item.items.map(sub=>
            [sub]
          )
      }));

      // console.log(filteredData);
      exportPDF(filteredData);
    // exportDataToXLSX(filteredData, "usersList");
  };
  const exportPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Society Order";
    // const cName = props.location.state.customerName
    const headers = [["Customer Details", "Wing","Flat No","Society Name","Order[Name,Quantity,Weight]"]];

    const data =e.map(elt => [[elt.name+'\n'+elt.number],elt.wing,elt.flatNo,elt.societyName,elt.order.map(sub =>sub.map(sub1=>[sub1.name+" : "+sub1.quantity+" * "+sub1.weight+'\n']))]);
    // props.location.state.items.map(elt=>
    // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
    // const footer = [["Total Amount: Rs."+props.location.state.amount]]

    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    console.log(content);
    console.log(data);
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("societyorder.pdf")
  }
  const deleteVideo = (item,rowId) => {
    confirmAlert({
      title: "Cancel Order",
      message: "Are you sure to Cancel ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("Services").doc(rowId).update({
              orderStatus : "cancelled",
              isCancelled:true,
              isCompleted:true
            });
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
              {/* <CButton color="info" className="mr-3"
               onClick={() => onExportData()}
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
              {/* <CNavItem>
                <CNavLink data-tab="messages">
                  Left For Delivery {lorder}
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="delivered">
                  Completed Order {dorder}
                </CNavLink>
              </CNavItem> */}
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
                      { key: "id", label: "Order Id", filter: true},
                      { key: "cname", label: "User Details", filter: true},
                      { key: "cadd", label: "Address", filter: true},
                      { key: "message", label: "Message", filter: true},
                      { key: "service", label: "Services", filter: true},
                      // { key: "socName",label:"Society Name", filter: true},
                      // { key: "oitems", label: "Order Details", filter: true},
                      // { key: "amount", label: "Total Amount", filter: true },
                      //  // { key: "mode", label: "Payment" , filter: true},
                      { key: "action", label: "Action" , filter: false},
                      // { key: "packedBy", label: "Packed By" , filter: false},
                    ]}
                    scopedSlots={{
                      ddate: (item) => {
                        return (
                          <td>
                            <div>{item.ddate}</div>
                            <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.date)}</div>
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
                      message: (item) => {
                        return (
                          <td>
                              {item.message}
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
                                <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Cancel Service</CButton>
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
                    pagination
                    // itemsPerPageSelect
                    itemsPerPage={30}
                    clickableRows
                    // onRowClick={(item) =>view(item.id)}
                    
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
                      { key: "id", label: "Order Id", filter: true},
                      { key: "cname", label: "User Details", filter: true},
                      { key: "cadd", label: "Address", filter: true},
                      { key: "message", label: "Message", filter: true},
                      { key: "service", label: "Services", filter: true},
                      // { key: "socName",label:"Society Name", filter: true},
                      // { key: "oitems", label: "Order Details", filter: true},
                      // { key: "amount", label: "Total Amount", filter: true },
                      //  // { key: "mode", label: "Payment" , filter: true},
                      { key: "action", label: "Action" , filter: false},
                      // { key: "packedBy", label: "Packed By" , filter: false},
                    ]}
                    scopedSlots={{
                      ddate: (item) => {
                        return (
                          <td>
                            <div>{item.ddate}</div>
                            <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.date)}</div>
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
                      message: (item) => {
                        return (
                          <td>
                              {item.message}
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
                                <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Cancel Service</CButton>
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
                    pagination
                    // itemsPerPageSelect
                    itemsPerPage={30}
                    clickableRows
                    // onRowClick={(item) =>view(item.id)}
                    
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
                        { key: "id", label: "Order Id", filter: true},
                        { key: "cname", label: "User Details", filter: true},
                        // { key: "details", label: "User Details", filter: true},
                        { key: "wing", label: "Wing", filter: true},
                        { key: "fno", label: "Flat No", filter: true},
                        { key: "socName",label:"Society Name", filter: true},
                        { key: "oitems", label: "Order Details", filter: true},
                        { key: "amount", label: "Total Amount", filter: true },
                         // { key: "mode", label: "Payment" , filter: true},
                        { key: "action", label: "Action" , filter: false},
                      ]}
                      scopedSlots={{
                        ddate: (item) => {
                          return (
                            <td>
                               <div>{item.ddate}</div>
                            <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.date)}</div>
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
                                {
                                  item.payment.map(sub=>{
                                      return(<div>{sub.method} = <b>₹</b>{sub.amount}</div>)
                                  }) 
                              }
                              <hr style={{width: "100%",marginLeft: "auto",marginRight: "auto",overflow: "hidden",border:"1px solid #333"}}/>
                              <div>Total = <b>₹</b>{item.amount}</div>
                            </td>
                          );
                        },
                        mode: (item) => {
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
                        { key: "id", label: "Order Id", filter: true},
                        { key: "cname", label: "User Details", filter: true},
                        // { key: "details", label: "User Details", filter: true},
                        { key: "wing", label: "Wing", filter: true},
                        { key: "fno", label: "Flat No", filter: true},
                        { key: "socName",label:"Society Name", filter: true},
                        { key: "oitems", label: "Order Details", filter: true},
                        { key: "amount", label: "Total Amount", filter: true },
                         // { key: "mode", label: "Payment" , filter: true},
                        { key: "action", label: "Action" , filter: false},
                      ]}
                      scopedSlots={{
                        ddate: (item) => {
                          return (
                            <td>
                               <div>{item.ddate}</div>
                            <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.date)}</div>
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
                                {
                                  item.payment.map(sub=>{
                                      return(<div>{sub.method} = <b>₹</b>{sub.amount}</div>)
                                  }) 
                              }
                              <hr style={{width: "100%",marginLeft: "auto",marginRight: "auto",overflow: "hidden",border:"1px solid #333"}}/>
                              <div>Total = <b>₹</b>{item.amount}</div>
                            </td>
                          );
                        },
                        mode: (item) => {
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

export default Users;
