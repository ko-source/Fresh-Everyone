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
import ImageCrop from './ImageCrop'

window.vname = 0;
  [window.setVideo] = [];
  export function image64ead (image64) {
    // console.log(image64);
      window.setVideo=image64;
      window.vname=1;
  }

const EditAdvertisement = (props) => {
  const db = firebase.firestore();

  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [subcat, setPrice] = useState([]);

  const initialFormData = {
    name: props.location.state.name,
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
    if (window.vname == 0) {
        try {
            await firebase.firestore().collection("generalData").doc("banners").collection("advertisement").doc(props.location.state.id).update({
              name:formData.values.name,
              imageUrl: props.location.state.imageUrl,
              isActive:true
            });
          }catch (error) {
          }
          alert("Advertisement Updated")
          setSubmitLoading(false);
          history.push("/banner/advertisement");
    } else {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child("bannerImages/" + Date.now()).put(window.setVideo);
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
              await firebase.firestore().collection("generalData").doc("banners").collection("advertisement").doc(props.location.state.id).update({
                name:formData.values.name,
                imageUrl: url,
                isActive:true
              });
            }catch (error) {
            }
            alert("Advertisement Updated")
            setSubmitLoading(false);
            history.push("/banner/advertisement");
          });
        }
      );
    }
  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Edit Advertisement</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2">
                  <CLabel>Advertisement Name</CLabel>
                </CCol>
            <CCol sm={4}>
            <CInput
              type="text"
              placeholder="Enter Advertisement Name"
              name="name"
              value={formData.values.name}
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
              <ImageCrop/>
            </CCol>
              </CRow>
          </CFormGroup>
          <CFormGroup>
              <CRow className="g-3 align-items-center">
                <CCol md="6">
                  <CLabel> </CLabel>
                </CCol>
                <CCol sm={3}>
                  { (video===null)?
                    <CImg
                        rounded="true"
                        src={props.location.state.imageUrl}
                        width={200}
                        height={100}
                    />:<div></div>
                  }
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

export default EditAdvertisement;
