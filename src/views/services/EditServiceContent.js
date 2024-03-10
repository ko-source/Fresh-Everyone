import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CAlert,
  CInput,
  CForm,
  CFormGroup,
  CLabel,
  CSpinner,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CInputFile,
  CTextarea,
  CInputGroup,
  CImg
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import SearchableSelect from "../orders/searchableSelect";
import { useFormik } from "formik";
import { exportDataToXLSX } from "../../utils/exportData";
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {base64StringtoFile,
  downloadBase64File,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef} from './ReusableUtils'
  import './custom-image-crop.css';
  
  import ImageCrop from './ImageCrop'

  window.name = 0;
  [window.setVideo] = [];
  window.set = ([]);
  export function image64f (image64) {
    // console.log(image64);
      window.setVideo=image64;
      const newImage = image64;
      newImage["id"] = Math.random();
      window.set = [...window.set, newImage];
      // console.log(window.set);
      window.name=1;
  }

// const template = {
//   title: "",
//   body: "",
// };

// const initialState = {
//   title: "",
//   bestData: ["", "", ""],
//   howItWorks: [template, template, template],
//   faq: [template, template, template],
//   about: template,
//   whyBook: [template, template, template, template],
//   whyBookTitle: "",
//   subServices: [template, template, template, template, template, template],
//   metaData: {
//     title: "",
//     keywords: "",
//     description: "",
//     url: "",
//   },
// };

const EditServiceContent = (props) => {
  // const db = firebase.firestore();
  // console.log(props.location.state.id);
  const history = useHistory();

  const imagePreviewCanvasRef = React.createRef();
  var [cat, setCat] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [gdata, setData] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState([]);
  const [urls, setUrls] = useState([]);
  const [result, setResult] = useState([]);
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
  
  const [services, setServices] = useState([]);
  // const [service, setService] = useState(initialState);

  const [serviceLoading, setServiceLoading] = useState(false);

  const [serviceId, setServiceId] = useState("");

  useEffect(() => {
    getOrders();
    getData();
  }, []);
  const getOrders = async () => {
    const response=await firebase.firestore().collection("categories");
    const data=await response.get();
    data.docs.forEach(item=>{
      cat.push({id:item.id,...item.data()});
    })
    setCat([...cat,cat])
  };
  const getData = async () => {
    const response=await firebase.firestore().collection("generalData");
    const data=await response.get();
    data.docs.forEach(item=>{
      gdata.push({id:item.id,...item.data()});
    })
    setData([...gdata,gdata])
  };
 
  const initialFormData = {
    name: props.location.state.name,
    product_description: props.location.state.description,
    priority:props.location.state.productPriority,
  };
  const PriceData = {
    weight: "",
    unit: "",
    originalPrice: "",
    discount: "",
    discountedPrice: "",
  };
  const shopPriceData = {
    weight: "",
    unit: "",
    originalPrice: "",
    discount: "",
    discountedPrice: "",
  };
  const hotelPriceData = {
    weight: "",
    unit: "",
    originalPrice: "",
    discount: "",
    discountedPrice: "",
  };
  const socData = [...props.location.state.society]
  const shopData = [...props.location.state.shop]
  const hotelData = [...props.location.state.hotel]

  const formData = useFormik({
    initialValues: initialFormData,
  });
 
  
  // const handleChange = (e) => {
  //   for (let i = 0; i < e.target.files.length; i++) {
  //     const newImage = e.target.files[i];
  //     newImage["id"] = Math.random();
  //     setVideo((prevState) => [...prevState, newImage]);
  //     // console.log(newImage);
  //     setPhotoURL(URL.createObjectURL(newImage));
  //     console.log(photoURL);
  //     // const currentFile = files[0]
  //     const myFileItemReader = new FileReader()
  //     myFileItemReader.addEventListener("load", ()=>{
  //         // console.log(myFileItemReader.result)
  //         const myResult = myFileItemReader.result
  //         setImage({
  //             imgSrc: myResult,
  //             imgSrcExt: extractImageFileExtensionFromBase64(myResult)
  //         })
  //     }, false)

  //     myFileItemReader.readAsDataURL(newImage)
  //   }      
  // };

  const handleUpload = () => {
    const newImage = window.setVideo;
    newImage["id"] = Math.random();
    setVideo((prevState) => [...prevState, newImage]);
    // e.preventDefault();
    setSubmitLoading(true);
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    if (window.name == 0) {
      try {
        await firebase.firestore().collection("products").doc(props.location.state.id).update({
        name: formData.values.name,
        category:status.id,
        categoryName:status.name,
        subCategory:sub,
        description:formData.values.product_description,
        type:type,
        society:socPrice,
        shop:shopPrice,
        hotel:hotelPrice,
        isActive:true,
        // imageUrl: urls,
        hsn:hsn,
        gst:gst,
        productPriority:formData.values.priority,
        brandName:brand
      });
    }catch (error) {
    }
    setSubmitLoading(false);
    alert("Item Updated.");
    history.goBack();
    }else {
      window.set.map((image,index) => {
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var uploadTask = storageRef.child("productImages/" + Date.now()).put(image);
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
              urls.push(url);
              setUrls([...urls]);
              setSubmitLoading(false);
              alert("Image uploaded.");
              setRefresh(!refresh);
              if (index+1 == window.set.length) {
                try {
                  await firebase.firestore().collection("products").doc(props.location.state.id).update({
                  name: formData.values.name,
                  category:status.id,
                  categoryName:status.name,
                  subCategory:sub,
                  description:formData.values.product_description,
                  type:type,
                  society:socPrice,
                  shop:shopPrice,
                  hotel:hotelPrice,
                  isActive:true,
                  imageUrl: urls,
                  hsn:hsn,
                  gst:gst,
                  productPriority:formData.values.priority,
                  brandName:brand
                });
              }catch (error) {
              }
              setSubmitLoading(false);
              alert("Item Updated.");
              setUrls([]);
              window.name = 0;
              history.goBack();
              }
            });
          }
        );
      });
    }
};

const [status, setStatus] = useState({
  name:props.location.state.categoryName,
  id:props.location.state.category,
});
const [gst, setGst] = useState(props.location.state.gst);
const [hsn, setHsn] = useState(props.location.state.hsn);
const [brand, setBrand] = useState(props.location.state.brandName);
const [type, setType] = useState(props.location.state.type);
const [sub, setSub] = useState(props.location.state.subCategory);
const [socPrice, setPrice] = useState(socData);
const [shopPrice, setShopPrice] = useState(shopData);
const [hotelPrice, sethotelPrice] = useState(hotelData);
// console.log(shopPrice);


const addPrice = () => {
  setPrice([...socPrice, PriceData]);
  // console.log(socPrice);
};
const addShopPrice = () => {
  setShopPrice([...shopPrice, shopPriceData]);
};
const addHotelPrice = () => {
  sethotelPrice([...hotelPrice, hotelPriceData]);
};
const Change = (e, index) =>{
  const updateddata = socPrice.map((socPrice,i) => index == i ?
  Object.assign(socPrice,{[e.target.name]: e.target.value}) : socPrice );
  setPrice(updateddata);
  // console.log(socPrice);
};
const remove = (index) => {
  const filterdata = [...socPrice];
  filterdata.splice(index,1);
  setPrice(filterdata);
};
const shopChange = (e, index) =>{
  const updateddata = shopPrice.map((shopPrice,i) => index == i ?
  Object.assign(shopPrice,{[e.target.name]: e.target.value}) : shopPrice );
  setShopPrice(updateddata);
};
const shopremove = (index) => {
  const filterdata = [...shopPrice];
  filterdata.splice(index,1);
  setShopPrice(filterdata);
};
const hotelChange = (e, index) =>{
  const updateddata = hotelPrice.map((hotelPrice,i) => index == i ?
  Object.assign(hotelPrice,{[e.target.name]: e.target.value}) : hotelPrice );
  sethotelPrice(updateddata);
};
const hotelremove = (index) => {
  const filterdata = [...hotelPrice];
  filterdata.splice(index,1);
  sethotelPrice(filterdata);
};
const updatedStatus = async (s,i) => {
  setStatus({name:s,id:i})
  // console.log(status.name);
};
const updatedSub = async (s) => {
  setSub(s)
};
const updatedType = async (s) => {
  setType(s)
};
const updatedGst = async (s) => {
  setGst(s);
};
const updatedHsn = async (s) => {
  setHsn(s);
};
const updatedBrand = async (s) => {
  setBrand(s);
};


  return (
    <CRow style={{backgroundColor:"#f1f2f7"}}>
      <CCol xl={12}>
        <CCard>
          <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Edit Product</CCardHeader>
          <CCardBody>
          <CForm onSubmit={handleSubmit} id="form">
            <CFormGroup>
              <CRow className="g-3 align-items-center">
                <CCol md="2">
                  <CLabel>Name </CLabel>
                </CCol>
                <CCol sm={4}>
                  <CInput
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={formData.values.name}
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
                  <CLabel>Select Category</CLabel>
                </CCol>
                <CCol sm={4}>
                  <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                              <CDropdownToggle
                                caret
                                varient={"outline"}
                              >
                                {status.name}
                              </CDropdownToggle>
                              <CDropdownMenu style={{ width: "100%",}}>
                                <CDropdownItem header>Select category</CDropdownItem>
                                <CDropdownItem divider />
                                {
                                  cat && cat.map((cat,index)=>{
                                    return(
                                      <CDropdownItem onClick={() => updatedStatus(cat.name,cat.id)}>{cat.name}</CDropdownItem>
                                    )
                                  })
                                }
                              </CDropdownMenu>
                    </CDropdown>
                </CCol>
              </CRow>
              </CFormGroup>
              <CFormGroup>
              <CRow className="g-3 align-items-center">
                <CCol md="2">
                  <CLabel>Select Sub Category </CLabel>
                </CCol>
                <CCol sm={4}>
                    <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                  <CDropdownToggle
                                    caret
                                    varient={"outline"}
                                  >
                                    {sub}
                                  </CDropdownToggle>
                                  <CDropdownMenu style={{ width: "100%"}}>
                                    <CDropdownItem header>Select category</CDropdownItem>
                                    <CDropdownItem divider />
                                    {
                                      cat.filter(x => x.id === status.id).map( sub =>{
                                        return( 
                                          sub.subCategory.map(sub1 =>{
                                            return(
                                            <CDropdownItem onClick={() =>updatedSub(sub1)}>{sub1}</CDropdownItem>
                                          )
                                          })
                                        )
                                      })
                                    }
                                  </CDropdownMenu>
                        </CDropdown>
                </CCol>
                <CCol md="2">
                  <CLabel>Product Image</CLabel>
                </CCol>
                <CCol sm={3}>
                <ImageCrop/>  
                  {
                      video.map((image)=>{
                        return(
                          <p>{image.name}</p>
                        )
                      })
                  }                 
                    {/* <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#f8b11c",
                              borderColor: "#f8b11c",
                              marginTop: "2px",
                              borderRadius: "0.25rem",
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={handleUpload}
                          >
                            Upload
                          </CButton> */}
                </CCol>
              </CRow>
              </CFormGroup>
              <CFormGroup>
              <CRow className="g-3 align-items-center">
                <CCol md="2">
                  <CLabel> </CLabel>
                </CCol>
                <CCol sm={4}>
                </CCol>
                <CCol md="2">
                  <CLabel></CLabel>
                </CCol>
                <CCol sm={3}>
                  { (props.location.state.imageUrl.length == 0)?
                  <div></div>:
                    props.location.state.imageUrl.map((url,index)=>{
                      return(
                        <CImg
                        key={index}
                        rounded="true"
                        src={url}
                        width={90}
                        height={90}
                      />
                      )
                    })
                  }
                </CCol>
              </CRow>
              </CFormGroup>
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Product Description </CLabel>
                  </CCol>
                  <CCol sm={10}>
                      <CTextarea
                        type="text"
                        rows="3"
                        placeholder="Enter Product Description"
                        name="product_description"
                        value={formData.values.product_description}
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
              <CFormGroup row>
                  <CCol md="2"><CLabel>Product Type </CLabel></CCol>
                  <CCol md="4">
                    <CFormGroup>
                        <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                  <CDropdownToggle
                                    caret
                                    varient={"outline"}
                                  >
                                    {type===""?"Select Product Type":type}
                                  </CDropdownToggle>
                                  <CDropdownMenu style={{ width: "100%"}}>
                                    <CDropdownItem header>Select product type</CDropdownItem>
                                    <CDropdownItem divider />
                                    {
                                      gdata.filter(x => x.id === 'data').map( sub =>{
                                        return( 
                                          sub.types.map(sub1 =>{
                                            return(
                                            <CDropdownItem onClick={() =>updatedType(sub1)}>{sub1}</CDropdownItem>
                                          )
                                          })
                                        )
                                      })
                                    }
                                  </CDropdownMenu>
                        </CDropdown>
                    </CFormGroup>
                  </CCol>
                    <CCol md="2">
                      <CLabel>HSN/SAC </CLabel>
                    </CCol>
                    <CCol sm={4}>
                    <CDropdown className="mt-2">
                      <CDropdownToggle
                        style={{
                          border: "1px solid #d8dbe0",
                          borderRadius: "0.25rem",
                          width: "100%",
                          textAlign: "left"
                        }}
                        caret
                        varient={"outline"}
                      >
                        {hsn ===""?"Select HSN Number":hsn}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>Select HSN Number</CDropdownItem>
                        <CDropdownItem divider />
                        {gdata
                              .filter((x) => x.id === "hsn")
                              .map((sub) => {
                                return sub.hsn.map((sub1) => {
                                  return <CDropdownItem onClick={() => updatedHsn(sub1)}>
                                  {sub1}
                                </CDropdownItem>;
                                });
                              })}
                      </CDropdownMenu>
                    </CDropdown>
                  </CCol>
                </CFormGroup>
                <CFormGroup>
              <CRow className="g-3 align-items-center">
                <CCol md="2">
                  <CLabel>GST Rate </CLabel>
                </CCol>
                <CCol sm={4}>
                <CDropdown className="mt-2">
                      <CDropdownToggle
                        style={{
                          border: "1px solid #d8dbe0",
                          borderRadius: "0.25rem",
                          width: "100%",
                          textAlign: "left"
                        }}
                        caret
                        varient={"outline"}
                      >
                        {gst ===""?"Select GST":gst}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>Select GST</CDropdownItem>
                        <CDropdownItem divider />
                        {gdata
                              .filter((x) => x.id === "data")
                              .map((sub) => {
                                return sub.gst.map((sub1) => {
                                  return <CDropdownItem onClick={() => updatedGst(sub1)}>
                                  {sub1}
                                </CDropdownItem>;
                                });
                              })}
                      </CDropdownMenu>
                    </CDropdown>
                </CCol>
                <CCol md="2">
                  <CLabel>Products priority display</CLabel>
                </CCol>
                <CCol sm={4}>
                  <CInput
                      type="number"
                      placeholder="Products priority display"
                      name="priority"
                      value={formData.values.priority}
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
                  <CLabel>Brand Name </CLabel>
                </CCol>
                <CCol sm={4}>
                <CDropdown className="mt-2">
                      <CDropdownToggle
                        style={{
                          border: "1px solid #d8dbe0",
                          borderRadius: "0.25rem",
                          width: "100%",
                          textAlign: "left"
                        }}
                        caret
                        varient={"outline"}
                      >
                        {brand ===""?"Select Brand":brand}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>Select Brand</CDropdownItem>
                        <CDropdownItem divider />
                        {gdata
                              .filter((x) => x.id === "brand")
                              .map((sub) => {
                                return sub.brand.map((sub1) => {
                                  return <CDropdownItem onClick={() => updatedBrand(sub1)}>
                                  {sub1}
                                </CDropdownItem>;
                                });
                              })}
                      </CDropdownMenu>
                    </CDropdown>
                </CCol>
              </CRow>
            </CFormGroup>
          <CCol xl={12} style={{backgroundColor:"#f1f1f1"}}>
            <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f1f1f1"}}>Society User Type Price</CCardHeader>
            <CCardBody>
                {
                  socPrice.map((socPrice, index)=>(
                    <CRow className="row g-3" key={index}>
                        <CCol md={2}>
                          <CLabel>Product Unit</CLabel>
                          <CInputGroup className="mb-3">
                            <CInput
                                    type="text"
                                    placeholder="Weight"
                                    name="weight"
                                    value={socPrice.weight}
                                    onChange={(e) => {
                                      Change(e, index);
                                      // setFormData({
                                      //   ...formData.values,
                                      //   name: e.target.value
                                      // })
                                    }}
                                    />
                                    <select name="unit" id={socPrice.unit} data-id={index}onClick={(e) => {Change(e, index)}} style={{ width: "40%",backgroundColor:"#fff"}}>
                                      {
                                        gdata.filter(x => x.id === 'data').map( sub =>{
                                          return( 
                                            sub.units.map((sub1,index) =>{
                                              return(
                                                index===0?<option value={socPrice.unit}selected disabled hidden>{socPrice.unit === ""?"Unit":socPrice.unit}</option>:<option value={sub1}>{sub1}</option>
                                            )
                                            })
                                          )
                                        })
                                      }
                                    </select> 
                          </CInputGroup>
                        </CCol>
                        <CCol md={2}>
                          <CLabel>Original Price</CLabel>
                            <CInput
                                type="text"
                                placeholder="Original Price(Rs.)"
                                name="originalPrice"
                                value={socPrice.originalPrice}
                                onChange={(e) => {
                                  Change(e, index);
                                  socPrice.discountedPrice=(socPrice.originalPrice-socPrice.discount).toString();
                                  // setFormData({
                                  //   ...formData.values,
                                  //   name: e.target.value
                                  // })
                                }}
                                />
                        </CCol>
                        <CCol md={3}>
                          <CLabel>Discount</CLabel>
                            <CInput
                                  type="text"
                                  placeholder="Discount"
                                  name="discount"
                                  value={socPrice.discount}
                                  onChange={(e) => {
                                    Change(e, index);
                                    socPrice.discountedPrice=(socPrice.originalPrice-socPrice.discount).toString();
                                    
                                    // setFormData({
                                    //   ...formData.values,
                                    //   name: e.target.value
                                    // })
                                  }}
                                  />
                        </CCol>
                        <CCol md={3}>
                          <CLabel>Discounted Price</CLabel>
                          <CInput
                                  type="text"
                                  disabled readOnly
                                  placeholder="Discounted Price(Rs.)"
                                  name="discountedPrice"
                                  value={socPrice.discountedPrice}
                                  onChange={(e) => {
                                    Change(e, index);
                                    // setFormData({
                                    //   ...formData.values,
                                    //   name: e.target.value
                                    // })
                                  }}
                                  />
                        </CCol>
                        <CCol md={2}>
                          <CLabel> </CLabel>
                          {
                            index === 0? <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c",marginTop:"28px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={addPrice}>Add</CButton>
                            :<CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545",marginTop:"28px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => remove(index)}>Delete</CButton>
                          }
                        </CCol>
                      </CRow>
                  ))
                }
            </CCardBody>
            <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f1f1f1"}}>Shop User Type Price</CCardHeader>
            <CCardBody>
                {
                  shopPrice.map((shopPrice, index)=>(
                    <CRow className="row g-3" key={index}>
                        <CCol md={2}>
                          <CLabel>Product Unit</CLabel>
                          <CInputGroup className="mb-3">
                            <CInput
                                    type="text"
                                    placeholder="Weight"
                                    name="weight"
                                    value={shopPrice.weight}
                                    onChange={(e) => {
                                      shopChange(e, index);
                                      // setFormData({
                                      //   ...formData.values,
                                      //   name: e.target.value
                                      // })
                                    }}
                                    />
                                    
                                    <select name="unit" id={shopPrice.unit} data-id={index} onClick={(e) => {shopChange(e, index)}} style={{ width: "40%",backgroundColor:"#fff"}}>
                                      {
                                        gdata.filter(x => x.id === 'data').map( sub =>{
                                          return( 
                                            sub.units.map((sub1,index)  =>{
                                              return(
                                                index===0?<option value={shopPrice.unit}selected disabled hidden>{shopPrice.unit === ""?"Unit":shopPrice.unit}</option>:<option value={sub1}>{sub1}</option>

                                            )
                                            })
                                          )
                                        })
                                      }
                                    </select> 
                          </CInputGroup>
                        </CCol>
                        <CCol md={2}>
                          <CLabel>Original Price</CLabel>
                            <CInput
                                type="text"
                                placeholder="Original Price(Rs.)"
                                name="originalPrice"
                                value={shopPrice.originalPrice}
                                onChange={(e) => {
                                  shopChange(e, index);
                                  shopPrice.discountedPrice=(shopPrice.originalPrice-shopPrice.discount).toString();
                                  // setFormData({
                                  //   ...formData.values,
                                  //   name: e.target.value
                                  // })
                                }}
                                />
                        </CCol>
                        <CCol md={3}>
                          <CLabel>Discount</CLabel>
                            <CInput
                                  type="text"
                                  placeholder="Discount"
                                  name="discount"
                                  value={shopPrice.discount}
                                  onChange={(e) => {
                                    shopChange(e, index);
                                    shopPrice.discountedPrice=(shopPrice.originalPrice-shopPrice.discount).toString();
                                    // setFormData({
                                    //   ...formData.values,
                                    //   name: e.target.value
                                    // })
                                  }}
                                  />
                        </CCol>
                        <CCol md={3}>
                          <CLabel>Discounted Price</CLabel>
                          <CInput
                                  type="text"
                                  disabled readOnly
                                  placeholder="Discounted Price(Rs.)"
                                  name="discountedPrice"
                                  value={shopPrice.discountedPrice}
                                  onChange={(e) => {
                                    shopChange(e, index);
                                    // setFormData({
                                    //   ...formData.values,
                                    //   name: e.target.value
                                    // })
                                  }}
                                  />
                        </CCol>
                        <CCol md={2}>
                          <CLabel> </CLabel>
                          {
                            index === 0? <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c",marginTop:"28px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={addShopPrice}>Add</CButton>
                            :<CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545",marginTop:"28px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => shopremove(index)}>Delete</CButton>
                          }
                        </CCol>
                      </CRow>
                  ))
                }
            </CCardBody>
            <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f1f1f1"}}>Hotel User Type Price</CCardHeader>
            <CCardBody>
                {
                  hotelPrice.map((hotelPrice, index)=>(
                    <CRow className="row g-3" key={index}>
                        <CCol md={2}>
                          <CLabel>Product Unit</CLabel>
                          <CInputGroup className="mb-3">
                            <CInput
                                    type="text"
                                    placeholder="Weight"
                                    name="weight"
                                    value={hotelPrice.weight}
                                    onChange={(e) => {
                                      hotelChange(e, index);
                                      // setFormData({
                                      //   ...formData.values,
                                      //   name: e.target.value
                                      // })
                                    }}
                                    />
                                    <select name="unit" id={hotelPrice.unit} data-id={index} onClick={(e) => {hotelChange(e, index)}} style={{ width: "40%",backgroundColor:"#fff"}}>
                                      {
                                        gdata.filter(x => x.id === 'data').map( sub =>{
                                          return( 
                                            sub.units.map((sub1,index)  =>{
                                              return(
                                                index===0?<option value={hotelPrice.unit}selected disabled hidden>{hotelPrice.unit === ""?"Unit":hotelPrice.unit}</option>:<option value={sub1}>{sub1}</option>
                                            )
                                            })
                                          )
                                        })
                                      }
                                    </select> 
                          </CInputGroup>
                        </CCol>
                        <CCol md={2}>
                          <CLabel>Original Price</CLabel>
                            <CInput
                                type="text"
                                placeholder="Original Price(Rs.)"
                                name="originalPrice"
                                value={hotelPrice.originalPrice}
                                onChange={(e) => {
                                  hotelChange(e, index);
                                  hotelPrice.discountedPrice=(hotelPrice.originalPrice-hotelPrice.discount).toString();
                                  // setFormData({
                                  //   ...formData.values,
                                  //   name: e.target.value
                                  // })
                                }}
                                />
                        </CCol>
                        <CCol md={3}>
                          <CLabel>Discount</CLabel>
                            <CInput
                                  type="text"
                                  placeholder="Discount"
                                  name="discount"
                                  value={hotelPrice.discount}
                                  onChange={(e) => {
                                    hotelChange(e, index);
                                    hotelPrice.discountedPrice=(hotelPrice.originalPrice-hotelPrice.discount).toString();
                                    // setFormData({
                                    //   ...formData.values,
                                    //   name: e.target.value
                                    // })
                                  }}
                                  />
                        </CCol>
                        <CCol md={3}>
                          <CLabel>Discounted Price</CLabel>
                          <CInput
                                  type="text"
                                  disabled readOnly
                                  placeholder="Discounted Price(Rs.)"
                                  name="discountedPrice"
                                  value={hotelPrice.discountedPrice}
                                  onChange={(e) => {
                                    hotelChange(e, index);
                                    // setFormData({
                                    //   ...formData.values,
                                    //   name: e.target.value
                                    // })
                                  }}
                                  />
                        </CCol>
                        <CCol md={2}>
                          <CLabel> </CLabel>
                          {
                            index === 0? <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c",marginTop:"28px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={addHotelPrice}>Add</CButton>
                            :<CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545",marginTop:"28px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => hotelremove(index)}>Delete</CButton>
                          }
                        </CCol>
                      </CRow>
                  ))
                }
            </CCardBody>
          </CCol>
              <CFormGroup>
                <CCol md={12} style={{ display: "flex" }}>
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
      </CCol>
      {/* <CCol xl={6}>
        <CCard>
          <CCardHeader>
            Verified
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={usersData}
              fields={[
                { key: 'name', _classes: 'font-weight-bold' },
                'registered', 'role', 'status'
              ]}
              hover
              striped
              itemsPerPage={5}
              activePage={page}
              clickableRows
              onRowClick={(item) => history.push(`/users/${item.id}`)}
              scopedSlots={{
                'status':
                  (item) => (
                    <td>
                      <CBadge color={getBadge(item.status)}>
                        {item.status}
                      </CBadge>
                    </td>
                  )
              }}
            />
            <CPagination
              activePage={page}
              onActivePageChange={pageChange}
              pages={5}
              doubleArrows={false}
              align="center"
            />
          </CCardBody>
        </CCard>
      </CCol> */}
    </CRow>
  );
};

export default EditServiceContent;
