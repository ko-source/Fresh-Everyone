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

const EmpHist = (props) => {

    // console.log(props.location.id);
  const history = useHistory();
  var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
//   const [lastOrder, setLastOrder] = useState("");
  // const [details, setDetails] = useState([]);
  const socData = Date.now() - (7*(24 * 60 * 60 * 1000));
  const curData = Date.now();
  var[order, setOrder] = useState();
  var[porder, setPorder] = useState(curData);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
    getVid();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("EmpCode").get();
    // console.log(videos.docs.length);

    const resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        name:videoData.employeeName,
        aadharNumber:videoData.aadharNumber,
        address:videoData.employeeAddress,
        code:videoData.empCode,
        email:videoData.employeeEmail,
        mobileNo:videoData.employeeMobileNo,
        imageUrl:videoData.imageUrl
      };
    });

    // console.log(resolvedVideos);

    setState({
      ...state,
      videos: resolvedVideos,
    });
    setLoading(false);
  };
  const getVid = async () => {
    setLoading(true);
    const response= await firebase.firestore().collection("vendor").where("refCode","==",props.location.id).get();
    setOrder(response.docs.length)
    // console.log(cat);
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
                    <CCardTitle>Employee Profile</CCardTitle>
                    {/* <CCardText>
                        Name: {props.location.state.name}
                    </CCardText>
                    {props.location.state.mobile==""?<CCardText></CCardText>:<CCardText>
                        Phone No.: {props.location.state.phno}
                    </CCardText>} */}
                    <CCardText>
                        Total No Of Referrals: {order}
                    </CCardText>
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
                    <div className="font-xl">Employee Details</div>
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
                // { key: "srno", label: "Sr. No.", filter: true },
                { key: "name", label: "Employee Name", filter: true },
                { key: "mobileNo", label: "Employee Mobile", filter: true },
                { key: "email", label: "Employee Email Id", filter: true },
                { key: "image", label:"Employee Image" },                
                { key: "aadharNumber", label: "Employee Aadhar Number", filter: true },                
                { key: "address", label: "Employee Address", filter: true },
                { key: "code", label: "Employee Code",filter: true },
                // { key: "show_delete", label: "Action" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    item.empCode == props.location.id?<td hidden></td>:
                    <td>
                        {index+1}
                    </td>
                  );
                },
                name: (item) => (
                    item.empCode == props.location.id?
                  <td>
                    {item.name}
                  </td>
                  :<td hidden></td>
                ),
                aadharNumber: (item) => (
                    item.empCode == props.location.id?
                  <td>
                    {item.aadharNumber}
                  </td>
                  :<td hidden></td>
                ),
                mobileNo: (item) => (
                    item.empCode == props.location.id?
                  <td>
                    {item.mobileNo}
                  </td>
                  :<td hidden></td>
                ),
                email: (item) => (
                    item.empCode == props.location.id?
                  <td>
                    {item.email}
                  </td>
                  :<td hidden></td>
                ),
                image: (item) => (
                    item.empCode == props.location.id?
                  <td>
                    <CImg
                      rounded="true"
                      src={item.imageUrl}
                      width={100}
                      height={100}
                    />
                  </td>
                  :<td hidden></td>
                ),
                address: (item) => (
                    item.empCode == props.location.id?
                  <td>
                    {item.address}
                  </td>
                  :<td hidden></td>
                ),
                code: (item) => (
                    item.empCode == props.location.id?
                  <td>
                    {item.code}
                  </td>
                  :<td hidden></td>
                ),
              }}
              hover
              striped
              columnFilter
              pagination
              // tableFilter
              sorter
              itemsPerPage={30}
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

export default EmpHist;
