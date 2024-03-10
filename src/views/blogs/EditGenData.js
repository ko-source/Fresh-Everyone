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
  CImg,
  CInputFile,
  CTextarea,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";
// import ImageCrop from './ImageCrop'
// import ImageCrop2 from './ImageCrop2'
// import ImageCrop3 from './ImageCrop3'

//   window.vname = 0;
//   window.pImage = 0;
//   [window.setVideo] = [];
//   export function image64ep (image64) {
//     // console.log(image64);
//       window.setVideo=image64;
//       window.pImage = 1;
//       window.vname=1;
//   }
//   window.vname = 0;
//   window.fImage = 0;
//   [window.setImage] = [];
//   export function image64fp (image64) {
//     // console.log(image64);
//       window.setImage=image64;
//       window.fImage = 1;
//       window.vname=1;
//   }
//   window.vname = 0;
//   window.sImage = 0;
//   [window.setPage] = [];
//   export function image64sp (image64) {
//     // console.log(image64);
//       window.setPage=image64;
//       window.sImage = 1;
//       window.vname=1;
//   }


const EditGenData = (props) => {
  const db = firebase.firestore();

  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [subcat, setPrice] = useState([]);

  const initialFormData = {
    help: props.location.state.help,
    // phoneNumber:props.location.state.phoneNumber,
    // website:props.location.state.website,
    termsAndCondition:props.location.state.termsAndCond,
    // userAgreement:props.location.state.userAgreement
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    // try {
        await firebase.firestore().collection("generalData").doc("data").update({
          help:formData.values.help,
        //   phoneNumber:formData.values.phoneNumber,
        //   website:formData.values.website,
        termsAndCond:formData.values.termsAndCondition,
        //   userAgreement:formData.values.userAgreement,
        });
    //   }catch (error) {
    //   }
      alert("Data Updated")
      setSubmitLoading(false);
      history.push("/gen-data");
  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Edit General Data</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
        {/* <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Email</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Email"
              name="email"
              value={formData.values.email}
              onChange={(e) => {
                formData.handleChange(e);
              }}
            />
            </CCol>
          </CRow>
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Phone Number</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Phone Number"
              name="phoneNumber"
              value={formData.values.phoneNumber}
              onChange={(e) => {
                formData.handleChange(e);
              }}
            />
            </CCol>
          </CRow>
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Website</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter website"
              name="website"
              value={formData.values.website}
              onChange={(e) => {
                formData.handleChange(e);
              }}
            />
            </CCol>
          </CRow>
          </CFormGroup> */}
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Help</CLabel>
                </CCol>
            <CCol sm={6}>
            <CTextarea
              type="text"
              style={{width:"100%",height:"400px"}}
              placeholder="Enter Help Instruction"
              name="help"
              value={formData.values.help}
              onChange={(e) => {
                formData.handleChange(e);
              }}
            />
            </CCol>
          </CRow>
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Terms & Conditions</CLabel>
                </CCol>
            <CCol sm={6}>
            <CTextarea
              type="text"
              style={{width:"100%",height:"400px"}}
              placeholder="Enter termsAndCondition"
              name="termsAndCondition"
              value={formData.values.termsAndCondition}
              onChange={(e) => {
                formData.handleChange(e);
              }}
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

export default EditGenData;
