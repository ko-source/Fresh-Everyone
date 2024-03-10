import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  CDataTable,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardImg,
  CCardText,
  CCol,
  CRow,
  CImg,
  CLabel,
  CButton,
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const User = (props,{ match }) => {
  // console.log(props.location.state);
  // console.log(props.location.id);
  const PriceData = [...props.location.state.items]
  const [userDetails, setUserDetails] = useState();
  const [totalamt, setTotalamt] = useState("");
  const history = useHistory();
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [socPrice, setPrice] = useState(PriceData);
  const [refresh, setRefresh] = React.useState(false);
  var [cat, setCat] = useState();
  var [state, setState] = useState({
    users: null,
  });

  useEffect(() => {
    getUsers();
  },[]);
  
  const getUsers = async () => {
    setLoading(true);
    // const users = await firebase.firestore().collection("orders").doc(props.location.id).get();
    // console.log(users);

    setCat(props.location.state.items.map(sub=>{
            return(sub.name)
        })
        )
    // setCat(.name)
    // setCat({
    //   cat: resolvedUsers,
    // });
    setLoading(false);
    // console.log(users.date);
  };
  // console.log(cat);

  const Change = (index) =>{
    const updateddata = socPrice.map((socPrice,i) => index == i ?
    Object.assign(socPrice,{["itemStatus"]: "cancelled"}) : socPrice );
    setPrice(updateddata);
    Comment(index);
  };
  const Comment = (index) =>{
    const updateddata = socPrice.map((socPrice,i) => index == i ?
    Object.assign(socPrice,{["comment"]: document.getElementById("floatingTextarea").value}) : socPrice );
    setPrice(updateddata);
    Message(index);
  };
  const Message = (index) =>{
    const updateddata = socPrice.map((socPrice,i) => index == i ?
    Object.assign(socPrice,{["message"]: document.getElementById("dropdown").value}) : socPrice );
    setPrice(updateddata);
  };

  const deleteVideo = (index,price) => {
    // console.log(rowId);
    confirmAlert({
      title: "Cancel Item",
      message: <CRow>
        <CCol sm={12}>
      <CLabel style={{ marginLeft: "15px"}} rows="3">Refund/Cancel :</CLabel>
      <select
       style={{ marginLeft: "21px",border: "1px solid #d8dbe0",borderRadius: "0.25rem",textAlign: "left"}}
       id="status"
       >
        <option value="Refund">Refund</option>
        <option value="Cancel">Cancel</option>
      </select>
      </CCol>
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
            Change(index);
            await firebase.firestore().collection("orders").doc(props.location.id).update({
              totalAmount : props.location.state.amount-price
            });
            await firebase.firestore().collection("orders").doc(props.location.id).update({
              items : socPrice,
            });
            props.location.state.payment.map(async(sub)=>{
              if(sub.method != "COD"){
                await firebase.firestore().collection("users").doc(props.location.state.customerId).collection("wallet").add({
                  amount:sub.amount,
                  date:Date.now(),
                  message:"Item Cancelled and Amount Added to Wallet",
                  type:"credit" 
                });
                await firebase.firestore().collection("users").doc(props.location.state.customerId).update({
                  walletAmount:firebase.firestore.FieldValue.increment(sub.amount.valueOf())
                });
                alert("Amount Added to Wallet");
              }
            })
            var ref = document.getElementById("status").value;
            console.log(ref);
            if( ref == "Refund"){
              await firebase.firestore().collection("users").doc(props.location.state.customerId).collection("wallet").add({
                amount:price,
                date:Date.now(),
                message:"Item Cancelled and Amount Added to Wallet",
                type:"credit" 
              });
              await firebase.firestore().collection("users").doc(props.location.state.customerId).update({
                      walletAmount:firebase.firestore.FieldValue.increment(price.valueOf())
                    });
              alert("Amount Added to Wallet");
            }
            alert("Item Cancelled!");
            history.push(
              {
              pathname: '/users',
              }
            )
            // getUsers();
            // setRefresh(!refresh);

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
  
  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Invoice";
    // const cName = props.location.state.customerName
    const headers = [["Product Name", "Quanitity * Weight","Quanitity * Unit Price","Total Price","Status"]];

    const data = props.location.state.items.map(elt=>  elt.itemStatus=="cancelled"?[elt.name,elt.quantity+"*"+elt.weight,elt.quantity+"* Rs."+elt.discountedPrice,"Rs."+elt.quantity*elt.discountedPrice,elt.itemStatus]:[elt.name,elt.quantity+"*"+elt.weight,elt.quantity+"* Rs."+elt.discountedPrice,"Rs."+elt.quantity*elt.discountedPrice,elt.itemStatus]);
    const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
    const footer = [["Total Amount: Rs."+props.location.state.amount]]

    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      foot:footer
    };

    doc.text(title, marginLeft, 40);
    // doc.text(cName, marginLeft);
    doc.autoTable(content);
    doc.save("invoice.pdf")
  }


  return (
    <>
      <CRow>
      <CCard className="mb-3" style={{ maxWidth: '540px',marginLeft:"18px" }}>
        <CRow className="g-0">
          <CCol md={4}>
            <CCardImg src={"avatars/profile.jpg"} />
          </CCol>
          <CCol md={8}>
            <CCardBody>
              <CCardTitle>User Profile</CCardTitle>
              <CCardText>
                Name: {props.location.state.cname}
              </CCardText>
              {props.location.state.cphno==""?<CCardText></CCardText>:<CCardText>
                Phone No.: {props.location.state.cphno}
              </CCardText>}
              {props.location.state.cemail==""?<CCardText></CCardText>:<CCardText>
                Email Id: {props.location.state.cemail}
              </CCardText>}
              <CCardText>
                Wing & Flat No: {props.location.state.wing+"/"+props.location.state.flatNo} 
              </CCardText>
              <CCardText>
                Society Name: {props.location.state.socName}
              </CCardText>
              {/* <CCardText>
                <small className="text-medium-emphasis">Last updated 3 mins ago</small>
              </CCardText> */}
            </CCardBody>
          </CCol>
        </CRow>
      </CCard>
        <CCol lg={12}>
          <CCard>
            <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>
              <span className="font-xl">Ordered Item List</span>
              <span style={{float: 'right'}}>
              <CButton color="info" className="mr-3"
              // onClick={() => exportPDF()}
              //  onClick={onExportData}
               >
                Export Invoice
              </CButton>
              </span>
              </CCardHeader>
            <CCardBody>
              <CDataTable
                onColumnFilterChange={(e) => {
                  setTableFilters(e);
                }}
                onSorterValueChange={(e) => {
                  console.log(e);
                }}
                items={props.location.state.items}
                fields={[
                      { key: "srno", label: "Product Image", filter: true},
                      // { key: "details", label: "User Details", filter: true},
                      { key: "cat", label: "Product Name", filter: true},                      
                      { key: "qua",label:"Quanitity * Weight", filter: true},
                      { key: "unit", label: "Quanitity * Unit Price", filter: false },
                      { key: "tp", label: "Total Price" , filter: false},
                      { key: "stat", label: "Status", filter: true},
                      { key: "action", label: "Action" , filter: false},
                ]}
                scopedSlots={{
                
                  srno: (item,index) => {
                    return (
                      item.itemStatus =="cancelled"?<td hidden></td>:
                      <td>
                        {
                              <CImg
                              key={index}
                              rounded="true"
                              src={item.imageUrl}
                              width={90}
                              height={90}
                            />
                        }
                      </td>
                    );
                  },
                  cat: (item) => {
                    return (
                      item.itemStatus =="cancelled"?<td hidden></td>:
                      <td>
                        {
                          // item.items.map(sub =>{
                          //   return(
                              // <CRow style={{height:"100px",textAlign:"center",display: "flex",flexWrap: "nowrap",flexDirection: "column"}}>
                              item.name
                        }
                      </td>
                    );
                  },
                  qua: (item) => {
                    return (
                      item.itemStatus =="cancelled"?<td hidden></td>:
                      <td>
                        {
                          // <CRow style={{height:"100px",textAlign:"center",display: "flex",flexWrap: "nowrap",flexDirection: "column"}}>
                              <div><span>{item.quantity}</span>*<span>{item.weight}</span></div>
                          }
                          </td>
                    );
                  },
                  unit: (item) => {
                    return (
                      item.itemStatus =="cancelled"?<td hidden></td>:
                      <td>
                        {
                              // <CRow style={{height:"100px",textAlign:"center",display: "flex",flexWrap: "nowrap",flexDirection: "column"}}>
                              <div><span>{item.quantity}</span>*<span><span><b>₹</b></span>{item.discountedPrice}</span></div>
                                }
                        </td>
                    );
                  },
                  tp: (item) => {
                    return (
                      item.itemStatus =="cancelled"?<td hidden></td>:
                      <td>{
                            // <CRow style={{height:"100px",textAlign:"center",display: "flex",flexWrap: "nowrap",flexDirection: "column"}}>
                            <div><span><b>₹</b></span><span>{item.quantity*item.discountedPrice}</span></div>
                            }</td>
                    );
                  },
                  stat: (item) => {
                    return (
                      item.itemStatus =="cancelled"?<td hidden></td>:
                      <td>{ 
                        //   <CRow style={{height:"100px",textAlign:"center",display: "flex",flexWrap: "nowrap",flexDirection: "column"}}>
                        props.location.state.status
                      }
                      </td>
                    );
                  },
                  action: (item,index) => {
                    return (
                      item.itemStatus =="cancelled"?<td hidden></td>:
                      <td>{
                        <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"55px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(index,item.discountedPrice)}>Refund/Cancel</CButton>  
                      }                   
                      </td>
                    );
                  },
                }}
                columnFilter
                // tableFilter
                sorter
                light
              />
              {/* <CCardText>Total: {totalamt}</CCardText> */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default User;
