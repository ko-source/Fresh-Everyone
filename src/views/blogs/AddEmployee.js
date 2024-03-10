import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CInput,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
  CProgress,
  CProgressBar,
  CCol,
  CRow,
  CInputFile,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";

const AddEmployee = () => {
  const db = firebase.firestore();


  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [image ,setImage]= useState([]);
  const [subcat, setPrice] = useState([]);

  const initialFormData = {
    fName:"",
    lName:"",
    dob:"",
    email:"",
    userName:"",
    mobileNo:"",
    password:"",
    address:""

  };
  const [type, setType] = useState("Select Role");
  const formData = useFormik({
    initialValues: initialFormData,
  });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true)
    // console.log();
    if (image.length === 0) {
      alert("All fields are required!");
      setSubmitLoading(false);
      return;
    }else {
            var storage = firebase.storage();
            var storageRef = storage.ref();
            var uploadTask = storageRef.child("empployeeImage/" + Date.now()).put(image);
            uploadTask.on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              (snapshot) => {
                // console.log(snapshot);
                var progress =
                  Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // setProgress(progress);
              },
              (error) => {
                // console.log(error);
                alert(error);
              },
              () => {
                uploadTask.snapshot.ref.getDownloadURL().then(async (url) => {   
                  try {
                    await firebase.firestore().collection("EmpCode").add({
                        employeeName:formData.values.fName+" "+formData.values.lName,
                        // lName:,
                        aadharNumber:formData.values.dob.toString(),
                        employeeEmail:formData.values.email,
                        empCode:formData.values.userName,
                        employeeMobileNo:formData.values.mobileNo.toString(),
                        imageUrl:url,
                        employeeAddress:formData.values.address
                    });
                    alert("Employee Added");
                  }catch (error) {
                  }
                  history.push("/blogs");
                  setImage([]);
                  setSubmitLoading(false);
                });
              }
            );
    } 
    setSubmitLoading(false)

  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Add Employee</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}  style={{alignItems: 'center'}}> 
        <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>First Name</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter First Name"
                      name="fName"
                      value={formData.values.fName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                  <CCol md="2">
                    <CLabel>Last Name</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter Last Name"
                      name="lName"
                      value={formData.values.lName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                </CRow>
            </CFormGroup>
            <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Aadhar Number</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="number"
                      placeholder="Enter Aadhar Number"
                      name="dob"
                      value={formData.values.dob}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                  <CCol md="2">
                    <CLabel>Mobile Number</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="number"
                      placeholder="Enter Mobile Number"
                      name="mobileNo"
                      value={formData.values.mobileNo}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                </CRow>
              </CFormGroup>
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Email Id</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="email"
                      placeholder="Enter Email Id"
                      name="email"
                      value={formData.values.email}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                  <CCol md="2">
                    <CLabel>Address</CLabel>
                  </CCol>
                  <CCol sm={4}>
                      <CInput
                          type="text"
                          placeholder="Enter Address"
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
                    </CCol>
                </CRow>
              </CFormGroup>
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Employee Code</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter Employee Code"
                      name="userName"
                      value={formData.values.userName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                  </CCol>
                  <CCol md="2">
                    <CLabel>Profile Picture</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInputFile
                        type="file"
                        aria-label="Upload"
                        onChange={(e) =>
                          setImage(e.target.files[0])}
                      />
                  </CCol>
                </CRow>
              </CFormGroup>
          {showProgress && (
            <CProgress className="mb-3">
              <CProgressBar value={progress}>{progress}%</CProgressBar>
            </CProgress>
          )}

          <CFormGroup>
          <CCol md={12}style={{ display: "flex" }}>
            {submitLoading ? (
              <CSpinner size="small" color="info" />
            ) : (
              <CButton type="submit" style={{color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c",marginLeft: "auto",marginRight:"auto",marginTop:"10px"}} disabled={submitLoading}>
                      Submit
                    </CButton>
            )}
            </CCol>
          </CFormGroup>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default AddEmployee;
