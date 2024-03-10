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

const Vhistory = (props) => {

  const history = useHistory();
  var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
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
    const response= await firebase.firestore().collection("vendor").doc(props.location.state.id).get();
    
    setCat([response.data()])
    setLoading(false);
  };

  const generatePDF = (ticket) => {
    const doc = new jsPDF();
    
    ticket.map((sub)=>{
        const tableColumn = [{ dataKey: "A" }, { dataKey: "B" }];

        const tableData = [
          { A: "Vendor Name", B: sub.name },
          { A: "Aadhar Card Number", B: sub.aadharCardNumber },
          { A: "Business Name", B: sub.businessName },
          { A: "Business Mobile Number", B: sub.businessMobileNumber},
          { A: "Business Category", B: sub.businessCat },
          { A: "Business Sub Category", B: sub.businessSubCat },
          { A: "Business Address", B:sub.businessAddress },
          { A: "Business City", B: sub.businessCity },
          { A: "Business Pincode", B: sub.businessPinCode },
          { A: "Referral Code", B: sub.refCode },
          { A: "Working Days", B: sub.workingDay },
        ];
        doc.autoTable(tableColumn, tableData, { startY: 30 });
        doc.text("Vendor Details", 14, 15);
        doc.save(sub.name+`_vendor_details.pdf`);
    })

  };
  
  const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-to").value).setHours(23,59,59,999);
    order=new Date(document.getElementById("date-from").value).setHours(0,0,0,0);
    getVideos();
  };
  const edit = (rowId,index) => {
    history.push(
      {
      pathname: '/blogs/vendor-edit',
      state: rowId,
      id: index
      }
    )
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
                    <div className="font-xl">Vendor Details</div>
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
                    <div>
                        <CButton color="info" className="mr-3"
                        onClick={() => generatePDF(cat)}
                        style={{ float:"right"}}
                        >
                            Export Data
                        </CButton>
                    </div>
                </CCol>
            </CRow>
        </CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={cat}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "name", label: "User Details",filter: true },
                { key: "aadharCardNumber", label: "Aadhar Card Number", filter: true },
                { key: "businessName", label:"Business Name",filter:true},
                { key: "businessCat", label: "Category", filter: true },
                { key: "businessSubCat", label: "Sub Category", filter: true },
                { key: "businessAddress", label: "Business Address", filter: true },
                { key: "businessCity", label: "Business City", filter: true },                
                { key: "workingDay", label: "Working Days",filter: true },
                // { key: "status" },
                { key: "show_delete", label: "Actions" },
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
                businessName: (item) => (
                  <td>
                    {item.businessName}
                  </td>
                ),
                businessCat: (item) => (
                    <td>
                      {item.businessCat}
                    </td>
                  ),
                  businessSubCat: (item) => (
                    <td>
                      {item.businessSubCat}
                    </td>
                  ),
                  businessAddress: (item) => (
                    <td>
                      {item.businessAddress}
                    </td>
                  ),
                  businessCity: (item) => (
                    <td>
                      {item.businessCity}
                    </td>
                  ),
                  workingDay: (item) => (
                    <td>
                      {item.workingDay}
                    </td>
                  ),
                  aadharCardNumber: (item) => (
                    <td>
                      {item.aadharCardNumber}
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
                show_delete: (item,index) => {
                  return (
                    <td>
                      <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => edit(item,props.location.state.id)}>Edit</CButton>
                    </td>
                  );
                },
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

export default Vhistory;
