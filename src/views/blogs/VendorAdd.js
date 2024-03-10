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
  CInputFile,
  CTextarea
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";
import Multiselect from "multiselect-react-dropdown";

const AddVendor = () => {
  const db = firebase.firestore();


  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [image ,setImage]= useState([]);
  const [cat, setCat] = useState([]);
  const [category, setCatategory] = useState([]);
  var [state, setState] = useState({
    videos: null,
  });

  const initialFormData = {
    shopName:"",
    ownerName:"",
    contactNo:"",
    email:"",
    password:"",
    address:"",
    nameOfBank:"",
    accountNo:"",
    ifscCode:"",
    openTime:"",
    closeTime:"",
    accName:"",
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
        return(videoData.category.map((subcat)=>{
            return({
                id:subcat.catId,
                name:subcat.name
            }) 
        }))
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
  const [status, setStatus] = useState({
    id:"",
    name:"Select Product"
  });
  const updateCategory = async (s) => {
    setCatategory(s);
  };
  const updatedType = async (s) => {
    setType(s);
  };
  const updatedStatus = async (i,s) => {
    setStatus({id:i,name:s});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let idf = category.map((sub)=>{return(sub.id)});
    setSubmitLoading(true)
    try {
        const auth = await firebase.auth().createUserWithEmailAndPassword(formData.values.email, formData.values.password)
            .then(async(userCredential) => {
                // Signed in 
                const user = userCredential.user;
                var ref = await firebase.firestore().collection("vendors").doc();
                var myId = ref.id;
                await ref.set({
                    accountName:formData.values.accName,
                    accountNumber:formData.values.accountNo,
                    bankName:formData.values.nameOfBank,
                    category:idf,
                    closingTime:formData.values.closeTime,
                    ifscCode:formData.values.ifscCode,
                    image:"",
                    isBlocked:false,
                    isOnline:false,
                    isVerified:true,
                    marketEmail:formData.values.email,
                    marketName:formData.values.shopName,
                    marketPhone:formData.values.contactNo,
                    openingTime:formData.values.openTime,
                    ownerEmail:formData.values.email,
                    password:formData.values.password,
                    ownerName:formData.values.ownerName,
                    ownerPhone:formData.values.contactNo,
                    vendorId:myId
                }).then(()=>{
                alert("Vendor Added");
                history.push("/blogs/vendor-Orderhistory");
                });

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
               alert(error.message)
               setSubmitLoading(false)
            });
        
      }catch (error) {
        console.log(error);
        setSubmitLoading(false)
      }
    // if (status.name == "Select Product") {
    //   alert("Products Not Selected")
    // } else {
    //   try {
    //     await firebase.firestore().collection("coupons").doc("JXlWNIPHzc4edJgep33W").update({
    //       couponsList:firebase.firestore.FieldValue.arrayUnion({
    //         title:formData.values.coupons,
    //         discountPrice:0,
    //         isNewUser:true,
    //         productId:status.id,
    //       discount:formData.values.couponAmount,
    //       // imgUrl:url,
    //       subtitle:formData.values.couponMessage,
    //       couponCode:formData.values.couponCode
    //       })
          
  
    //         // code:formData.values.coupons,
    //         // discount:formData.values.couponAmount,
    //         // type:type,
    //         // validity:new Date(document.getElementById("date-input").value).getTime(),
    //         // minOrder:formData.values.miniumOrderAmount,
    //         // isActive:true,
    //         // quantity:1,
    //         // description:formData.values.couponMessage,
    //         // maxBenefit:120,
    //     }).then(()=>{
    //       alert("Offer Added");
    //       history.push("/coupon");
    //     });
        
    //   }catch (error) {
    //   }
      
    // }
   
    // console.log();
    // if (image.length === 0) {
    //   alert("All fields are required!");
    //   setSubmitLoading(false);
    //   return;
    // }else {
    //         var storage = firebase.storage();
    //         var storageRef = storage.ref();
    //         var uploadTask = storageRef.child("offerImage/" + Date.now()).put(image);
    //         uploadTask.on(
    //           firebase.storage.TaskEvent.STATE_CHANGED,
    //           (snapshot) => {
    //             // console.log(snapshot);
    //             var progress =
    //               Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //             // setProgress(progress);
    //           },
    //           (error) => {
    //             // console.log(error);
    //             alert(error);
    //           },
    //           () => {
    //             uploadTask.snapshot.ref.getDownloadURL().then(async (url) => {   
    //               try {
    //                 await firebase.firestore().collection("Coupons").add({
    //                   mainText:formData.values.coupons,
    //                   // cat:status,
    //                   discountRate:formData.values.couponAmount,
    //                   imgUrl:url,
    //                   descText:formData.values.couponMessage,
    //                   couponCode:formData.values.couponCode
            
    //                     // code:formData.values.coupons,
    //                     // discount:formData.values.couponAmount,
    //                     // type:type,
    //                     // validity:new Date(document.getElementById("date-input").value).getTime(),
    //                     // minOrder:formData.values.miniumOrderAmount,
    //                     // isActive:true,
    //                     // quantity:1,
    //                     // description:formData.values.couponMessage,
    //                     // maxBenefit:120,
    //                 });
    //                 alert("Offer Added");
    //               }catch (error) {
    //               }
    //               history.push("/coupon");
    //               setImage([]);
    //               setSubmitLoading(false);
    //             });
    //           }
    //         );
    // } 
    // setSubmitLoading(false)

  };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Add Vendors</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}  style={{alignItems: 'center'}}> 
        <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Shop Name</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter Shop Name"
                      name="shopName"
                      value={formData.values.shopName}
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
                    <CLabel>Owner Name</CLabel>
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
                                placeholder="Enter Owner Name"
                                name="ownerName"
                                value={formData.values.ownerName}
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
            <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Contact No</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                        type="text"
                        placeholder="Enter Contact No"
                        name="contactNo"
                        value={formData.values.contactNo}
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
                  <CCol md={4} sm="6">
                    <CTextarea
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
                    <CLabel>Email</CLabel>
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
                    <CLabel>Password</CLabel>
                  </CCol>
                  <CCol md={4} sm="6">
                    <CInput
                      type="text"
                      placeholder="Enter Password"
                      name="password"
                      value={formData.values.password}
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
                    <CLabel>Name Of Bank</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                        type="text"
                        placeholder="Enter Name of Bank"
                        name="nameOfBank"
                        value={formData.values.nameOfBank}
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
                    <CLabel>Account No</CLabel>
                  </CCol>
                  <CCol md={4} sm="6">
                    <CInput
                      type="text"
                      placeholder="Enter Account No"
                      name="accountNo"
                      value={formData.values.accountNo}
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
                    <CLabel>IFSC Code</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                        type="text"
                        placeholder="Enter IFSC Code"
                        name="ifscCode"
                        value={formData.values.ifscCode}
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
                    <CLabel>Account Holder Name</CLabel>
                  </CCol>
                  <CCol md={4} sm="6">
                    <CInput
                      type="text"
                      placeholder="Enter Account Holder Name"
                      name="accName"
                      value={formData.values.accName}
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
                    <CLabel>Opening Time</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                        type="text"
                        placeholder="Enter Open Time"
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
                  <CCol md="2">
                    <CLabel>Closing Time</CLabel>
                  </CCol>
                  <CCol md={4} sm="6">
                    <CInput
                      type="text"
                      placeholder="Enter Closing Time"
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
                </CRow>
              </CFormGroup>
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                <CCol md="2">
                    <CLabel>Select Category</CLabel>
                </CCol>
                <CCol sm={4}>
                    <Multiselect
                        displayValue="name"
                        onKeyPressFn={function noRefCheck(){}}
                        onRemove={(event)=>{updateCategory(event)}}
                        onSelect={(event)=>{updateCategory(event)}}
                        // onSearch={function noRefCheck(){}} 
                        options={cat[0]}
                        // showCheckbox
                    />
                </CCol>
                </CRow>
              </CFormGroup>
              {/* <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Select Product</CLabel>
                  </CCol>
                  <CCol sm={4}>
                      <CDropdown variant="input-group" style={{color:"#333"}}>
                            <CDropdownToggle color="secondary" variant="outline">
                                {status.name}
                                </CDropdownToggle>
                            <CDropdownMenu>
                            <CDropdownItem header>Select Product</CDropdownItem>
                            <CDropdownDivider/>
                            <CDropdownItem
                                      onClick={() => updatedStatus("All","All")}
                                    >
                                     All
                                    </CDropdownItem>
                            {cat &&
                                cat.map((cat, index) => {
                                  return (
                                    <CDropdownItem
                                      onClick={() => updatedStatus(cat.productId,cat.name)}
                                    >
                                      {cat.name}
                                    </CDropdownItem>
                                  );
                                })}
                            </CDropdownMenu>
                        </CDropdown> 
                  </CCol>
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

export default AddVendor;
