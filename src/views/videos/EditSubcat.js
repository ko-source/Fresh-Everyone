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
  CInputGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CInputFile
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";
import ImageCrop from './ImageCrop'

window.vname = 0;
[window.setVideo] = [];
export function image64fsub (image64) {
  // console.log(image64);
    window.setVideo=image64;
    window.vname=1;
}

const EditSubcat = (props) => {
  const db = firebase.firestore();

  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState([]);
  var [cat, setCat] = useState([]);
  const [subcat, setSub] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const PriceData = {subCategory : "",}

  const [status, setStatus] = useState({
    name: "Select Services",
    id:"Select Services",
  });
  const initialFormData = {
    cname: props.location.state.quote,
    priority:""
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });
  const [socPrice, setPrice] = useState([PriceData]);
  const updatedStatus = async (i) => {
    setStatus({id:i})
    // console.log(status.name);
  
  };
  const addPrice = () => {   
    setPrice([...socPrice, PriceData]);
  };
  const Change = (e, index) =>{
    const updateddata = socPrice.map((socPrice,i) => index == i ?
    Object.assign(socPrice,{[e.target.name]: e.target.value}) : socPrice );
    setPrice(updateddata);
  };
  const remove = (index) => {
    const filterdata = [...socPrice];
    filterdata.splice(index,1);
    setPrice(filterdata);
  };
  
  const getOrders = async () => {
    const response=await firebase.firestore().collection("Services");
    const data=await response.get();
    data.docs.forEach(item=>{
      cat.push({id:item.id,...item.data()});
    })
    setCat([...cat,cat])
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // setSubmitLoading(true);
  //   try {
  //       socPrice.forEach(async(item)=>{
  //           await firebase.firestore().collection("categories").doc(status.id).update({
  //               subCategory : firebase.firestore.FieldValue.arrayUnion(item.subCategory)
                
  //           });
  //           // console.log(item.subCategory);
  //       })
  //       alert("Subcategory Added");
  //     }catch (error) {
  //     }
  //     history.push("/videos/sub-category");
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    if (window.vname == 0) {
      try {
        await firebase.firestore().collection("previousQuotes").doc(props.location.state.id).update({
          quote:formData.values.cname,
          // time: new Date(),
          // imageUrl:url
        });
      }catch (error) {
      }
      history.push("/videos/sub-category");
      return;
    }else {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child("categoriesImages/" + Date.now()).put(window.setVideo);
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
              await firebase.firestore().collection("previousQuotes").doc(props.location.state.id).update({
                quote:formData.values.cname,
                // time: new Date(),
                imageUrl:url
              });
            }catch (error) {
            }
            history.push("/videos/sub-category");;
          });
        }
      );
    }
  };
  const style = {
    // Adding media querry..
    '@media (min-width: 500px)': {
        textAlign: 'end',
    },
    };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Update Quotes</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          {/* <CFormGroup>
          <CRow className="g-3 align-items-center">
          <CCol md="6" sm="2">
                  <CLabel style={style}>Select Services</CLabel>
                </CCol>
                <CCol sm={4}>
                  <CDropdown className="mt-2">
                              <CDropdownToggle
                                style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}
                                caret
                                varient={"outline"}
                              >
                                {status.id}
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem header>Select Services</CDropdownItem>
                                <CDropdownItem divider />
                                {
                                  cat && cat.map((cat,index)=>{
                                    return(
                                      <CDropdownItem onClick={() => updatedStatus(cat.id)}>{cat.id}</CDropdownItem>
                                    )
                                  })
                                }
                              </CDropdownMenu>
                    </CDropdown>
                </CCol>
          </CRow>
          </CFormGroup> */}
          <CFormGroup>
                    <CRow className="g-3 align-items-center">
                        <CCol md="6" sm="4">
                            <CLabel>Enter Quote</CLabel>
                        </CCol>
                        <CCol sm={5}>
                          <CInputGroup className="mb-3">
                            <CInput
                                    type="text"
                                    placeholder="Enter Quote"
                                    name="cname"
                                    value={formData.values.cname}
                                    onChange={(e) => {
                                      formData.handleChange(e);
                                    }}
                                    />      
                          </CInputGroup>
                        </CCol>
                    </CRow>
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                <CCol md="6" sm="2" style={{textAlign: "end"}}>
                  <CLabel>Upload Image </CLabel>
                </CCol>
            <CCol sm={4}>
                <ImageCrop/>
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
                <CCol sm={3}>
                  {/* { (video===null)? */}
                    <CImg
                        rounded="true"
                        src={props.location.state.imageUrl}
                        width={200}
                        height={100}
                    />
                    {/* :<div></div>
                  } */}
                </CCol>
              </CRow>
              </CFormGroup>
          {/* <CFormGroup>
            <CRow className="g-3 align-items-center">
              <CCol md="6" sm="2">
                <CLabel style={style}>Upload Image</CLabel>
              </CCol>
              <CCol sm={4}>
                <CInputFile
                  type="file"
                  aria-label="Upload"
                  onChange={(e) =>
                    setVideo(e.target.files[0])}
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

export default EditSubcat;
