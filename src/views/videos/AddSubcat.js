import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CInputGroup,
  CInputFile
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";

const AddSubcat = () => {
  const db = firebase.firestore();


  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState([]);
  const [cat, setCat] = useState([]);
  var [state, setState] = useState({
    videos: null,
  });

  const initialFormData = {
    name: "",
    subtitle: "",
    rank: "",
    cid: "",

  };

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    // setLoading(true);
    const videos = await firebase.firestore().collection("categories").get();

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        category: videoData.category,
      }
    });
    setState({
      ...state,
      videos: resolvedVideos,
    });
    console.log(resolvedVideos);
    setCat(resolvedVideos);
    // setLoading(false);
  };


  const [type, setType] = useState("Coupon Type");
  const formData = useFormik({
    initialValues: initialFormData,
  });
  const [status, setStatus] = useState("Select Service");
  const updatedType = async (s) => {
    setType(s);
  };
  const updatedStatus = async (s) => {
    setStatus(s);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true)
    const value = cat.map((sub) => sub.category.filter((sub1, index) => index == sub.category.length - 1).map((sub2) => sub2.catId));
    // console.log(value);
    const cid = value.length > 0 ? (value[0].length > 0 ? parseFloat(value[0][0]) + 1 : 1) : 1;
    // console.log();
    if (image.length === 0) {
      alert("All fields are required!");
      setSubmitLoading(false);
      return;
    } else {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child("offerImage/" + Date.now()).put(image);
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
              await firebase.firestore().collection("categories").doc().set({
                category: firebase.firestore.FieldValue.arrayUnion({
                  name: formData.values.name,
                  catId: cid.toString(),
                  isComingsoon: false,
                  imageUrl: url,
                  subtitle: formData.values.subtitle,
                  rank: formData.values.rank
                })
              });
              alert("Category Added");
            } catch (error) {
            }
            history.push("/videos/sub-category");
            setImage([]);
            setSubmitLoading(false);
          });
        }
      );
    }
    // setSubmitLoading(false)

  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold", backgroundColor: "#f7f7f7", fontSize: "1.1rem", color: "black" }} >Add Category</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit} style={{ alignItems: 'center' }}>
          <CFormGroup>
            <CRow className="g-3 align-items-center">
              <CCol md="2">
                <CLabel>Name</CLabel>
              </CCol>
              <CCol sm={4}>
                <CInput
                  type="text"
                  placeholder="Enter Category Name"
                  name="coupons"
                  value={formData.values.name}
                  onChange={(e) => {
                    formData.setFieldValue("name", e.target.value); 
                  }}
                // onBlur={() => generateCoupon()}
                />
              </CCol>
              <CCol md="2">
                <CLabel>Sub Title</CLabel>
              </CCol>
              <CCol sm={4}> 
                <CInput
                  type="text"
                  placeholder="Enter subtitle"
                  name="couponMessage"
                  value={formData.values.subtitle}
                  onChange={(e) => {
                    formData.setFieldValue("subtitle", e.target.value); 
                  }}

                />
                {/* </CInputGroup> */}
              </CCol>
            </CRow>
          </CFormGroup>
          <CFormGroup>
            <CRow className="g-3 align-items-center">
             
            </CRow>
          </CFormGroup>
          <CFormGroup>
            <CRow className="g-3 align-items-center">
              <CCol md="2">
                <CLabel>Rank</CLabel>
              </CCol>
              <CCol sm={4}>
                <CInput
                  type="text"
                  placeholder="Enter Rank"
                  name="rank"
                  value={formData.values.rank}
                  onChange={(e) => {
                    formData.setFieldValue("rank", e.target.value); 
                  }}

                />
              </CCol> 
            </CRow>
          </CFormGroup>
          <CFormGroup>
            <CRow className="g-3 align-items-center"> 
              <CCol md="2">
                <CLabel>Image</CLabel>
              </CCol>
              <CCol md={4} sm="6">
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
            <CCol md={12} style={{ display: "flex", justifyContent:"center", alignItems:"center" }}>
              {submitLoading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <CButton type="submit" style={{ color: "#fff", backgroundColor: "#f8b11c", borderColor: "#f8b11c", marginLeft: "auto", marginRight: "auto", marginTop: "10px" }} disabled={submitLoading}>
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

export default AddSubcat;
