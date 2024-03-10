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
  CCheck,
  CTextarea
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useHistory } from "react-router";
import { useFormik } from "formik";
import "./style.css";


const EditHotel = (props) => {
    console.log(props.location.state);
  const db = firebase.firestore();

  const history = useHistory();
  
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  var [cat, setCat] = useState([]);
  const [subcat, setSub] = useState([]);
  const [value,onChange]=useState(1);
  const initialFormData = {
    centerName: props.location.state.centerName,
    address:props.location.state.address,
    pincode:props.location.state.pincode,
    time:props.location.state.deliveryTime,
    contact:props.location.state.contact,
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });




  useEffect(()=>{
    const ele = document.querySelector('.buble');
  if (ele) {
    ele.style.left = `${Number(value / 4)}px`;
  }
})

//   const PriceData = {""}

  const [status, setStatus] = useState({
    name: "Select Category",
    id:"",
  });
  const [socPrice, setPrice] = useState([props.location.state.deliveryDays]);
  const updatedStatus = async (s,i) => {
    setStatus({name:s,id:i})
    // console.log(status.name);
  
  };
  const addPrice = () => {   
   
  };

  const checkbox = (e) => {
    const checked = e.target.checked;
    if(checked == true){
        socPrice.push(e.target.value);
        setPrice([...socPrice]);
        console.log(socPrice);
    }else if(checked == false){
        let filteredArray = socPrice.filter(item => item !== e.target.value)
        setPrice([socPrice.splice(item => item == e.target.value)]); 
        socPrice.push(filteredArray);
        setPrice(filteredArray);
        console.log(socPrice);
    }
    // console.log(checked);
    // // to get the checked value
    // const checkedValue = e.target.value;
    // console.log(checkedValue);
    
    // // to get the checked name
    // const checkedName = e.target.name;
    // console.log(checkedName);
    // const value = e.target.value;
    // console.log(value);
    // setPrice([...socPrice,value]);
    // console.log(socPrice);
  };


  const handleSubmit = async (e) => {
      console.log("clicked");
    e.preventDefault();
    setSubmitLoading(true);
    // try {
        // socPrice.forEach(async(item)=>{
            await firebase.firestore().collection("centers").doc(props.location.state.id).update({
                address:formData.values.address,
                centerName:formData.values.centerName,
                contact:formData.values.contact,
                delFlag:0,
                deliveryDays:socPrice.toString(),
                deliveryTime:formData.values.time,
                isActive:true,
                pincode:formData.values.pincode,    
            });
            // console.log(item.subCategory);
        // })
        alert("Hotel Updated!");
    //   }catch (error) {
    //   }
      history.push("/delivery/hotel");
  };
//   $( ".delivery-range" ).slider({
//     range: true,
//     min: 1,
//     max: 24,
//     values: [if($delivery_time != ''){ echo explode('-', $delivery_time)[0].','.explode('-', $delivery_time)[1]; }else{ echo '1, 24'; } ?>],
//     slide: function( event, ui ) {
//       $( ".delivery_time" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
//     }
// });
// $( ".delivery_time" ).val($( ".delivery-range" ).slider( "values", 0 ) + " - " + $( ".delivery-range" ).slider( "values", 1 ) );

  const style = {
    // Adding media querry..
    '@media (min-width: 500px)': {
        textAlign: 'end',
    },
    };

  return (
    <CCard>
      <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Update Hotels</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                        <CCol md="2" sm="6">
                            <CLabel>Enter Hotel Name</CLabel>
                        </CCol>
                        <CCol md="4" sm={6}>
                          <CInputGroup className="mb-3">
                            <CInput
                                    type="text"
                                    placeholder="Enter Center Name"
                                    name="centerName"
                                    value={formData.values.centerName}
                                    onChange={(e) => {
                                        formData.handleChange(e);
                                      // setFormData({
                                      //   ...formData.values,
                                      //   name: e.target.value
                                      // })
                                    }}
                                    />
                                    
                          </CInputGroup>
                        </CCol>
                        <CCol md="2" sm="6">
                            <CLabel>Address/Area</CLabel>
                        </CCol>
                        <CCol md="4" sm={6}>
                          <CInputGroup className="mb-3"  >
                            <CTextarea
                                    type="text"
                                    placeholder="Enter Address/Area"
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
                                    
                          </CInputGroup>
                        </CCol>
                    </CRow>
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
          <CCol md="2" sm="6">
                    <CLabel>Contact</CLabel>
                </CCol>
                    <CCol md="4" sm={6}>
                    <CInput
                        placeholder="Enter Contact No"
                      name="contact"
                      value={formData.values.contact}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}/>
                </CCol>
            <CCol md="2" sm="6">
                    <CLabel htmlFor="inputZip">Pincode</CLabel>
                </CCol>
                    <CCol md="4" sm={6}>
                    <CInput id="inputZip"
                        placeholder="Pincode"
                      name="pincode"
                      value={formData.values.pincode}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}/>
                </CCol>
                </CRow>
          </CFormGroup>
          <CFormGroup>
                <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Delivery Time Slots</CCardHeader>              
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                        <CCol md="2" sm="6">
                            <CLabel>Day</CLabel>
                        </CCol>
                        <CCol md="10" sm={6}>
                          <CInputGroup className="mb-3">
                          <table class="table table-bordered table-striped">
                            <tbody>
                                <tr>
                                <td>Sunday</td>
                                <td>Monday</td>
                                <td>Tuesday</td>
                                <td>Wednesday</td>
                                <td>Thursday</td>
                                <td>Friday</td>
                                <td>Saturday</td>
                                </tr>
                                <tr>
                                
                                <td><CInput type="checkbox" name="sunday" defaultChecked={props.location.state.deliveryDays.includes("Sunday")?true:false}  value="Sunday" onChange={(e)=>checkbox(e)}/></td>
                                <td><CInput type="checkbox" name="monday" defaultChecked={props.location.state.deliveryDays.includes("Monday")?true:false} value="Monday" onChange={(e)=>checkbox(e)}/></td>
                                <td><CInput type="checkbox" name="tuesday" defaultChecked={props.location.state.deliveryDays.includes("Tuesday")?true:false}  value="Tuesday" onChange={(e)=>checkbox(e)}/></td>
                                <td><CInput type="checkbox" name="wednesday" defaultChecked={props.location.state.deliveryDays.includes("Wednesday")?true:false}  value="Wednesday" onChange={(e)=>checkbox(e)}/></td>
                                <td><CInput type="checkbox" name="thursday" defaultChecked={props.location.state.deliveryDays.includes("Thursday")?true:false}  value="Thursday" onChange={(e)=>checkbox(e)}/></td>
                                <td><CInput type="checkbox" name="friday"  defaultChecked={props.location.state.deliveryDays.includes("Friday")?true:false} value="Friday" onChange={(e)=>checkbox(e)}/></td>
                                <td><CInput type="checkbox" name="saturday" defaultChecked={props.location.state.deliveryDays.includes("Saturday")?true:false}  value="Saturday" onChange={(e)=>checkbox(e)}/></td>
                                </tr>
                            </tbody>
                            </table>       
                          </CInputGroup>
                        </CCol>
                    </CRow>
          </CFormGroup>
          <CFormGroup>
          <CRow className="g-3 align-items-center">
                        <CCol md="2" sm="6">
                            <CLabel>Time</CLabel>
                        </CCol>
                        <CCol  md="4" sm={6}>
                                <CInput
                                    type="text"
                                    placeholder="Enter Time"
                                    name="time"
                                    value={formData.values.time}
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
          {/* <CFormGroup>
                 <div className="slider-parent">
                    <input type="range" min="1" max="24" value={value}
                        onChange={({ target: { value: radius } }) => {
                                    onChange(radius);
                                }}
                    />
                    <div className="buble"> 
                    {value}
                    </div>
                </div>
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

export default EditHotel;
