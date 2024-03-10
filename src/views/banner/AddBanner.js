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
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";
import ImageCrop from './ImageCrop'

window.vname = 0;
  [window.setVideo] = [];
  export function image64f (image64) {
    // console.log(image64);
      window.setVideo=image64;
      window.vname=1;
  }

const AddBanner = () => {
  const db = firebase.firestore();

  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [image ,setImage]= useState([]);
  const [video, setVideo] = useState(null);
  const [subcat, setPrice] = useState([]);
  
  const initialFormData = {
    id:""
  };
  
  const formData = useFormik({
    initialValues: initialFormData,
  });

  console.log(formData.values.id)
   const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitLoading(true);
    // var getYouTubeID = require("get-youtube-id");
    // const { image, description, link } = video;
    // video.videoId = getYouTubeID(link);
    // const imageType = image?.type;
    if (image == 0) {
      alert("All fields are required!");
      setSubmitLoading(false);
      return;
    }else {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child("Banners/" + Date.now()).put(image);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          console.log(snapshot);
          var progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // setProgress(progress);
        },
        (error) => {
          console.log(error);
          alert(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async (url) => {
            try {
              await firebase.firestore().collection("BannerAds").add({
                // name:formData.values.name,
                id:formData.values.id,
                image: url,
                // isActive:true
              });
            }catch (error) {
            }
            alert("Banner Added")
            setSubmitLoading(false);
            history.push("/banner");
          });
        }
      );
    }
  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Add Banner</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          {/* <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Banner Name</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Banner Name"
              name="name"
              value={formData.values.name}
              onChange={(e) => {
                formData.handleChange(e);
              }}
            />
            </CCol>
          </CRow>
          </CFormGroup>*/}
          <CFormGroup>
          
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>ID</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Id"
              name="id"
              value={formData.values.id}
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
                  <CLabel>Upload Image </CLabel>
                </CCol>
            <CCol sm={4}>
              {/* <ImageCrop/> */}
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

export default AddBanner;
