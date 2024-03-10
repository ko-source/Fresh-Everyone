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
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";

const EditUnit = (props) => {
  const db = firebase.firestore();
//   console.log(props.location.state);
//   console.log(props.location.index);

  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [subcat, setPrice] = useState([]);

  const initialFormData = {
    name:props.location.state,
    index:props.location.index
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    // var getYouTubeID = require("get-youtube-id");
    // const { image, description, link } = video;
    // video.videoId = getYouTubeID(link);
    // const imageType = image?.type;
    try {
        await firebase.firestore().collection("generalData").doc("data").update({
                    units : firebase.firestore.FieldValue.arrayUnion(formData.values.name)
            
        });
        alert("Unit Updated");
      }catch (error) {
      }
      history.push("/videos/unit");
  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Update Unit</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}  style={{alignItems: 'center'}}> 
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Name </CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Units"
              name="name"
              value={formData.values.name}
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
                      Update
                    </CButton>
            )}
            </CCol>
          </CFormGroup>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default EditUnit;
