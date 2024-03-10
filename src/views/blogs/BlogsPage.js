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
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BlogsPage = () => {
  const history = useHistory();
  var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("EmpCode").get();

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
  const deleteVideo = (rowId) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("EmpCode").doc(rowId).delete();
            setRefresh(!refresh);
                alert("Employee Deleted");
          },
        },
        {
          label: "No",
          // onClick: () => alert("Close"),
        },
      ],
      // childrenElement: () => <div />,
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
  const edit = (rowId,index) => {
    history.push(
      {
      pathname: '/blogs/edit-employee',
      state: rowId,
      index: index
      }
    )
  };
  const onExportData = async () => {
    const filteredData = state.videos
      .filter((order) => {
        // return Object.keys(tableFilters).reduce((p, c) => {
        //   return String(order[c]).includes(tableFilters[c]) && p
        // }, true)
        for (const filterKey in tableFilters) {
          console.log(
            String(order[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(order[filterKey]).search(
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
      .map((order) => ({
        // order.category,
        id:order.id,
        name:order.employeeName,
        aadharNumber:order.aadharNumber,
        address:order.employeeAddress,
        code:order.empCode,
        email:order.employeeEmail,
        mobileNo:order.employeeMobileNo,
      }));
      // console.log(filteredData);
      exportPDF(filteredData);
    // exportDataToXLSX(filteredData, "ProductList");
  };
  const exportPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Employee List";
    const headers = [["Employee Id","Employee Name","Employee Email","Employee Mobile Number","Employee Address","Employee Code","Employee Aadhar Number"]];

    const data = e.map((sub,index) =>[
      // [elt.name + "\n" + elt.number],
      sub.id,
      sub.name,
      sub.email,
      sub.mobileNo,
      sub.address,
      sub.code,
      sub. aadharNumber,
      // sub.org,
      // sub.city,
      // sub.add

  ]);
    // props.location.state.items.map(elt=>
    // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
    // const footer = [["Total Amount: Rs."+props.location.state.amount]]
    // let text = weight[index]
    //     const myArray = text.split(" ");
    //     var temp=sQuantity[index]*myArray[0]


    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    // console.log(content);
    // console.log(data);
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("employeetlist.pdf")
  }
  return (
    <CRow>
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
          <span className="font-xl">Employee List</span>
            <span>
              <CButton color="info" className="mb-2 mr-2" onClick={onExportData} style={{ float:"right"}}>
                Export Data
              </CButton>
            </span>
        </CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "name", label: "Employee Name", filter: true },
                { key: "mobileNo", label: "Employee Mobile", filter: true },
                { key: "email", label: "Employee Email-Id", filter: true },
                { key: "image", label:"Employee Image" },                
                { key: "aadharNumber", label: "Employee Aadhar Number", filter: true },                
                { key: "address", label: "Employee Address", filter: true },
                { key: "code", label: "Employee Code",filter: true },
                { key: "show_delete", label: "Action" },
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
                aadharNumber: (item) => (
                  <td>
                    {item.aadharNumber}
                  </td>
                ),
                mobileNo: (item) => (
                  <td>
                    {item.mobileNo}
                  </td>
                ),
                email: (item) => (
                  <td>
                    {item.email}
                  </td>
                ),
                image: (item) => (
                  <td>
                    <CImg
                      rounded="true"
                      src={item.imageUrl}
                      width={100}
                      height={100}
                    />
                  </td>
                ),
                address: (item) => (
                  <td>
                    {item.address}
                  </td>
                ),
                code: (item) => (
                  <td>
                    {item.code}
                  </td>
                ),
                show_delete: (item,index) => {
                  return (
                    <td>
                      <CInputGroup style={{flexWrap: "nowrap"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => edit(item,index)}>Edit</CButton>
                              <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)} >Delete</CButton>
                      </CInputGroup>  
                    </td>
                  );
                },
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default BlogsPage;
