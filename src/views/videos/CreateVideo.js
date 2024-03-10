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
  CTextarea,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {base64StringtoFile,
  downloadBase64File,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef} from '../../views/services/ReusableUtils'
  import '../../views/services/custom-image-crop.css';
  import ImageCrop from './ImageCrop'

  window.vname = 0;
  [window.setVideo] = [];
  export function image64av (image64) {
    // console.log(image64);
      window.setVideo=image64;
      window.vname=1;
  }

const CreateVideo = () => {
  const db = firebase.firestore();

  const imagePreviewCanvasRef = React.createRef();
  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState([]);
  const [result, setResult] = useState([]);
  const [urls, setUrls] = useState([]);
  const [photoURL, setPhotoURL] = useState("");
  const [image ,setImage]= useState({
    imgSrc: null,
    imgSrcExt: null,
  })
  var [state, setState] = useState({
    verified_service_providers: null,
    unverified_service_providers: null,
    crop: {
      // aspect: 1/1
    }
  });

  const [subcat, setPrice] = useState([]);

  const initialFormData = {
    cname: "",
    answer:"",
    priority:""
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });

  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setVideo((prevState) => [...prevState, newImage]);
      // console.log(newImage);
      setPhotoURL(URL.createObjectURL(newImage));
      console.log(photoURL);
      // const currentFile = files[0]
      const myFileItemReader = new FileReader()
      myFileItemReader.addEventListener("load", ()=>{
          // console.log(myFileItemReader.result)
          const myResult = myFileItemReader.result
          setImage({
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult)
          })
      }, false)

      myFileItemReader.readAsDataURL(newImage)
    }      
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await firebase.firestore().collection("enquiryQuestions").add({
        ques:formData.values.cname,
        ans:formData.values.answer,
        // imageUrl:url
      });
    }catch (error) {
    }
    history.push("/videos");
    setSubmitLoading(false)
    // if (window.vname == 0) {
    //   alert("All fields are required!");
    //   setSubmitLoading(false);
    //   return;
    // }else {
    //   var storage = firebase.storage();
    //   var storageRef = storage.ref();
    //   var uploadTask = storageRef.child("categoriesImages/" + Date.now()).put(window.setVideo);
    //   uploadTask.on(
    //     firebase.storage.TaskEvent.STATE_CHANGED,
    //     (snapshot) => {
    //       console.log(snapshot);
    //       var progress =
    //         Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       // setProgress(progress);
    //     },
    //     (error) => {
    //       console.log(error);
    //       alert(error);
    //     },
    //     () => {
    //       uploadTask.snapshot.ref.getDownloadURL().then(async (url) => {
            
    //       });
    //     }
    //   );
    // }
  };
  
  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Add Questions</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2" style={{textAlign: "end"}}>
                  <CLabel>Question</CLabel>
                </CCol>
            <CCol sm={4}>
              <CInput
                type="text"
                placeholder="Enter Question"
                name="cname"
                value={formData.values.cname}
                onChange={(e) => {
                  formData.handleChange(e);
                }}
            />
            </CCol>
          </CRow>
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2" style={{textAlign: "end"}}>
                  <CLabel>Answer</CLabel>
                </CCol>
            <CCol sm={4}>
              <CTextarea
                type="text"
                placeholder="Enter Answer"
                name="answer"
                value={formData.values.answer}
                onChange={(e) => {
                  formData.handleChange(e);
                }}
            />
            </CCol>
          </CRow>
          </CFormGroup>
          {/* <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2" style={{textAlign: "end"}}>
                  <CLabel>Priority No.</CLabel>
                </CCol>
            <CCol sm={4}>
              <CInput
                type="text"
                placeholder="Enter Category Priority no."
                name="priority"
                value={formData.values.priority}
                onChange={(e) => {
                  formData.handleChange(e);
                }}
            />
            </CCol>
          </CRow>
          </CFormGroup> */}
          {/* <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2" style={{textAlign: "end"}}>
                  <CLabel>Upload Image </CLabel>
                </CCol>
            <CCol sm={4}>
                <ImageCrop/>
            </CCol>
              </CRow>
          </CFormGroup> */}
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

export default CreateVideo;
