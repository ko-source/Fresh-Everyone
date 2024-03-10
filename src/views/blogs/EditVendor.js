import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  CBadge,
  CImg,
  CInputGroup,
  CForm,
  CLabel,
  CInput,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CSpinner,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useFormik } from "formik";

const EditVendor = (props) => {
    console.log(props.location.state);
    console.log(props.location.id);

  const history = useHistory();
  var [cat, setCat] = useState([]);
  var [gdata, setData] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState("");
  // const [details, setDetails] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });
  const [status, setStatus] = useState(props.location.state.businessCat);
  const updatedStatus = async (s) => {
    setStatus(s);
  };
  const [sub, setSub] = useState(props.location.state.businessSubCat);

//                 { key: "businessCat", label: "Category", filter: true },
//                 { key: "businessSubCat", label: "Sub Category", filter: true },
  const initialFormData = {
    name: props.location.state.name,
    aadharCardNumber:props.location.state.aadharCardNumber,
    businessAddress:props.location.state.businessAddress,
    businessCity:props.location.state.businessCity,
    businessMobileNumber:props.location.state.businessMobileNumber,
    businessName:props.location.state.businessName,
    businessPinCode:props.location.state.businessPinCode,
    bussinesDesc:props.location.state.bussinesDesc,
    closeTime:props.location.state.closeTime,
    openTime:props.location.state.openTime,
    refCode:props.location.state.refCode,
    workingDay:props.location.state.workingDay

  };
  const formData = useFormik({
    initialValues: initialFormData,
  });

  useEffect(() => {
    getVideos();
    // getData();
  }, []);

  const getVideos = async () => {
    // setLoading(true);
    const videos = await firebase.firestore().collection("Services").get();

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        subcat:videoData.subcategory,
      }
    });
    setState({
      ...state,
      videos: resolvedVideos,
    });
    setCat(resolvedVideos);
    // setLoading(false);
  };

  const getData = async () => {
    const response = await firebase.firestore().collection("centers");
    const data = await response.get();
    data.docs.forEach((item) => {
      cat.push({ docId: item.id, ...item.data() });
    });
    setCat([...cat, cat]);
    // console.log(cat);
    // const response=await firebase.firestore().collection("centers");
    // const data=await response.get();
    // data.docs.forEach(item=>{
    //   gdata.push({id:item.id,...item.data()});
    // })
    // setData([...gdata,gdata])
  };
  const updatedSub = async (s) => {
    setSub(s);
  };
  const deleteVideo = () => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("vendor").doc(props.location.id).delete();
                alert("Vendor Deleted");
                history.goBack();
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
      // overlayClassName: "overlay-custom-class-name"
    });

  };
  const edit = async (e) => {
    e.preventDefault();
    await firebase.firestore().collection("vendor").doc(props.location.id).update({

    name:formData.values.name ,
    aadharCardNumber:formData.values.aadharCardNumber,
    businessAddress:formData.values.businessAddress,
    businessCity:formData.values. businessCity,
    businessMobileNumber:formData.values.businessMobileNumber,
    businessName:formData.values.businessName,
    businessPinCode:formData.values.businessPinCode,
    bussinesDesc:formData.values.bussinesDesc,
    closeTime:formData.values.closeTime,
    openTime:formData.values.openTime,
    refCode:formData.values.refCode,
    workingDay:formData.values.workingDay,
    businessCat:status,
    businessSubCat:sub
    });
    alert("Vendor Data Updated!")
    history.push("/blogs/vendor-Orderhistory");
  };

  // const toggleDetails = (index) => {
  //   const position = details.indexOf(index);
  //   let newDetails = details.slice();
  //   if (position !== -1) {
  //     newDetails.splice(position, 1);
  //   } else {
  //     newDetails = [...details, index];
  //   }
  //   setDetails(newDetails);
  // };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
            <span className="font-xl">Vendor Details</span>
                <span>
                <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",float:"right"}} type="button" color="secondary" variant="outline" onClick={()=>deleteVideo()} >Remove User</CButton>
                {/* <CButton
                    color="primary"
                    // onClick={() => history.push("/users/create-user")}
                >
                    Create User
                </CButton> */}
                </span>
        </CCardHeader>
          <CCardBody>
          <CForm className="row g-3">
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Name</CLabel>
                        <CInput
                            required 
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={formData.values.name}
                            onChange={(e) => {
                                formData.handleChange(e);
                                // setFormData({
                                //   ...formData.values,
                                //   name: e.target.value
                                // })
                            }}
                        />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputPassword4">Aadhar Card Number</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="aadharCardNumber"
                      name="aadharCardNumber"
                      value={formData.values.aadharCardNumber}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Business Name</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="businessName"
                      name="businessName"
                      value={formData.values.businessName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputPassword4">Business Mobile Number</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="businessMobileNumber"
                      name="businessMobileNumber"
                      value={formData.values.businessMobileNumber}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Business City</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="businessCity"
                      name="businessCity"
                      value={formData.values.businessCity}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Business Address</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="businessAddress"
                      name="businessAddress"
                      value={formData.values.businessAddress}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Business Description</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="bussinesDesc"
                      name="bussinesDesc"
                      value={formData.values.bussinesDesc}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Business Pincode</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="businessPinCode"
                      name="businessPinCode"
                      value={formData.values.businessPinCode}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Vendor Category</CLabel>
                    <CDropdown variant="input-group">
                            <CDropdownToggle 
                            style={{
                            color:"#333",
                            border: "1px solid #d8dbe0",
                            borderRadius: "0.25rem",
                            width: "100%",
                            textAlign: "left"
                            }} color="secondary" variant="outline">
                                {status}
                                </CDropdownToggle>
                            <CDropdownMenu style={{ width: "100%",}}>
                            <CDropdownItem header>Select Service</CDropdownItem>
                            <CDropdownDivider/>
                            {cat &&
                                cat.map((cat, index) => {
                                  return (
                                    <CDropdownItem
                                    required
                                      onClick={() => updatedStatus(cat.id)}
                                    >
                                      {cat.id}
                                    </CDropdownItem>
                                  );
                                })}
                            </CDropdownMenu>
                        </CDropdown> 
                    {/* <CInput
                      required 
                      type="text"
                      placeholder="Society Name"
                      name="societyName"
                      value={formData.values.societyName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    /> */}
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputPassword4">Vendor Subcategory</CLabel>
                        <CDropdown className="mt-2">
                        <CDropdownToggle
                            style={{
                            border: "1px solid #d8dbe0",
                            borderRadius: "0.25rem",
                            width: "100%",
                            textAlign: "left"
                            }}
                            caret
                            varient={"outline"}
                        >
                            {sub}
                        </CDropdownToggle>
                        <CDropdownMenu style={{ width: "100%",}}>
                            <CDropdownItem header>Select category</CDropdownItem>
                            <CDropdownItem divider />
                            {cat
                            .filter((x) => x.id === status)
                            .map((sub) => {
                                return sub.subcategory.map((sub1) => {
                                return (
                                    <CDropdownItem onClick={() => updatedSub(sub1.title)}>
                                    {sub1.title}
                                    </CDropdownItem>
                                );
                                });
                            })}
                        </CDropdownMenu>
                        </CDropdown>
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Referral Code</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="refCode"
                      name="refCode"
                      value={formData.values.refCode}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputZip">working Day</CLabel>
                    <CInput id="inputZip"
                        placeholder="workingDay"
                      name="workingDay"
                      value={formData.values.workingDay}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}/>
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Open Time</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="openTime"
                      name="openTime"
                      value={formData.values.openTime}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Close Time</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="closeTime"
                      name="closeTime"
                      value={formData.values.closeTime}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>

                {/* <CCol xs={12}>
                    <CLabel htmlFor="inputAddress">Address</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="Address"
                      name="address"
                      value={formData.values.address}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol> */}
                {/* <CCol xs={12}>
                    <CFormCheck type="checkbox" id="gridCheck" label="Check me out"/>
                </CCol> */}
                <CCol xs={12}  style={{ display: "flex" }}>
                    <CButton
                      type="submit"
                      style={{
                        color: "#fff",
                        backgroundColor: "#f8b11c",
                        borderColor: "#f8b11c",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "10px",
                      }}
                      onClick={edit}
                    //   disabled={submitLoading}
                    >
                      Update
                    </CButton>
                </CCol>
                </CForm>
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
                <p hidden></p>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default EditVendor;
