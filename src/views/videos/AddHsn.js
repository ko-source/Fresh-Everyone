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
  CInputGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";

const AddHsn = () => {
  const db = firebase.firestore();

  const history = useHistory();
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [video, setVideo] = useState(null);
  var [cat, setCat] = useState([]);
  const [subcat, setSub] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const PriceData = {hsn : "",}

  const [status, setStatus] = useState({
    name: "Select Category",
    id:"",
  });
  const [socPrice, setPrice] = useState([PriceData]);
  const updatedStatus = async (s,i) => {
    setStatus({name:s,id:i})
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
    const response=await firebase.firestore().collection("categories");
    const data=await response.get();
    data.docs.forEach(item=>{
      cat.push({id:item.id,...item.data()});
    })
    setCat([...cat,cat])
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setSubmitLoading(true);
    try {
        socPrice.forEach(async(item)=>{
            await firebase.firestore().collection("generalData").doc("hsn").update({
                hsn : firebase.firestore.FieldValue.arrayUnion(item.hsn)
                
            });
            // console.log(item.subCategory);
        })
        alert("HSN Number Added.");
      }catch (error) {
      }
      history.push("/videos/hsn");
  };

  const style = {
    // Adding media querry..
    '@media (min-width: 500px)': {
        textAlign: 'end',
    },
    };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Add HSN Number</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          {/* <CFormGroup>
          <CRow className="g-3 align-items-center">
          <CCol md="6" sm="2">
                  <CLabel style={style}>Select Category</CLabel>
                </CCol>
                <CCol sm={4}>
                  <CDropdown className="mt-2">
                              <CDropdownToggle
                                style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}
                                caret
                                varient={"outline"}
                              >
                                {status.name}
                              </CDropdownToggle>
                              <CDropdownMenu>
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
          </CFormGroup> */}
          <CFormGroup>
                {
                  socPrice.map((socPrice, index)=>(
                    <CRow className="g-3 align-items-center">
                        <CCol md="6" sm="4">
                            <CLabel>Enter HSN Number</CLabel>
                        </CCol>
                        <CCol sm={5}>
                          <CInputGroup className="mb-3" key={index}>
                            <CInput
                                    type="text"
                                    placeholder="Enter HSN Number"
                                    name="hsn"
                                    value={socPrice.hsn}
                                    onChange={(e) => {
                                      Change(e, index);
                                      // setFormData({
                                      //   ...formData.values,
                                      //   name: e.target.value
                                      // })
                                    }}
                                    />
                                    {
                                        index === 0? <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c",marginLeft:"10px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={addPrice}>Add</CButton>
                                        :<CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545",marginLeft:"10px", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => remove(index)}>Delete</CButton>
                                    }
                                    
                          </CInputGroup>
                        </CCol>
                    </CRow>
                  ))
                }
              
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

export default AddHsn;
