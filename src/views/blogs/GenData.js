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
  CSwitch
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const GenData = () => {
  const history = useHistory();

  var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  // const [details, setDetails] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const response= await firebase.firestore().collection("generalData").doc("data").get();
    
    setCat([response.data()])
    // console.log(cat.length);
    setLoading(false);
  };
  const toggle = async(rowId,colId) => {
   if(colId===true){
    await firebase.firestore().collection("generalData").doc("data").update({
      isActive:false,
    })
    getVideos();
   }else{
    await firebase.firestore().collection("generalData").doc("data").update({
      isActive:true,
    })
    getVideos();
   } 
  };
  const deleteVideo = (rowId) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("generalData").doc("data").collection("popup").doc(rowId).delete();
            alert("Popup Deleted");
            // getVideos();
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
  const edit = async(rowId) => {
    history.push(
      {
      pathname: '/gen-data/edit-gendata',
      state: rowId
      }
    )
  };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >General Data</CCardHeader>
          <CCardBody style={{textAlign:"center"}}>
            <CRow>
                <CDataTable style={{border:"5px solid black",textAlign: "center"}}
                loading={loading}
                // onTableFilterChange={(filter) => setTableFilters(filter)}
                items={cat}
                fields={[
                    { key: "srno", label: "Sr. No.", filter: true },
                    { key: "help", label: "Help",filter: true },
                    // { key: "phoneNumber", label: "Phone Number",filter: true },
                    // { key: "website", label: "Website",filter: true },
                    // { key: "image", label:"Popup Image" }, 
                    // { key: "page1image", label:"Page 1 Image" },
                    // { key: "page2image", label:"Page 2 Image" },
                    // { key: "isActive", label: "Is Active",filter: true },
                    // { key: "status" },
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
                    help: (item) => (
                    <td>
                        {item.help}
                    </td>
                ),
                    phoneNumber: (item) => (
                        <td>
                        {item.phoneNumber}
                        </td>
                    ),
                    website: (item) => (
                    <td>
                        {item.website}
                    </td>
                ),
                    isActive:(item)=>(
                        <td>
                            <CSwitch
                            shape= 'pill'
                            color="success"
                            size='lg'
                            checked={item.isActive}
                            onChange={async (e) => {
                                toggle(item.id,item.isActive)
                                // e.preventDefault();
                                // const docsRef = doc(db, "users", user.id);
                                // await updateDoc(docsRef, {
                                //   isVer: e.target.checked,
                                // });
                                // getUsers()
                            }}
                            /> 
                        </td>
                    ),
                    show_delete: (item) => {
                    return (
                        <td>
                        <CInputGroup style={{flexWrap: "nowrap"}}>
                                <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => edit(item)}>Edit</CButton>
                                {/* <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)} >Delete</CButton> */}
                            </CInputGroup>
                        </td>
                    );
                    },
                }}
                hover
                striped
                // columnFilter
                // pagination
                // tableFilter
                // sorter
                // itemsPerPageSelect
                // itemsPerPage={30}
                clickableRows
                //   onRowClick={(item) => history.push(`/users/${item.id}`)}
                />
            </CRow>
            <CRow>
                <CDataTable style={{border:"5px solid black",textAlign: "center"}}
                loading={loading}
                // onTableFilterChange={(filter) => setTableFilters(filter)}
                items={cat}
                fields={[
                    { key: "srno", label: "Sr. No.", filter: true },
                    { key: "termsAndCond", label: "Terms & Conditions ",filter: true },
                    // { key: "phoneNumber", label: "Phone Number",filter: true },
                    // { key: "website", label: "Website",filter: true },
                    // { key: "image", label:"Popup Image" }, 
                    // { key: "page1image", label:"Page 1 Image" },
                    // { key: "page2image", label:"Page 2 Image" },
                    // { key: "isActive", label: "Is Active",filter: true },
                    // { key: "status" },
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
                    termsAndCond: (item) => (
                    <td>
                        {item.termsAndCond}
                    </td>
                ),
                    phoneNumber: (item) => (
                        <td>
                        {item.phoneNumber}
                        </td>
                    ),
                    website: (item) => (
                    <td>
                        {item.website}
                    </td>
                ),
                    isActive:(item)=>(
                        <td>
                            <CSwitch
                            shape= 'pill'
                            color="success"
                            size='lg'
                            checked={item.isActive}
                            onChange={async (e) => {
                                toggle(item.id,item.isActive)
                                // e.preventDefault();
                                // const docsRef = doc(db, "users", user.id);
                                // await updateDoc(docsRef, {
                                //   isVer: e.target.checked,
                                // });
                                // getUsers()
                            }}
                            /> 
                        </td>
                    ),
                    show_delete: (item) => {
                    return (
                        <td>
                        <CInputGroup style={{flexWrap: "nowrap"}}>
                                <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => edit(item)}>Edit</CButton>
                                {/* <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)} >Delete</CButton> */}
                            </CInputGroup>
                        </td>
                    );
                    },
                }}
                hover
                striped
                // columnFilter
                // pagination
                // tableFilter
                // sorter
                // itemsPerPageSelect
                // itemsPerPage={30}
                clickableRows
                //   onRowClick={(item) => history.push(`/users/${item.id}`)}
                />
            </CRow>
            {/* <CRow>
                <CDataTable style={{border:"5px solid black",textAlign: "center"}}
                loading={loading}
                // onTableFilterChange={(filter) => setTableFilters(filter)}
                items={cat}
                fields={[
                    { key: "srno", label: "Sr. No.", filter: true },
                    { key: "userAgreement", label: "User Agreement",filter: true },
                    // { key: "phoneNumber", label: "Phone Number",filter: true },
                    // { key: "website", label: "Website",filter: true },
                    // { key: "image", label:"Popup Image" }, 
                    // { key: "page1image", label:"Page 1 Image" },
                    // { key: "page2image", label:"Page 2 Image" },
                    // { key: "isActive", label: "Is Active",filter: true },
                    // { key: "status" },
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
                    userAgreement: (item) => (
                    <td>
                        {item.userAgreement}
                    </td>
                ),
                    phoneNumber: (item) => (
                        <td>
                        {item.phoneNumber}
                        </td>
                    ),
                    website: (item) => (
                    <td>
                        {item.website}
                    </td>
                ),
                    isActive:(item)=>(
                        <td>
                            <CSwitch
                            shape= 'pill'
                            color="success"
                            size='lg'
                            checked={item.isActive}
                            onChange={async (e) => {
                                toggle(item.id,item.isActive)
                                // e.preventDefault();
                                // const docsRef = doc(db, "users", user.id);
                                // await updateDoc(docsRef, {
                                //   isVer: e.target.checked,
                                // });
                                // getUsers()
                            }}
                            /> 
                        </td>
                    ),
                    show_delete: (item) => {
                    return (
                        <td>
                        <CInputGroup style={{flexWrap: "nowrap"}}>
                                <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => edit(item)}>Edit</CButton>
                                <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)} >Delete</CButton>
                            </CInputGroup>
                        </td>
                    );
                    },
                }}
                hover
                striped
                // columnFilter
                // pagination
                // tableFilter
                // sorter
                // itemsPerPageSelect
                // itemsPerPage={30}
                clickableRows
                //   onRowClick={(item) => history.push(`/users/${item.id}`)}
                />
            </CRow> */}
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default GenData;
