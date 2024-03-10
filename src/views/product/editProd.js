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

const EditProd = (props) => {
  const db = firebase.firestore();


  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [image ,setImage]= useState([]);
  const [cat, setCat] = useState([]);
  const [vendor, setVendor] = useState([]);
  var [state, setState] = useState({
    videos: null,
  });

  const initialFormData = {
   name:props.location.state.name,
   price:props.location.state.price,
   quantity:props.location.state.quantity,
   desc:"",
   weight:props.location.state.weight,
   type:props.location.state.productType,
   wtype:props.location.state.weightType,
   pieces:props.location.state.pieces,
   serve:props.location.state.servesk,

  };

  useEffect(() => {
    getVideos();
    // getVendors();
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
        category:videoData.category,
      }
    });
    setState({
      ...state,
      videos: resolvedVideos,
    });
    setCat(resolvedVideos);
    // setLoading(false);
  };
  const getVendors = async () => {
    // setLoading(true);
    const videos = await firebase.firestore().collection("vendors").orderBy("ownerName","asc").get();

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        ownerName:videoData.ownerName,
        shopName:videoData.shopName
      }
    });
    setState({
      ...state,
      videos: resolvedVideos,
    });
    setVendor(resolvedVideos);
    // setLoading(false);
  };
  

  const [type, setType] = useState({
    id:props.location.state.vendorId,
    name:"Select Vendor",
    shopName:""
  });
  const formData = useFormik({
    initialValues: initialFormData,
  });
  const [status, setStatus] = useState({
    id:"",
    name:props.location.state.categoryName
  });
  const updatedType = async (vid,oname,sname) => {
    setType({id:vid,name:oname,shopName:sname});
  };
  const updatedStatus = async (i,n) => {
    setStatus({id:i,name:n});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true)
    // const value = cat.map((sub)=>sub.category.filter((sub1,index)=>index == sub.category.length-1).map((sub2)=>sub2.catId));
    // const cid = parseFloat(value[0][0])+1;
    // console.log();
    if (image.length === 0) {
        try {
            await firebase.firestore().collection("productitems").doc(props.location.state.id).update({
              categoryName:status.name,
                // inStock:false,
                // productDescription:formData.values.desc,
                // image:url,
                name:formData.values.name,
                price:parseFloat(formData.values.price),
                // productId:Date.now().toString(),
                quantity:parseFloat(formData.values.quantity),
                weight:formData.values.weight,
                weightType:formData.values.wtype,
                pieces:formData.values.pieces,
                serves:formData.values.serve,
                productType:formData.values.type,
                // vendorId:type.id
            }).then(async()=>{
                alert("Product Updated");
                history.goBack();
                setImage([]);
                setSubmitLoading(false);
            });
          }catch (error) {
          }
          
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
                    await firebase.firestore().collection("productitems").doc(props.location.state.id).update({
                      categoryName:status.name,
                        // inStock:false,
                        // productDescription:formData.values.desc,
                        image:url,
                        name:formData.values.name,
                        price:parseFloat(formData.values.price),
                        productId:Date.now().toString(),
                        quantity:parseFloat(formData.values.quantity),
                        weight:formData.values.weight,
                        weightType:formData.values.wtype,
                        pieces:formData.values.pieces,
                        serves:formData.values.serve,
                        productType:formData.values.type,
                        // vendorId:type.id
                    }).then(async()=>{
                        // await firebase.firestore().collection("productItems").doc("B0szi8YwcegMB54BsmA8").update({
                        //     list:firebase.firestore.FieldValue.arrayUnion({
                        //        categoryName:status.name,
                        //        inStock:false,
                        //        productDescription:formData.values.desc,
                        //        productImage:url,
                        //        productName:formData.values.name,
                        //        productPrice:parseFloat(formData.values.price),
                        //        productQuantity:parseFloat(formData.values.quantity),
                        //        productWeight:formData.values.weight,
                        //        stockType:formData.values.type,
                        //        vendorId:type.id
                        //      })
                             
                     
                        //        // code:formData.values.coupons,
                        //        // discount:formData.values.couponAmount,
                        //        // type:type,
                        //        // validity:new Date(document.getElementById("date-input").value).getTime(),
                        //        // minOrder:formData.values.miniumOrderAmount,
                        //        // isActive:true,
                        //        // quantity:1,
                        //        // description:formData.values.couponMessage,
                        //        // maxBenefit:120,
                        //    })
                    });
                    alert("Product Updated");
                  }catch (error) {
                  }
                  history.goBack();
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
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Add Products</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}  style={{alignItems: 'center'}}> 
        <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Product Name</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      type="text"
                      placeholder="Enter Product Name"
                      name="name"
                      value={formData.values.name}
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
                    <CLabel>Price</CLabel>
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
                                type="number"
                                placeholder="Enter Price"
                                name="price"
                                value={formData.values.price}
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
                    <CLabel>Quantity</CLabel>
                  </CCol>
                  <CCol sm={4}>
                  {/* <CInput type="date" id="date-input" name="date-input" placeholder="date" /> */}
                  <CInput
                      type="number"
                      placeholder="Enter Quantity"
                      name="quantity"
                      value={formData.values.quantity}
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
                    <CLabel>Weight</CLabel>
                  </CCol>
                  <CCol sm={4}>
                  <CInput
                      type="text"
                      placeholder="Enter Weight"
                      name="weight"
                      value={formData.values.weight}
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
                    <CLabel>Type</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                        type="text"
                        placeholder="Enter Product Type"
                        name="type"
                        value={formData.values.type}
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
                    <CLabel>Weight Type</CLabel>
                  </CCol>
                  <CCol md={4} sm="6">
                    <CInput
                      type="text"
                      placeholder="Enter Weight Type"
                      name="wtype"
                      value={formData.values.wtype}
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
                    <CLabel>Pieces</CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                        type="text"
                        placeholder="Enter Pieces"
                        name="pieces"
                        value={formData.values.pieces}
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
                    <CLabel>Serve</CLabel>
                  </CCol>
                  <CCol md={4} sm="6">
                    <CInput
                      type="text"
                      placeholder="Enter serve"
                      name="serve"
                      value={formData.values.serve}
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
                      <CDropdown variant="input-group" style={{color:"#333"}}>
                            <CDropdownToggle color="secondary" variant="outline">
                                {status.name}
                                </CDropdownToggle>
                            <CDropdownMenu>
                            <CDropdownItem header>Select Category</CDropdownItem>
                            <CDropdownDivider/>
                            {cat &&
                                cat.map((cat1, index) => {
                                    return(
                                        cat1.category.map((sub)=>{
                                            
                                            return(
                                                <CDropdownItem
                                                onClick={() => updatedStatus(sub.catId,sub.name)}
                                              >
                                                {sub.name}
                                              </CDropdownItem>
                                            );
                                        })
                                    );
                                })}
                            </CDropdownMenu>
                        </CDropdown> 
                  </CCol>
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
              {/* <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Select Vendor</CLabel>
                  </CCol>
                  <CCol sm={4}>
                      <CDropdown variant="input-group" style={{color:"#333"}}>
                            <CDropdownToggle color="secondary" variant="outline">
                                {type.name}
                                </CDropdownToggle>
                            <CDropdownMenu>
                            <CDropdownItem header>Select Vendor</CDropdownItem>
                            <CDropdownDivider/>
                            {vendor &&
                                vendor.map((cat, index) => {
                                  return (
                                    <CDropdownItem
                                      onClick={() => updatedType(cat.id,cat.ownerName,cat.shopName)}
                                    >
                                    <div><b>Vendor Name :</b>{cat.ownerName}</div>
                                    <br></br>
                                    <div><b>Shop Name :</b>{cat.shopName}</div>
                                    </CDropdownItem>
                                  );
                                })}
                            </CDropdownMenu>
                        </CDropdown> 
                  </CCol>
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

export default EditProd;
