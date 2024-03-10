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
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CInputFile,
  CTextarea,
  CInputGroup,
  CInvalidFeedback
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import { useFormik } from "formik";
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
  window.setImage = ([]);
  export function image64f (image64) {
    console.log(image64);
      window.setVideo=image64;
      const newImage = image64;
      newImage["id"] = Math.random();
      window.setImage = [...window.setImage, newImage];
      // console.log(window.setImage);
      window.name=1;
  }
// import usersData from './UsersData'

// const getBadge = status => {
//   switch (status) {
//     case 'Active': return 'success'
//     case 'Inactive': return 'secondary'
//     case 'Pending': return 'warning'
//     case 'Banned': return 'danger'
//     default: return 'primary'
//   }
// }

const ServiceProviders = () => {
  const history = useHistory();

  // const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  // const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  // const [page, setPage] = useState(currentPage)

  // const pageChange = newPage => {
  //   currentPage !== newPage && history.push(`/users?page=${newPage}`)
  // }

  // useEffect(() => {
  //   currentPage !== page && setPage(currentPage)
  // }, [currentPage, page])

  const imagePreviewCanvasRef = React.createRef();

  const [refresh, setRefresh] = React.useState(false);
  var [cat, setCat] = useState([]);
  var [gdata, setData] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState([]);
  const [result, setResult] = useState([]);
  const [urls, setUrls] = useState([]);
  const [photoURL, setPhotoURL] = useState("");

  const [validated, setValidated] = useState(false);
  // const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    getOrders();
    getData();
   
  }, []);

  const getOrders = async () => {
    const response = await firebase.firestore().collection("categories");
    const data = await response.get();
    data.docs.forEach((item) => {
      cat.push({ id: item.id, ...item.data() });
    });
    setCat([...cat, cat]);
  };
  const getData = async () => {
    const response = await firebase.firestore().collection("generalData");
    const data = await response.get();
    data.docs.forEach((item) => {
      gdata.push({ id: item.id, ...item.data() });
    });
    setData([...gdata, gdata]);
  };

  const initialFormData = {
    name: "",
    product_description: "",
    priority: "",
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

  const formData = useFormik({
    initialValues: initialFormData,
  });
  // const handleChange = (e) => {
  //   // for (let i = 0; i < e.target.files.length; i++) {
  //     const newImage = e;
  //     newImage["id"] = Math.random();
  //     setVideo((prevState) => [...prevState, newImage]);
  //     // console.log(video);
  //     // console.log(newImage);
      
  //   // }      
  // };

  const handleUpload = () => {
    console.log("clicked");
    window.setImage.map((image)=>{
      return(
        setVideo(image.name)
      )
    })
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    // console.log(urls);
  const form = e.currentTarget
  if (form.checkValidity() === false) {
    e.preventDefault()
    alert("All fields are required!")
    setSubmitLoading(false);
    e.stopPropagation()
  }else if(status.name === "Select Category"){
    e.preventDefault()
    alert("Please Select Category!")
    setSubmitLoading(false);
  }else if(sub === "Select Sub Category"){
    e.preventDefault()
    alert("Please Select Sub-Category!")
    setSubmitLoading(false);
  }
  else if(window.name == 0) {
    e.preventDefault()
      alert("Image required!");
      setSubmitLoading(false);
      return;
    }
    else{
      e.preventDefault()
      setValidated(true)
      window.setImage.map((image,index) => {
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
              if (index+1 == window.setImage.length) {
                try {
                  await firebase.firestore().collection("products").add({
                    name: formData.values.name,
                    category: status.id,
                    categoryName: status.name,
                    subCategory: sub,
                    description: formData.values.product_description,
                    type: type,
                    society: socPrice,
                    shop: shopPrice,
                    hotel: hotelPrice,
                    isActive: true,
                    imageUrl: urls,
                    hsn: hsn,
                    gst: gst,
                    productPriority: formData.values.priority,
                    brandName: brand,
                    rating:5
                  });
                } catch (error) {}
                setSubmitLoading(false);
                alert("Item Added.");
                setUrls([]);
                setVideo([]);
                setShopPrice([shopPriceData]);
                sethotelPrice([hotelPriceData]);
                setPrice([PriceData]);
                window.setImage = ([]);
                window.name = 0;
                formData.resetForm();
                document.getElementById("form").reset();
                setRefresh(!refresh);
              }
            });
          }
        );
      });
  }
 
    
    // setSubmitLoading(true);
    // // const { image} = video;
    // // const imageType = image?.type;
    // if(formData == null||""){
    //   alert("Product name required!");
    //   setSubmitLoading(false);
    //   return;
    // }
    // if(status.name==="Select Category"){
    //   alert("Select Category!");
    //   setSubmitLoading(false);
    //   return;
    // }
    // if(type===null||"Select Product Type"){
    //   alert("Select Product Type!");
    //   setSubmitLoading(false);
    //   return;
    // }
    // if(sub===null||"Select Sub Category"){
    //   alert("Select Sub Category!");
    //   setSubmitLoading(false);
    //   return;
    // }
    // if(formData.values.product_description===null||""){
    //   alert("Product description required!");
    //   setSubmitLoading(false);
    //   return;
    // }
    // if(formData.values.hsn===null||""){
    //   alert("Product description required!");
    //   setSubmitLoading(false);
    //   return;
    // }
    // if(formData.values.gst===null||""){
    //   alert("Product description required!");
    //   setSubmitLoading(false);
    //   return;
    // }
    // if(formData.values.priority===null||""){
    //   alert("Product description required!");
    //   setSubmitLoading(false);
    //   return;
    // }
    // if (video === null) {
    //   alert("All fields are required!");
    //   setSubmitLoading(false);
    //   return;
    // } else if (
    //   !(
    //     video?.type === "image/png" ||
    //     video?.type === "image/jpeg" ||
    //     video?.type === "image/jpg"
    //   )
    // ) {
    //   alert("Image format must be either png, jpeg or jpg!");
    //   setSubmitLoading(false);
    //   return;
    //   }else {
    //     var storage = firebase.storage();
    //     var storageRef = storage.ref();
    //     var uploadTask = storageRef.child("imageUrl/" + video.name).put(video);
    //     uploadTask.on(
    //       firebase.storage.TaskEvent.STATE_CHANGED,
    //       (snapshot) => {
    //         console.log(snapshot);
    //         var progress =
    //           Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         // setProgress(progress);
    //       },
    //       (error) => {
    //         console.log(error);
    //         alert(error);
    //       },
    //       () => {
    //         uploadTask.snapshot.ref.getDownloadURL().then( async (url) => {

    //         });
    //       }
    //     );
    // }
  };

  const [status, setStatus] = useState({
    name: "Select Category",
    id: "",
  });
  const [type, setType] = useState("");
  const [sub, setSub] = useState("Select Sub Category");
  const [gst, setGst] = useState("");
  const [hsn, setHsn] = useState("");
  const [brand, setBrand] = useState("");
  const [socPrice, setPrice] = useState([PriceData]);
  const [shopPrice, setShopPrice] = useState([shopPriceData]);
  const [hotelPrice, sethotelPrice] = useState([hotelPriceData]);

  const addPrice = () => {
    setPrice([...socPrice, PriceData]);
  };
  const addShopPrice = () => {
    setShopPrice([...shopPrice, shopPriceData]);
  };
  const addHotelPrice = () => {
    sethotelPrice([...hotelPrice, hotelPriceData]);
  };
  const Change = (e, index) => {
    const updateddata = socPrice.map((socPrice, i) =>
      index == i
        ? Object.assign(socPrice, { [e.target.name]: e.target.value })
        : socPrice
    );
    setPrice(updateddata);
  };
  const remove = (index) => {
    const filterdata = [...socPrice];
    filterdata.splice(index, 1);
    setPrice(filterdata);
  };
  const shopChange = (e, index) => {
    const updateddata = shopPrice.map((shopPrice, i) =>
      index == i
        ? Object.assign(shopPrice, { [e.target.name]: e.target.value })
        : shopPrice
    );
    setShopPrice(updateddata);
  };
  const shopremove = (index) => {
    const filterdata = [...shopPrice];
    filterdata.splice(index, 1);
    setShopPrice(filterdata);
  };
  const hotelChange = (e, index) => {
    const updateddata = hotelPrice.map((hotelPrice, i) =>
      index == i
        ? Object.assign(hotelPrice, { [e.target.name]: e.target.value })
        : hotelPrice
    );
    sethotelPrice(updateddata);
  };
  const hotelremove = (index) => {
    const filterdata = [...hotelPrice];
    filterdata.splice(index, 1);
    sethotelPrice(filterdata);
  };
  const updatedStatus = async (s, i) => {
    setStatus({ name: s, id: i });
  };
  const updatedSub = async (s) => {
    setSub(s);
  };
  const updatedType = async (s) => {
    setType(s);
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

  // const onExportVerifiedData = async () => {
  //   const filteredData = state.verified_service_providers
  //     .filter((order) => {
  //       // return Object.keys(tableFilters).reduce((p, c) => {
  //       //   return String(order[c]).includes(tableFilters[c]) && p
  //       // }, true)
  //       for (const filterKey in tableFilters) {
  //         console.log(
  //           String(order[filterKey]).search(
  //             new RegExp("tableFilters[filterKey]", "i")
  //           )
  //         );
  //         if (
  //           String(order[filterKey]).search(
  //             new RegExp(tableFilters[filterKey], "i")
  //           ) >= 0
  //         ) {
  //           continue;
  //         } else {
  //           return false;
  //         }
  //       }
  //       return true;
  //     })
  //     .map((order) => ({
  //       phone: order.phone,
  //       name: order.name,
  //       location: order.location,
  //     }));

  //   exportDataToXLSX(filteredData, "verifiedOrdersList");
  // };

  // const onExportUnverifiedData = async () => {
  //   const filteredData = state.unverified_service_providers
  //     .filter((order) => {
  //       // return Object.keys(tableFilters).reduce((p, c) => {
  //       //   return String(order[c]).includes(tableFilters[c]) && p
  //       // }, true)
  //       for (const filterKey in tableFilters) {
  //         console.log(
  //           String(order[filterKey]).search(
  //             new RegExp("tableFilters[filterKey]", "i")
  //           )
  //         );
  //         if (
  //           String(order[filterKey]).search(
  //             new RegExp(tableFilters[filterKey], "i")
  //           ) >= 0
  //         ) {
  //           continue;
  //         } else {
  //           return false;
  //         }
  //       }
  //       return true;
  //     })
  //     .map((order) => ({
  //       phone: order.phone,
  //       name: order.name,
  //       location: order.location,
  //     }));

  //   exportDataToXLSX(filteredData, "unVerifiedOrdersList");
  // };



  return (
    <CRow style={{ backgroundColor: "#f1f2f7" }}>
      <CCol xl={12}>
        <CCard>
          <CCardHeader
            style={{
              fontWeight: "bold",
              backgroundColor: "#f7f7f7",
              fontSize: "1.1rem",
              color: "black",
            }}
          >
            Add Product
          </CCardHeader>
          <CCardBody>
            <CForm id="form"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}>
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Name </CLabel>
                  </CCol>
                  <CCol sm={4}>
                    <CInput
                      required 
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
                        {status.name}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>Select category</CDropdownItem>
                        <CDropdownItem divider />
                        {cat &&
                          cat.map((cat, index) => {
                            return (
                              <CDropdownItem
                              required
                                onClick={() => updatedStatus(cat.name, cat.id)}
                              >
                                {cat.name}
                              </CDropdownItem>
                            );
                          })}
                      </CDropdownMenu>
                    </CDropdown>
                  </CCol>
                </CRow>
                {/* <CLabel style={{ fontWeight: "bold" }}>Name </CLabel>
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
                  /> */}
              </CFormGroup>
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Select Sub Category </CLabel>
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
                        {sub}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>Select category</CDropdownItem>
                        <CDropdownItem divider />
                        {cat
                          .filter((x) => x.id === status.id)
                          .map((sub) => {
                            return sub.subCategory.map((sub1) => {
                              return (
                                <CDropdownItem onClick={() => updatedSub(sub1)}>
                                  {sub1}
                                </CDropdownItem>
                              );
                            });
                          })}
                      </CDropdownMenu>
                    </CDropdown>
                  </CCol>
                  <CCol md="2">
                    <CLabel>Product Image</CLabel>
                  </CCol>
                  <CCol sm={3}>
                    <ImageCrop/>
                    
                  {/* <CInputFile
                    type="file"
                    multiple onChange={handleChange}
                  />     */}
                                
                    {/* <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#f8b11c",
                              borderColor: "#f8b11c",
                              marginTop: "5px",
                              borderRadius: "0.25rem",
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={handleUpload}
                          >
                            Upload
                          </CButton> */}
                          <CLabel onClick={handleUpload}>{window.setImage.name}</CLabel>
                          
                    {/* <button onClick={() =>handleUpload}>Upload</button> */}
                    
                  </CCol>
                </CRow>
              </CFormGroup>
              {/* <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Product Description</CLabel>
                  </CCol>
                  <CCol sm={10}>
                     <p>Preview Canvas Crop </p>
                  <canvas ref={imagePreviewCanvasRef}></canvas>
                  </CCol>
                </CRow>
              </CFormGroup> */}
              <CFormGroup>
                <CRow className="g-3 align-items-center">
                  <CCol md="2">
                    <CLabel>Product Description </CLabel>
                  </CCol>
                  <CCol sm={10}>
                    <CTextarea
                      required 
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
                <CCol md="2">
                  <CLabel>Product Type </CLabel>
                </CCol>
                <CCol md="4">
                  <CFormGroup>
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
                        {type===""?"Select Product Type":type}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>
                          Select product type
                        </CDropdownItem>
                        <CDropdownItem divider />
                        {gdata
                          .filter((x) => x.id === "data")
                          .map((sub) => {
                            return sub.types.map((sub1) => {
                              return (
                                <CDropdownItem
                                  onClick={() => updatedType(sub1)}
                                >
                                  {sub1}
                                </CDropdownItem>
                              );
                            });
                          })}
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
                        {hsn===""?"Select HSN Number":hsn}
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
                      value={formData.values.priority===""?formData.values.priority=1:formData.values.priority}
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
              <CCol xl={12} style={{ backgroundColor: "#f1f1f1" }}>
                <CCardHeader
                  style={{ fontWeight: "bold", backgroundColor: "#f1f1f1" }}
                >
                  Society User Type Price
                </CCardHeader>
                <CCardBody>
                  {socPrice.map((socPrice, index) => (
                    <CRow className="row g-3" key={index}>
                      <CCol md={2}>
                        <CLabel>Product Unit</CLabel>
                        <CInputGroup className="mb-3">
                          <CInput
                            // required
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
                          <select
                            name="unit"
                            id={socPrice.unit}
                            data-id={index}
                            onClick={(e) => {
                              Change(e, index);
                            }}
                            style={{ width: "40%", backgroundColor: "#fff" }}
                          >
                            {gdata
                              .filter((x) => x.id === "data")
                              .map((sub) => {
                                return sub.units.map((sub1) => {
                                  return <option value={sub1}>{sub1}</option>;
                                });
                              })}
                          </select>
                        </CInputGroup>
                      </CCol>
                      <CCol md={2}>
                        <CLabel>Original Price</CLabel>
                        <CInput
                          // required
                          type="text"
                          placeholder="Original Price(Rs.)"
                          name="originalPrice"
                          value={socPrice.originalPrice}
                          onChange={(e) => {
                            Change(e, index);
                            socPrice.discountedPrice = (
                              socPrice.originalPrice - socPrice.discount
                            ).toString();
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
                            socPrice.discountedPrice = (
                              socPrice.originalPrice - socPrice.discount
                            ).toString();

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
                          disabled
                          readOnly
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
                        {index === 0 ? (
                          <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#f8b11c",
                              borderColor: "#f8b11c",
                              marginTop: "28px",
                              borderRadius: "0.25rem",
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={addPrice}
                          >
                            Add
                          </CButton>
                        ) : (
                          <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                              marginTop: "28px",
                              borderRadius: "0.25rem",
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={() => remove(index)}
                          >
                            Delete
                          </CButton>
                        )}
                      </CCol>
                    </CRow>
                  ))}
                </CCardBody>
                <CCardHeader
                  style={{ fontWeight: "bold", backgroundColor: "#f1f1f1" }}
                >
                  Shop User Type Price
                </CCardHeader>
                <CCardBody>
                  {shopPrice.map((shopPrice, index) => (
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
                          <select
                            name="unit"
                            id={shopPrice.unit}
                            data-id={index}
                            onClick={(e) => {
                              shopChange(e, index);
                            }}
                            style={{ width: "40%", backgroundColor: "#fff" }}
                          >
                            {gdata
                              .filter((x) => x.id === "data")
                              .map((sub) => {
                                return sub.units.map((sub1) => {
                                  return <option value={sub1}>{sub1}</option>;
                                });
                              })}
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
                            shopPrice.discountedPrice = (
                              shopPrice.originalPrice - shopPrice.discount
                            ).toString();
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
                            shopPrice.discountedPrice = (
                              shopPrice.originalPrice - shopPrice.discount
                            ).toString();
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
                          disabled
                          readOnly
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
                        {index === 0 ? (
                          <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#f8b11c",
                              borderColor: "#f8b11c",
                              marginTop: "28px",
                              borderRadius: "0.25rem",
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={addShopPrice}
                          >
                            Add
                          </CButton>
                        ) : (
                          <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                              marginTop: "28px",
                              borderRadius: "0.25rem",
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={() => shopremove(index)}
                          >
                            Delete
                          </CButton>
                        )}
                      </CCol>
                    </CRow>
                  ))}
                </CCardBody>
                <CCardHeader
                  style={{ fontWeight: "bold", backgroundColor: "#f1f1f1" }}
                >
                  Hotel User Type Price
                </CCardHeader>
                <CCardBody>
                  {hotelPrice.map((hotelPrice, index) => (
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
                          <select
                            name="unit"
                            id={hotelPrice.unit}
                            data-id={index}
                            onClick={(e) => {
                              hotelChange(e, index);
                            }}
                            style={{ width: "40%", backgroundColor: "#fff" }}
                          >
                            {gdata
                              .filter((x) => x.id === "data")
                              .map((sub) => {
                                return sub.units.map((sub1) => {
                                  return <option value={sub1}>{sub1}</option>;
                                });
                              })}
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
                            hotelPrice.discountedPrice = (
                              hotelPrice.originalPrice - hotelPrice.discount
                            ).toString();
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
                            hotelPrice.discountedPrice = (
                              hotelPrice.originalPrice - hotelPrice.discount
                            ).toString();
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
                          disabled
                          readOnly
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
                        {index === 0 ? (
                          <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#f8b11c",
                              borderColor: "#f8b11c",
                              marginTop: "28px",
                              borderRadius: "0.25rem",
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={addHotelPrice}
                          >
                            Add
                          </CButton>
                        ) : (
                          <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                              marginTop: "28px",
                              borderRadius: "0.25rem",
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={() => hotelremove(index)}
                          >
                            Delete
                          </CButton>
                        )}
                      </CCol>
                    </CRow>
                  ))}
                </CCardBody>
              </CCol>
              <CFormGroup>
                <CCol md={12} style={{ display: "flex" }}>
                  {submitLoading ? (
                    <CSpinner size="small" color="info" />
                  ) : (
                    <CButton
                      type="submit"
                      style={{
                        color: "#fff",
                        backgroundColor: "#f8b11c",
                        borderColor: "#f8b11c",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "10px",
                      }}
                      disabled={submitLoading}
                    >
                      Submit
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

export default ServiceProviders;