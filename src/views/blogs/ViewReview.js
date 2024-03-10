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
  CCardText,
  CCardImg,
  CCardTitle,
  CCol,
  CDataTable,
  CRow,
  CSpinner,
  CInput
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import jsPDF from "jspdf";
import "jspdf-autotable";


const ViewReview = (props) => {

    // console.log(props.location.state);
  const history = useHistory();
  var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
//   const [lastOrder, setLastOrder] = useState("");
  // const [details, setDetails] = useState([]);
  const socData = Date.now() - (7*(24 * 60 * 60 * 1000));
  const curData = Date.now();
  var[order, setOrder] = useState(socData);
  var[porder, setPorder] = useState(curData);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("vendor").doc(props.location.state.id).collection("Reviews").get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        name: videoData.cliName,
        imageUrl:videoData.cliProfile,
        rating:videoData.starRate,
        cliId:videoData.cliId,
        // refCode:videoData.refCode,
        // isActive:videoData.isApproved,
        // country: videoData.country,
        // soc: videoData.societyName,
        // email: videoData.email,
        // username: videoData.username,
      };
    });

    setState({
      ...state,
      videos: resolvedVideos,
    });
    setLoading(false);
    // console.log(videos);
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
        // cname: videoData.customerName,
        // cemail: videoData.customerEmail,
        // cphno: videoData.customerNumber,
        // ddatePlaced: new Intl.DateTimeFormat("en-US", {
        //     year: "numeric",
        //     month: "2-digit",
        //     day: "2-digit",
        //     }).format(videoData.datePlaced),
        // datePlaced: videoData.datePlaced,
        // ddatePicked: new Intl.DateTimeFormat("en-US", {
        //         year: "numeric",
        //         month: "2-digit",
        //         day: "2-digit",
        //     }).format(videoData.datePicked),
        // datePicked: videoData.datePicked,
        // ddateDelivered: new Intl.DateTimeFormat("en-US", {
        //         year: "numeric",
        //         month: "2-digit",
        //         day: "2-digit",
        //     }).format(videoData.dateDelivered),
        // dateDelivered: videoData.dateDelivered,

        // fno: videoData.flatNo,
        // wing: videoData.wing,
        // socName: videoData.societyName,
        // userType:videoData.userType,

        // status: videoData.orderStatus,
        // amount: videoData.totalAmount,
        // unpaidAmount: videoData.unpaidAmount,                
        // // payment: videoData.payment,      
        // // packedBy: videoData.packedBy,
        // method: videoData.payment.map((sub) => {
        //   return sub.method;
        // id: id,
        time:item.time,
        date:item.date
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

    const title = "Customer Report";
    // const cName = props.location.state.customerName
    const headers = [
      ["Date","Breathe Time"],
    ];

    const data =e.map((elt) => 
    // elt.societyName == status?
    [
      // ["Name"+props.location.state.name + "\n"+"Age" + props.location.state.age + "\n"+"Country" + props.location.state.country],
      elt.date,
      elt.time,
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

    doc.text(title, marginLeft, 20);
    doc.text("Name : "+props.location.state.name + "\t"+"Age : " + props.location.state.age + "\t"+"Country : " + props.location.state.country, marginLeft, 40);
    doc.autoTable(content);
    doc.save(props.location.state.name+" customerreport.pdf");
  };
  const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-to").value).setHours(23,59,59,999);
    order=new Date(document.getElementById("date-from").value).setHours(0,0,0,0);
    getVideos();
  };

  return (
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
                        Name: {props.location.state.name}
                    </CCardText>
                    {props.location.state.mobile==""?<CCardText></CCardText>:<CCardText>
                        Phone No.: {props.location.state.phno}
                    </CCardText>}
                    {/* <CCardText>
                        <small className="text-medium-emphasis">Last updated 3 mins ago</small>
                    </CCardText> */}
                </CCardBody>
                </CCol>
            </CRow>
        </CCard> 
      {/* <CCol xl={1} /> */}
      <CCol lg={12}>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>
        <CRow>
                <CCol sm="4">
                    <div className="font-xl">Vendor Reviews</div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    {/* <div style={{width:"160px",marginLeft:"5px"}}>
                        From:
                        <span><CInput type="date" id="date-from" name="date-input" placeholder="date"/></span>
                    </div> */}
                </CCol>
                <CCol sm="2">
                    {/* <div style={{width:"160px",marginLeft:"5px"}}>
                        To:
                        <span><CInput type="date" id="date-to" name="date-input" placeholder="date" onChange={() => onChangeDate()}/></span>   
                    </div> */}
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    {/* <div>
                        <CButton color="info" className="mr-3"
                        onClick={() => onExportData()}
                        style={{ float:"right"}}
                        >
                            Export Data
                        </CButton>
                    </div> */}
                </CCol>
            </CRow>
        </CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "name", label: "Client Name",filter: true },
                { key: "cliId", label: "Client Id", filter: true },
                { key: "imageUrl", label:"Image",filter:true},
                { key: "rating", label: "Rating", filter: true },
                // { key: "status" },
                // { key: "show_delete", label: "Order History" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                name: (item) => (
                  <td>
                    {item.name}
                  </td>
                ),
                cliId: (item) => (
                  <td>
                    {item.cliId}
                  </td>
                ),
                imageUrl: (item) => (
                    <td>
                      <CImg
                      rounded="true"
                      src={item.imageUrl}
                      width={100}
                      height={100}
                    />
                    </td>
                  ),
                  rating: (item) => (
                    <td>
                        
                      {item.rating}
                    </td>
                  ),
                // payment: (item) => (
                //     <td>
                //       {item.payment.map(sub=>{
                //             return(<div>{sub.method}</div>)
                //         })                      
                //       }
                //     </td>
                //   ),
                // link: (item) => (
                //   <td>
                //     {item.username}
                //   </td>
                // ),
                // show_delete: (item,index) => {
                //   return (
                //     <td>
                //       {/* <CButton
                //         size="sm"
                //         color="danger"
                //         className="ml-1"
                //         onClick={() => deleteVideo(item.id)}
                //       >
                //         Delete
                //       </CButton> */}
                //     </td>
                //   );
                // },
                //   details: (item) => {
                //     console.log(item);
                //     return (
                //       <CCollapse visible="true">
                //         <CCardBody>
                //           <h4>Description</h4>
                //           <p className="text-muted">{item.descriptioin}</p>
                //           <CButton size="sm" color="info">
                //             User Settings
                //           </CButton>
                //           <CButton size="sm" color="danger" className="ml-1">
                //             Delete
                //           </CButton>
                //         </CCardBody>
                //       </CCollapse>
                //     );
                //   },
              }}
              hover
              striped
              columnFilter
              pagination
              // tableFilter
              sorter
              // itemsPerPageSelect
              itemsPerPage={50}
              clickableRows
              //   onRowClick={(item) => history.push(`/users/${item.id}`)}
            />
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
                // <CButton
                //   color="primary"
                //   disabled={pageLoading || loading}
                //   // variant="ghost"
                //   shape="square"
                //   size="sm"
                //   onClick={loadMoreOrders}
                // >
                //   Load More
                // </CButton>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default ViewReview;
