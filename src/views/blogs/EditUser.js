import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  CBadge,
  CImg,
  CInputGroup,
  CForm,
  CLabel,
  CInput,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CSpinner,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useFormik } from "formik";

const EditUser = (props) => {
    // console.log(props.location.state);
    // console.log(props.location.id);

  const history = useHistory();
  var [cat, setCat] = useState([]);
  var [gdata, setData] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState("");
  // const [details, setDetails] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });
  const [status, setStatus] = useState({
    name: props.location.state.type,
    id: "",
  });
  const [sub, setSub] = useState("Select Sub Category");

  const initialFormData = {
    name: props.location.state.name,
    mobile:props.location.state.phno,
    email:props.location.state.email,
    wallet:props.location.state.wallet,
    // type:props.location.state.type,
    pincode:props.location.state.pincode,
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });

  useEffect(() => {
    // getVideos();
    // getData();
  }, []);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("users").orderBy("date", "desc").limit(50).get();
    setLastOrder(videos.docs[videos.docs.length - 1]);
    // setLastOrder([videos.docs.length-1]);
    // console.log(videos.docs.length);
    // console.log(lastOrder);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        name: videoData.name,
        fno:videoData.flatNo,
        wing: videoData.wing,
        soc: videoData.societyName,
        // email: videoData.email,
        // username: videoData.username,
      };
    });

    // resolvedVideos = resolvedVideos.sort(compare);
    // console.log(resolvedVideos);

    setState({
      ...state,
      videos: resolvedVideos,
    });
    setLoading(false);
    // console.log(videos);
  };

  const getData = async () => {
    const response = await firebase.firestore().collection("centers");
    const data = await response.get();
    data.docs.forEach((item) => {
      cat.push({ docId: item.id, ...item.data() });
    });
    setCat([...cat, cat]);
    // console.log(cat);
    // const response=await firebase.firestore().collection("centers");
    // const data=await response.get();
    // data.docs.forEach(item=>{
    //   gdata.push({id:item.id,...item.data()});
    // })
    // setData([...gdata,gdata])
  };
  const updatedStatus = async (s, i,a) => {
    setStatus({ name: s, id: i });
  };
  const updatedSub = async (s) => {
    setSub(s);
  };
//   const getUnits = () =>{
//     cat.filter(x => x.id === 'data').map( sub =>{
//         return( 
          
//         )
//       })
//       console.log(cat);
//   }
  const deleteVideo = () => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("User").doc(props.location.state.id).delete();
                alert("User Deleted");
                history.goBack();
          },
        },
        {
          label: "No",
          // onClick: () => alert("Close"),
        },
      ],
      // childrenElement: () => <div />,
      // customUI: ({ onClose }) => <div>Custom UI</div>,
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
      // overlayClassName: "overlay-custom-class-name"
    });

  };
  const edit = async (e) => {
    e.preventDefault();
    await firebase.firestore().collection("User").doc(props.location.state.id).update({

    name:formData.values.name ,
    phone:formData.values.mobile,
    // email:formData.values.email,
    wallet:formData.values.wallet,
    type:status.name
    });
    alert("User Data Updated!")
    history.goBack();
  };

  // const toggleDetails = (index) => {
  //   const position = details.indexOf(index);
  //   let newDetails = details.slice();
  //   if (position !== -1) {
  //     newDetails.splice(position, 1);
  //   } else {
  //     newDetails = [...details, index];
  //   }
  //   setDetails(newDetails);
  // };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
            <span className="font-xl">User Details</span>
                <span>
                <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",float:"right"}} type="button" color="secondary" variant="outline" onClick={()=>deleteVideo()} >Remove User</CButton>
                {/* <CButton
                    color="primary"
                    // onClick={() => history.push("/users/create-user")}
                >
                    Create User
                </CButton> */}
                </span>
        </CCardHeader>
          <CCardBody>
          <CForm className="row g-3">
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Name</CLabel>
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
                <CCol md={6}>
                    <CLabel htmlFor="inputPassword4">Mobile No</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="Mobile No"
                      name="mobile"
                      value={formData.values.mobile}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                {/* <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Email</CLabel>
                    <CInput
                      required 
                      type="email"
                      placeholder="Email"
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
                <CCol md={6}>
                    <CLabel htmlFor="inputPassword4">GST No</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="GST No"
                      name="gst"
                      value={formData.values.gst}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol> */}
                <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Society Name</CLabel>
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
                        <CDropdownItem header>Select Type</CDropdownItem>
                        <CDropdownItem divider />
                        <CDropdownItem
                                onClick={() => updatedStatus("User")}
                              >
                                User
                              </CDropdownItem>
                        <CDropdownItem
                          onClick={() => updatedStatus("Vendor")}
                        >
                          Vendor
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                    {/* <CInput
                      required 
                      type="text"
                      placeholder="Society Name"
                      name="societyName"
                      value={formData.values.societyName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    /> */}
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputPassword4">Wallet</CLabel>
                    <CInput
                      required 
                      type="number"
                      placeholder="wallet"
                      name="wallet"
                      value={formData.values.wallet}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                {/* <CCol md={6}>
                    <CLabel htmlFor="inputEmail4">Flat NO</CLabel>
                    <CInput
                      required 
                      type="number"
                      placeholder="Flat No"
                      name="fno"
                      value={formData.values.fno}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    />
                </CCol>
                <CCol md={6}>
                    <CLabel htmlFor="inputZip">Pincode</CLabel>
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

                <CCol xs={12}>
                    <CLabel htmlFor="inputAddress">Address</CLabel>
                    <CInput
                      required 
                      type="text"
                      placeholder="Address"
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
                </CCol> */}
                {/* <CCol xs={12}>
                    <CFormCheck type="checkbox" id="gridCheck" label="Check me out"/>
                </CCol> */}
                <CCol xs={12}  style={{ display: "flex" }}>
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
                      onClick={edit}
                    //   disabled={submitLoading}
                    >
                      Update
                    </CButton>
                </CCol>
                </CForm>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginBlock: 10,
              }}
            >
              {pageLoading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <p hidden></p>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default EditUser;
