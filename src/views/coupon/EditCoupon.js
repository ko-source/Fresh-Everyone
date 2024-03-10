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

const EditCoupon = (props) => {
  const db = firebase.firestore();

  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [image ,setImage]= useState([]);
  const [cat, setCat] = useState([]);
  var [state, setState] = useState({
    videos: null,
  });

  const initialFormData = {
    coupons:props.location.state.title,
    couponAmount:props.location.state.discAmt,
    // couponExpiryDate:"",
    // miniumOrderAmount:props.location.state.discAmt,
    couponMessage:props.location.state.subTitle,
    couponCode:props.location.state.couponCode

  };

  useEffect(() => {
    // getVideos();
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
  

  const [type, setType] = useState("Coupon Type");
  const formData = useFormik({
    initialValues: initialFormData,
  });
  const [status, setStatus] = useState(props.location.state.service);
  const updatedType = async (s) => {
    setType(s);
  };
  const updatedStatus = async (s) => {
    setStatus(s);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true)
    // console.log();
    if (image.length === 0) {
        try {
            await firebase.firestore().collection("Coupons").doc(props.location.state.id).update({
              mainText:formData.values.coupons,
              // cat:status,
              discountRate:formData.values.couponAmount,
              // imgUrl:url,
              descText:formData.values.couponMessage,
              couponCode:formData.values.couponCode
    
                // code:formData.values.coupons,
                // discount:formData.values.couponAmount,
                // type:type,
                // validity:new Date(document.getElementById("date-input").value).getTime(),
                // minOrder:formData.values.miniumOrderAmount,
                // isActive:true,
                // quantity:1,
                // description:formData.values.couponMessage,
                // maxBenefit:120,
            });
            alert("Coupon Updated");
          }catch (error) {
          }
          history.push("/coupon");
      setSubmitLoading(false);
      return;
    }else {
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
                    await firebase.firestore().collection("Coupons").doc(props.location.state.id).update({
                      mainText:formData.values.coupons,
                      // cat:status,
                      discountRate:formData.values.couponAmount,
                      imgUrl:url,
                      descText:formData.values.couponMessage,
                      couponCode:formData.values.couponCode
            
                        // code:formData.values.coupons,
                        // discount:formData.values.couponAmount,
                        // type:type,
                        // validity:new Date(document.getElementById("date-input").value).getTime(),
                        // minOrder:formData.values.miniumOrderAmount,
                        // isActive:true,
                        // quantity:1,
                        // description:formData.values.couponMessage,
                        // maxBenefit:120,
                    });
                    alert("Coupons Updated");
                  }catch (error) {
                  }
                  history.push("/coupon");
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
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Edit Coupons</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}  style={{alignItems: 'center'}}> 
        <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Coupon Title</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter Coupon"
                      name="coupons"
                      value={formData.values.coupons}
                      onChange={(e) => {
                        formData.handleChange(e);
                        
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                      // onBlur={() => generateCoupon()}
                    />
                  </CCol>
                  <CCol md="2">
                    <CLabel>Coupon Code</CLabel>
                  </CCol>
                  <CCol sm={4}>
                  {/* <CInputGroup className="mb-3"> */}
                        {/* <CDropdown variant="input-group" style={{color:"#333"}}>
                            <CDropdownToggle color="secondary" variant="outline">
                                {type}
                                </CDropdownToggle>
                            <CDropdownMenu>
                            <CDropdownItem header>Select Coupon Type</CDropdownItem>
                            <CDropdownDivider/>
                            <CDropdownItem onClick={() =>updatedType("Flat")}>Flat</CDropdownItem>
                            <CDropdownItem onClick={() =>updatedType("Percentage")}>Percentage</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown> */}
                            <CInput
                                type="text"
                                placeholder="Enter Coupon Code"
                                name="couponCode"
                                value={formData.values.couponCode}
                                onChange={(e) => {
                                    formData.handleChange(e);
                                    // setFormData({
                                    //   ...formData.values,
                                    //   name: e.target.value
                                    // })
                                }}
                                
                            />
                    {/* </CInputGroup> */}
                  </CCol>
                </CRow>
            </CFormGroup>
              {/* <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Coupon Expiry Date</CLabel>
                  </CCol>
                  <CCol sm={4}>
                  <CInput type="date" id="date-input" name="date-input" placeholder="date" />
                  </CCol>
                  <CCol md="2">
                    <CLabel>Minimum Order Amount</CLabel>
                  </CCol>
                  <CCol sm={4}>
                  <CInput
                      type="number"
                      placeholder="Minimum Order Amount"
                      name="miniumOrderAmount"
                      value={formData.values.miniumOrderAmount}
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
              </CFormGroup> */}
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Coupon Sub Title</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                        type="text"
                        placeholder="Enter Coupon Message"
                        name="couponMessage"
                        value={formData.values.couponMessage}
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
                    <CLabel>Discount Amount</CLabel>
                  </CCol>
                  <CCol md={4} sm="6">
                    <CInput
                      type="number"
                      placeholder="Enter Coupon Amount"
                      name="couponAmount"
                      value={formData.values.couponAmount}
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
                  {/* <CCol md="2">
                    <CLabel>Coupon Service</CLabel>
                  </CCol>
                  <CCol sm={4}>
                      <CDropdown variant="input-group" style={{color:"#333"}}>
                            <CDropdownToggle color="secondary" variant="outline">
                                {status}
                                </CDropdownToggle>
                            <CDropdownMenu>
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
                  </CCol> */}
                  <CCol md="2">
                    <CLabel>Coupon Image</CLabel>
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

export default EditCoupon;
