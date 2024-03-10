import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  CBadge,
  CImg,
  CInputGroup,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CSpinner,
  CLabel,
  CInput,
  CCardImg,
  CCardTitle,
  CCardText,
  CSwitch
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { isEmpty } from "lodash";

const Bill = () => {
  const history = useHistory();
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState("");

  const socData = Date.now() - (7*(24 * 60 * 60 * 1000));
  const curData = Date.now()
  // console.log(curData);
  // console.log(socData);
  var[order, setOrder] = useState(socData);
  var[porder, setPorder] = useState(curData);
  let wallet = 0;
  
  const [cat, setCat] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("Orders")
    .orderBy("orderTime","desc")
    // .where("timestampUNIX", ">=", order).where("timestampUNIX", "<=", porder)
    .get();

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        // cid:videoData.uid,
        // ddate:videoData.acceptTime==0?"":new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.acceptTime),
        // rejectTime:videoData.rejectTime==0?"":new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.rejectTime),
        acceptTime:videoData.acceptTime,
        rejectTime:videoData.rejectTime,
        orderTime:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.orderTime),
        // date:videoData.timestampUNIX,
        deliveryDate:videoData.deliveryDate,
        // deliveryTime:new Date(videoData.deliveryTime.toDate()).toUTCString(),
        deliveryFees:videoData.deliveryFees,
        deliveryLocation:videoData.deliveryLocation,
        deliveryOption:videoData.deliveryOption,
        deliveryTime:videoData.deliveryTime,
        // deniedBy:videoData.deniedBy,
        // isPaid:videoData.isPaid,
        // order:videoData.order,
        orderAccepted:videoData.orderAccept,
        orderCancelled:videoData.orderCancelled,
        orderCompleted:videoData.orderCompleted,
        orderImage:videoData.orderImage,
        orderId:videoData.orderId,
        orderName:videoData.orderName,
        orderPrice:videoData.orderPrice,
        orderProcess:videoData.orderProcess,
        orderQuantity:videoData.orderQuantity,
        orderReturn:videoData.orderReturn,
        // orderDelivered:videoData.orderDelivered,
        // orderReady:videoData.orderReady,
        // orderRejected:videoData.orderRejected,
        orderShipped:videoData.orderShipped,
        orderWeight:videoData.orderWeight,
        userName:videoData.userName,
        userNumber:videoData.userNumber,
        // orderOn:new Date(videoData.orderedOn.toDate()).toUTCString(),
        // paymentMode:videoData.paymentMode,
        // pickUpTime:new Date(videoData.pickUpTime.toDate()).toUTCString(),
        riderId:videoData.riderId,
        riderName:videoData.riderName,
        riderNumber:videoData.riderNumber,

        uid:videoData.uid,
        vendorId:videoData.vendorId
      }
    });
    setState({
      ...state,
      videos: resolvedVideos,
    });
    setCat(resolvedVideos);
    setLoading(false);
  };

  const onExportData = async (e) => {
    state.videos= cat;
    const filteredData = state.videos
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
        // ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.acceptTime),
        // rejectTime:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.rejectTime),
        orderTime:item.orderTime,
        deliveryFees:item.deliveryFees,
        orderId:item.orderId,
        orderName:item.orderName,
        orderPrice:item.orderPrice,
        orderQuantity:item.orderQuantity,
        userName:item.userName,
        userNumber:item.userNumber,
        uid:item.uid,
        vendorId:item.vendorId
      })
      );

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

    const title = "Order";
    // const cName = props.location.state.customerName
    const headers = [
      ["User Details","Date","Order Id","Product Name","Price","Quantity","Delivery Fees","Vendor Id"],
    ];

    const data = e.map((sub)=>{
      return(
        [
          ["Name :"+sub.userName+"\nNumber:"+sub.userNumber+"\n"],
          sub.orderTime,
          sub.orderId,
          sub.orderName,
          sub.orderPrice,
          sub.orderQuantity,
          sub.deliveryFees,
          sub.vendorId
          // [],
          // [e.orderId],
          // [e.service],
          // [e.payerId],[e.paymentId]
      ]
      )
    })
  // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
  // const footer = [["Total Amount:"+e.amount]]

    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("order.pdf");
  };
  const deleteVideo = (item, rowId) => {
    confirmAlert({
      title: "Update Delivery Charge",
      message: (
        <CRow>
          {/* <CCol sm={12}>
            <CLabel style={{ marginLeft: "15px" }} rows="3">
              Refund/Cancel :
            </CLabel>
            <select
              style={{
                marginLeft: "21px",
                border: "1px solid #d8dbe0",
                borderRadius: "0.25rem",
                textAlign: "left",
              }}
              id="status"
              onChange={(e) => handleChange(e)}
            >
            <option value="" selected>Select Type</option>
              <option value="Refund">Refund</option>
              <option value="Cancel">Cancel</option>
            </select>
          </CCol> */}
          {/* <CCol sm={12}>
            <CLabel style={{ marginLeft: "15px" }} rows="3">
              Status :
            </CLabel>
            <select
              style={{
                marginLeft: "21px",
                border: "1px solid #d8dbe0",
                borderRadius: "0.25rem",
                textAlign: "left",
              }}
              id="dropdown"
            >
              <option value="Out Of Stock">Out Of Stock</option>
              <option value="Wrong Item">Wrong Item</option>
              <option value="Quality Issue">Quality Issue</option>
              <option value="Other">Other</option>
            </select>
          </CCol> */}
          <CLabel style={{ marginLeft: "15px" }}>Delivery Charges :</CLabel>
          <br></br>
          <div
            class="form-floating"
            style={{ marginLeft: "15px", color: "#333" }}
            rows="3"
          >
            <input
              placeholder={item}
              type="number"
              name="textarea"
              id="floatingTextarea"
            />
          </div>
        </CRow>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            var ref = document.getElementById("floatingTextarea").value;

            await firebase
              .firestore()
              .collection("Orders")
              .doc(rowId)
              .update({
                deliveryFees:parseFloat(ref)
              }).then(()=>{
                alert("Charges Updated");
                getVideos();
              });
          },
        },
        {
          label: "No",
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
    });
  };
  const updatedStatus = async (item,id,value) => {
    const updateddata = item.payment.map((temp,i) => temp.method=="COD"?
    Object.assign(temp,{["amount"]: 0}) : temp);
    // console.log(updateddata);
    if( value == "Follow Up"){
      await firebase.firestore().collection("orders").doc(id).update({
        unpaidStatus: value
      });
    }else{
        await firebase.firestore().collection("orders").doc(id).update({
            unpaidStatus: value,
            unpaidAmount:0,
            paidUnpaidAmount:item.unpaidAmount,
            payment:updateddata
          });
    }
    getVideos(); 
    history.push('/');
    history.replace("/payment-report");
    getVideos(); 
  };

  const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-to").value).setHours(23,59,59,999);
    order=new Date(document.getElementById("date-from").value).setHours(0,0,0,0);
    wallet = 0;
    getVideos();
  };

  return (
    <CRow>
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
            <CRow>
                <CCol sm="3">
                    <div className="font-xl">Order Management</div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    {/* <div style={{width:"160px",marginLeft:"5px"}}>
                        From:
                        <span><CInput type="date" id="date-from" name="date-input" placeholder="date"/></span>
                    </div> */}
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    {/* <div style={{width:"160px",marginLeft:"5px"}}>
                        To:
                        <span><CInput type="date" id="date-to" name="date-input" placeholder="date" onChange={() => onChangeDate()}/></span>   
                    </div> */}
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    <div>
                        <CButton color="info" className="mr-3"
                        onClick={() => onExportData()}
                        style={{ float:"right"}}
                        >
                            Export Data
                        </CButton>
                    </div>
                </CCol>
            </CRow>
        </CCardHeader>
          <CCardBody>
          {/* <CCard className="mb-3" style={{ maxWidth: '540px',marginLeft:"18px" }}>
        <CRow className="g-0">
          <CCol md={4}>
            <CCardImg src={"avatars/Payment.jpg"}/>
          </CCol>
          <CCol md={8}>
            <CCardBody>
              <CCardTitle>Payment Report</CCardTitle>
              {
                    cat.map((sub)=>{
                        // if(sub.payment === true){
                            wallet = wallet + sub.amount;
                        // }
                    })
                                
                }
              <CCardText>
                <b> Total : ₹{wallet}</b> 
              </CCardText>
            </CCardBody>
          </CCol>
        </CRow>
      </CCard> */}
              <CRow>
                <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      // console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={state.videos}
                    fields={[
                    //   { key: "ddatePlaced", label: "Order Date", filter: true },
                      { key: "srno", label: "Sr.no", filter: true },
                      { key: "orderTime", label: "Date", filter: true },
                      { key: "orderId", label: "Id", filter: true },
                      { key: "uid", label: "User Id", filter: true },
                      { key: "userName", label: "User Name", filter: true },
                      { key: "userNumber", label: "User Number", filter: true },
                      { key: "vendorId", label: "Vendor Id", filter: true },
                      { key: "order", label: "Order", filter: false },
                      { key: "orderName", label: "Order Name", filter: true },
                      { key: "orderQuantity", label: "order Quantity", filter: true },
                      { key: "orderPrice", label: "Order Price", filter: true },
                      { key: "orderPrices", label: "15% Less Order Price", filter: true },
                      { key: "orderAccepted", label: "Order Accepted", filter: true },
                      { key: "acceptTime", label: "Accept Time", filter: true },
                      { key: "orderProcess", label: "Order Process", filter: true },
                      { key: "orderShipped", label: "Order Shipped", filter: true },
                      { key: "orderWeight", label: "Order Weight", filter: true },
                      { key: "orderReturn", label: "Order Return", filter: true },
                      { key: "orderCancelled", label: "Order Cancelled", filter: true },
                      { key: "rejectTime", label: "Reject Time", filter: true },
                      { key: "orderCompleted", label: "Order Completed", filter: true },
                      // { key: "isPaid", label: "Paid", filter: true },
                      { key: "riderId", label: "Rider Id", filter: true }, 
                      { key: "riderName", label: "Rider Name", filter: true }, 
                      { key: "riderNumber", label: "Rider Number", filter: true }, 
                      { key: "deliveryDate", label: "Delivery Date", filter: true },                 
                      { key: "deliveryTime", label: "Delivery Time", filter: true },
                      { key: "deliveryOption", label: "Delivery Option", filter: true },
                      { key: "deliveryFees", label: "Delivery Fees", filter: true },
                      { key: "deliveryLocation", label: "Delivery Location", filter: true },
                      // { key: "pickUpTime", label: "Pickup Time", filter: true },
                      // { key: "riderId", label: "Rider Id", filter: true },
                      { key: "action", label: "Action" , filter: false},
                      
                    ]}
                    scopedSlots={{
                        srno: (item, index) => {
                            return (
                                item.isCancelled == true?<td hidden></td>:
                              <td>
                                  {index+1}
                              </td>
                            );
                          },
                          acceptTime: (item) => {
                            return (
                                // item.isCancelled == true?<td hidden></td>:
                              <td>
                                <div>{item.acceptTime}</div>
                                {/* <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.date)}</div> */}
                              </td>
                            );
                          },
                        orderTime: (item) => {
                          return(
                           // item.isCancelled == true?<td hidden></td>:
                           <td>{item.orderTime}</td>
                          )
                         },
                      orderId: (item) => {
                       return(
                        // item.isCancelled == true?<td hidden></td>:
                        <td>{item.orderId}</td>
                       )
                      },
                      // image: (item) => (
                      //   <td>
                      //     <CImg
                      //       rounded="true"
                      //       src={item.imageUrl}
                      //       width={100}
                      //       height={100}
                      //     />
                      //   </td>
                      // ),
                      orderName: (item) => {
                        return(
                        //  item.isCancelled == true?<td hidden></td>:
                         <td>{item.orderName}</td>
                        )
                       },
                       order: (item) => (
                        <td>
                          <CImg
                            rounded="true"
                            src={item.orderImage}
                            width={100}
                            height={100}
                          />
                        </td>
                        ),
                        orderPrice: (item) => {
                          // let disc = (15*item.orderPrice)/100;
                          return(
                           // item.isCancelled == true?<td hidden></td>:
                           <td>{item.orderPrice}</td>
                          //  <td>{Math.round(item.orderPrice-disc)}</td>
                          )
                         },
                         orderPrices: (item) => {
                          let disc = (15*item.orderPrice)/100;
                          return(
                           // item.isCancelled == true?<td hidden></td>:
                          //  <td>{item.orderPrice}</td>
                           <td>{Math.round(item.orderPrice-disc)}</td>
                          )
                         },
                         orderQuantity: (item) => {
                          return(
                           // item.isCancelled == true?<td hidden></td>:
                           <td>{item.orderQuantity}</td>
                          )
                         },
                         orderWeight: (item) => {
                          return(
                           // item.isCancelled == true?<td hidden></td>:
                           <td>{item.orderWeight}</td>
                          )
                         },
                         rejectTime: (item) => {
                          return(
                           // item.isCancelled == true?<td hidden></td>:
                           <td>{item.rejectTime}</td>
                          )
                         },
                       uid: (item) => {
                        return (
                            // item.isCancelled == true?<td hidden></td>:
                          <td>
                            <div>
                              {item.uid.slice(0, 7)}
                            </div>
                          </td>
                        );
                      },
                      vendorId: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.vendorId.slice(0, 7)}</td>
                        )
                       },
                       userName: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.userName}</td>
                        )
                       },
                       userNumber: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.userNumber}</td>
                        )
                       },
                       paymentMode: (item) => {
                        return (
                            // item.isCancelled == true?<td hidden></td>:
                          <td>
                            {item.paymentMode}
                          </td>
                        );
                      },
                      riderId: (item) => {
                        return(
                        //  item.isCancelled == true?<td hidden></td>:
                         <td>{item.riderId}</td>
                        )
                       },
                       riderName: (item) => {
                        return(
                        //  item.isCancelled == true?<td hidden></td>:
                         <td>{item.riderName}</td>
                        )
                       },
                       riderNumber: (item) => {
                        return(
                        //  item.isCancelled == true?<td hidden></td>:
                         <td>{item.riderNumber}</td>
                        )
                       },
                      deliveryDate: (item) => {
                        return (
                            // item.isCancelled == true?<td hidden></td>:
                          <td>
                              {item.deliveryDate}
                          </td>
                        );
                      },
                      deliveryTime: (item) => {
                        return (
                            // item.isCancelled == true?<td hidden></td>:
                          <td>
                            {item.deliveryTime}
                          </td>
                        );
                      },
                      //  amount: (item) => {
                      //   return (
                      //       // item.isCancelled == true?<td hidden></td>:
                      //     <td>
                      //       <b>₹</b>{item.amount}
                      //     </td>
                      //   );
                      // },
                      deliveryOption: (item) => {
                        return (
                            // item.isCancelled == true?<td hidden></td>:
                          <td>
                            {item.deliveryOption}
                            {/* {item.payment == true?<div></div>:<div><b>₹</b>{49}</div>} */}
                          </td>
                        );
                      },
                      deliveryFees: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.deliveryFees}</td>
                        )
                       },
                       deliveryLocation: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.deliveryLocation}</td>
                        )
                       },
                      orderAccepted: (item, index) => {
                        return (
                          <td>
                                 <CSwitch
                                shape= 'pill'
                                color="success"
                                size='lg'
                                checked={item.orderAccepted}
                                onChange={async (e) => {
                                  // toggle(item.id,item.isActive,item.token)
                                }}
                                />                         
                          </td>
                        );
                      },
                      orderCancelled: (item, index) => {
                        return (
                          <td>
                                 <CSwitch
                                shape= 'pill'
                                color="success"
                                size='lg'
                                checked={item.orderCancelled}
                                onChange={async (e) => {
                                  // toggle(item.id,item.isActive,item.token)
                                }}
                                />                         
                          </td>
                        );
                      },
                      orderCompleted: (item, index) => {
                        return (
                          <td>
                                 <CSwitch
                                shape= 'pill'
                                color="success"
                                size='lg'
                                checked={item.orderCompleted}
                                onChange={async (e) => {
                                  // toggle(item.id,item.isActive,item.token)
                                }}
                                />                         
                          </td>
                        );
                      },
                      orderDelivered: (item, index) => {
                        return (
                          <td>
                                 <CSwitch
                                shape= 'pill'
                                color="success"
                                size='lg'
                                checked={item.orderDelivered}
                                onChange={async (e) => {
                                  // toggle(item.id,item.isActive,item.token)
                                }}
                                />                         
                          </td>
                        );
                      },
                      orderProcess: (item, index) => {
                        return (
                          <td>
                                 <CSwitch
                                shape= 'pill'
                                color="success"
                                size='lg'
                                checked={item.orderProcess}
                                onChange={async (e) => {
                                  // toggle(item.id,item.isActive,item.token)
                                }}
                                />                         
                          </td>
                        );
                      },
                      orderReturn: (item, index) => {
                        return (
                          <td>
                                 <CSwitch
                                shape= 'pill'
                                color="success"
                                size='lg'
                                checked={item.orderReturn}
                                onChange={async (e) => {
                                  // toggle(item.id,item.isActive,item.token)
                                }}
                                />                         
                          </td>
                        );
                      },
                      orderShipped: (item, index) => {
                        return (
                          <td>
                                 <CSwitch
                                shape= 'pill'
                                color="success"
                                size='lg'
                                checked={item.orderShipped}
                                onChange={async (e) => {
                                  // toggle(item.id,item.isActive,item.token)
                                }}
                                />                         
                          </td>
                        );
                      },
                      pickUpTime: (item) => {
                        return (
                            // item.isCancelled == true?<td hidden></td>:
                          <td>
                            {item.pickUpTime}
                          </td>
                        );
                      },
                      // riderId: (item) => {
                      //   return (
                      //       // item.isCancelled == true?<td hidden></td>:
                      //     <td>
                      //       {item.riderId.slice(0, 7)}
                      //     </td>
                      //   );
                      // },
                      action: (item, index) => {
                        return (
                            item.isCancelled == true?<td hidden></td>: 
                          <td>
                             <CInputGroup style={{flexWrap: "nowrap"}}>
                                <CButton style={{ color: "#fff",backgroundColor: "#321fdb",borderColor: "#321fdb", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() =>  deleteVideo(item.deliveryFees,item.id)}>Update Charge</CButton>
                                {/* <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Refund/Cancel</CButton> */}
                              </CInputGroup>
                          </td>
                        );
                      },
                    }}
                    hover
                    striped
                    columnFilter
                    sorter
                    pagination
                    itemsPerPage={30}
                    clickableRows
                  />
            </CRow>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginBlock: 10,
              }}
            >
              {pageLoading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <td hidden></td>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Bill;
