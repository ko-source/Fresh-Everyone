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
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { isEmpty } from "lodash";

const PaymentReport = () => {
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
    const videos = await firebase.firestore().collection("payments")
    .orderBy("time","desc")
    // .where("timestampUNIX", ">=", order).where("timestampUNIX", "<=", porder)
    .get();

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        // cid:videoData.uid,
        // ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.date),
        // date:videoData.date,
        amount:videoData.amount,
        name:videoData.name,
        paymentId:videoData.paymentId,
        orderId:videoData.orderId,
        time:new Date(videoData.time.toDate()).toUTCString(),
        // itype:videoData.Income_type,
        // Mobile:videoData.Mobile,
        // RoomORShop:videoData.RoomORShop,
        // Time:videoData.Time,
        // datetime:videoData.datetime,
        // type:videoData.type,
        // orderId:videoData.orderid,
        uid:videoData.uid,
        // type:videoData.type
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
    // state.videos= cat;
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
        id: item.id,
        // cid:videoData.uid,
        date:item.time,
        amount:item.amount,
        name:item.name,
        payment:item.paymentId,
        uid:item.uid,
        type:item.orderId
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

    const title = "Invoice";
    // const cName = props.location.state.customerName
    const headers = [
      ["Payment Id","Date","Amount","Name","User Id","Order Id"],
    ];

    const data =e.map((sub,index) =>[
      // [elt.name + "\n" + elt.number],
      sub.payment,
      sub.date,
      sub.amount,
      sub.name,
      sub.uid,
      sub.type
      // sub.isActive == true?"Yes":"No",
      // cat.map((sub1) =>
      //   sub1.id == sub.id?sub1.refCode:"  "
      // )
  ]);
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
    doc.save("invoice.pdf");
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
                    <div className="font-xl">Payment Report</div>
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
                      { key: "time", label: "Date", filter: true },
                      { key: "paymentId", label: "Payment Id", filter: true },
                      { key: "orderId", label: "Order Id", filter: true },
                      { key: "amount", label: "Amount", filter: true },
                      { key: "name", label: "Name", filter: true },
                      // { key: "Floor", label: "Floor", filter: true },                  
                      // { key: "RoomORShop", label: "Room Or Shop", filter: true },
                    //   { key: "status", label: "Order Status", filter: true },
                      // { key: "amount", label: "Total Amount", filter: true },
                      { key: "uid", label: "User Id", filter: true},
                      // { key: "type", label: "Type", filter: true},
                      // { key: "action", label: "Action" , filter: false},
                      
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
                        // ddate: (item) => {
                        //     return (
                        //         item.isCancelled == true?<td hidden></td>:
                        //       <td>
                        //         <div>{item.ddate}</div>
                        //         <div>{new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric'}).format(item.date)}</div>
                        //       </td>
                        //     );
                        //   },
                        paymentId: (item) => {
                       return(
                        // item.isCancelled == true?<td hidden></td>:
                        <td>{item.paymentId}</td>
                       )
                      },
                      amount: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.amount}</td>
                        )
                       },
                       name: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.name}</td>
                        )
                       },
                      orderId: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.orderId}</td>
                        )
                       },
                      datetime: (item) => {
                        return(
                        //  item.isCancelled == true?<td hidden></td>:
                         <td>{item.date}</td>
                        )
                       },
                      cname: (item) => {
                        return (
                            // item.isCancelled == true?<td hidden></td>:
                          <td>
                            <div>
                              <i class="fa fa-phone"></i>
                              {item.cname}
                            </div>
                          </td>
                        );
                      },
                      time: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.time}</td>
                        )
                       },
                      itype: (item) => {
                        return (
                            // item.isCancelled == true?<td hidden></td>:
                          <td>
                            {item.itype}
                          </td>
                        );
                      },
                      // uid: (item) => {
                      //   return (
                      //       // item.isCancelled == true?<td hidden></td>:
                      //     <td>
                      //         {item.}
                      //     </td>
                      //   );
                      // },
                       amount: (item) => {
                        return (
                            // item.isCancelled == true?<td hidden></td>:
                          <td>
                            <b>₹</b>{item.amount}
                          </td>
                        );
                      },
                      RoomORShop: (item) => {
                        return (
                            // item.isCancelled == true?<td hidden></td>:
                          <td>
                            {item.RoomORShop}
                            {/* {item.payment == true?<div></div>:<div><b>₹</b>{49}</div>} */}
                          </td>
                        );
                      },
                      uid: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.uid.slice(0, 7)}</td>
                        )
                       },
                       type: (item) => {
                        return(
                         // item.isCancelled == true?<td hidden></td>:
                         <td>{item.type}</td>
                        )
                       },
                      action: (item, index) => {
                        return (
                            item.isCancelled == true?<td hidden></td>: 
                          <td>
                              {
                                item.status == "Success"?
                                <CButton style={{ color: "#fff",backgroundColor: "#2121a5",borderColor: "#2121a5", borderRadius:"0.25rem", marginRight:"5px", width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => exportPDF(item)}>Download</CButton>
                                :<div hidden></div>
                                
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

export default PaymentReport;
