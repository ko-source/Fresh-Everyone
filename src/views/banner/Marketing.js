import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CForm,
  CRow,
  CFormGroup,
  CLabel,
  CInput,
  CInputGroup,
  CButton,
  CProgress,
  CProgressBar,
  CSpinner,
  CTextarea,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import ServiceName from "../ServiceNameComponent";
import SubServiceName from "../SubServiceNameComponent";
import firebase from "../../config/fbconfig";

// import { getMessaging, getToken } from "../../config/fbconfig";
import CustomerName from "../CustomerNameComponent";
import { useFormik } from "formik";

const Marketing = (props) => {
  const history = useHistory();

  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const PriceData = { mobile: "" };
  const [mobile, setMobile] = useState([PriceData]);

  const [state, setState] = useState({
    orders: null,
    users: null,
  });
  const initialFormData = {
    message: "",
  };

  const formData = useFormik({
    initialValues: initialFormData,
  });

  useEffect(() => {
    // getOrders();
    getSocietyName();
  }, []);
  const [cat, setCat] = useState([]);
  const getSocietyName = async () => {
    const response = await firebase.firestore().collection("centers").orderBy("centerName");
    const data = await response.get();
    data.docs.forEach((item) => {
      cat.push({ docId: item.id, ...item.data() });
    });
    setCat([...cat, cat]);
  };

  const [para, setPara] = useState("");
  const [market, setMarket] = useState("");
  const selectSociety = async (s) => {
    setPara(s);

    // const users = await firebase.firestore().collection("users").where("userType","==",s).get();
  };

  // console.log(para);


  // console.log(market);
  let mob1 = [];
  const [mob, setMob] = useState([]);
  const addNumbers = async () => {
    const users = await firebase
      .firestore()
      .collection("users")
      .where("societyName", "==", para)
      .get();
    users.docs.map((user) => {
      mob1.push(user.data().firebaseToken);
      setMob(mob1);
    });

    //  const resolvedUsers = users.docs.map((user) => {
    //   const id = user.id;
    //   const userData = user.data();

    //   return {
    //     ...userData,
    //     id: id,
    //     customerName: userData.name,
    //     customerNumber:userData.mobile,
    //     customerToken:userData.firebaseToken,
    //     societyName: userData.societyName,
    //     userType:userData.userType,
    //     address:userData.address,
    //     centerId:userData.centerId,
    //     customerEmail:userData.email,
    //     wing:userData.wing,
    //     flatNo:userData.flatNo
    //   };
    // });
    // // Object.assign(gdata=resolvedUsers)
    // setData(resolvedUsers);
    // setRefresh(!refresh);
  };
  const selectTypeAll = async (s) => {
    setMarket(s);
    const users = await firebase.firestore().collection("user").get();
    users.docs.map((user) => {
      mob1.push(user.data().token);
      setMob(mob1);
    });
  };
  const selectType = async (s1) => {
    setMarket(s1);
    const users = await firebase.firestore().collection("vendor").get();
    users.docs.map((user) => {
      mob1.push(user.data().token);
      setMob(mob1);
    });

    // const users = await firebase.firestore().collection("users").where("userType","==",s).get();
  };
  const selectTypeMultiple = async (s) => {
   
    // setMarket(s);
    const users = await firebase.firestore().collection("users").where("societyName" , "==" , s).get();
    // console.log(users)
    users.docs.map((user) => {
      mob.push(user.data().firebaseToken);
      setMob([...mob , mob]);
    });
  };
  
  // console.log(mob1);
  const [oneData, setOneData] = useState("");
  const addOne = async (s) => {
    const users = await firebase
      .firestore()
      .collection("users")
      .where("mobile", "==", oneData)
      .get();
    users.docs.map((user) => {
      mob1.push(user.data().firebaseToken);
      setMob(mob1);
    });
  };
  const [commonTitle, setCommonTitle] = useState("Important Announcements");
  const [comm, setComm] = useState("");
  const setCommonMessage = async (s) => {
    setComm(s);

    // const users = await firebase.firestore().collection("users").where("userType","==",s).get();
  };
  firebase.messaging().onMessage((res) => {
    console.log(res);
  });

  // console.log(fbtoken1)
  const [userDetails, setUserDetails] = useState();
  const sendNotificationDelivery = async () => {
    const data = await firebase.firestore().collection("users").get();
    data.docs.map((result)=>{
      let body = {
        to : result.data().token,
        notification : {
          title : commonTitle,
          body : comm
        }
      }
      let options ={
        method: "POST",
        headers: new Headers({
        Authorization:"key=AAAABrXMI_I:APA91bFJDmK_680sXhRjX7gjT8ho4J5zfobrTRcQwcsK2NqJgoFutZlVG_8daPhELHX83DbJ5gPn8ytLRqD4kMmKSjYAT71LNv7GRjnjV1goY434Wm-PM-tS-1zHg5tgADLDh-gXGd9g",
        "Content-Type":"application/json"
      }),
      body:JSON.stringify(body)
      }
      fetch("https://fcm.googleapis.com/fcm/send", options).then(res=>res.json()).then(data=>{
        // var ref = firebase.firestore().collection("users").doc(result.data().customerId).collection("notifications").doc();
        // var myId = ref.id;
        // // try {
        //         ref.set({
        //           date:new Date(),
        //           message: deliveryMessage,
        //           notification_id:myId,
        //           orderId:id1
        //         });
        console.log(data);
        setComm("");
        setMob([]);
        }).catch(e=>console.log(e))
      //  console.log(body)
      // console.log(res.data())
      // setUserDetails(res.data().customerToken)
    })
  };

  const addPrice = () => {
    setMobile([...mobile, PriceData]);
  };
  const Change = (e, index) => {
    const updateddata = mobile.map((mobile, i) =>
      index == i
        ? Object.assign(mobile, { [e.target.name]: e.target.value })
        : mobile
    );
    setMobile(updateddata);
  };
  const remove = (index) => {
    const filterdata = [...mobile];
    filterdata.splice(index, 1);
    setMobile(filterdata);
  };

  var e1 = document.getElementById("market");
  if (e1) {
    let marketopt = e1.options[e1.selectedIndex].text;
    // console.log(marketopt);
  }

  return (
    <CRow>
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
            Send Notification
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CFormGroup>
              {/* <CRow className="g-3 align-items-center">
              <CCol md="3" sm="12">
                      <CLabel>Select Type</CLabel>
                    </CCol>
                <CCol lg="5" md="3" sm="12">
                  <CDropdown
                    style={{
                      border: "1px solid #d8dbe0",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <CDropdownToggle caret varient={"outline"}>
                      {market === "" ? "Select" : market}
                    </CDropdownToggle>
                    <CDropdownMenu style={{ width: "100%" }}>
                      <CDropdownItem header>Select</CDropdownItem>
                      <CDropdownItem divider />
                      <CDropdownItem onClick={() => selectTypeAll("User")}>
                        User
                      </CDropdownItem>
                      <CDropdownItem onClick={() => selectType("Vendor")}>
                        Vendor
                      </CDropdownItem>{" "}
                      <CDropdownItem onClick={() => selectType("One")}>
                        One
                      </CDropdownItem>
                      <CDropdownItem onClick={() => selectType("Multiple")}>
                        Multiple
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
                </CRow> */}
                <br></br>
                {market == "Society" ? (
                  <div>
                    <CCol lg="5" md="3" sm="12">
                      <CDropdown
                        style={{
                          border: "1px solid #d8dbe0",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <CDropdownToggle caret varient={"outline"}>
                          {para === "" ? "Select Society" : para}
                        </CDropdownToggle>
                        <CDropdownMenu style={{ width: "100%" }}>
                          <CDropdownItem header>Select Society</CDropdownItem>
                          <CDropdownItem divider />
                          {cat.map((it) => (
                            <CDropdownItem
                              onClick={() => selectSociety(it.centerName)}
                            >
                              {it.centerName}
                            </CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      </CDropdown>
                    </CCol>
                    <br></br>
                    <CCol lg="3" md="3" sm="12">
                      <CButton
                        style={{
                          color: "#fff",
                          backgroundColor: "#f8b11c",
                          borderColor: "#f8b11c",
                          borderRadius: "0.25rem",
                        }}
                        type="button"
                        color="secondary"
                        variant="outline"
                        onClick={() => addNumbers()}
                      >
                        Add Society
                      </CButton>
                    </CCol>
                    <br></br>
                  </div>
                ) : (
                  ""
                )}
                {market == "One" ? (
                  <CRow className="g-3 align-items-center">
                    <CCol md="3" sm="12">
                      <CLabel>Enter Mobile Number</CLabel>
                    </CCol>
                    <CCol sm={5}>
                      <CInputGroup className="mb-3">
                        <CInput
                          type="text"
                          placeholder="Enter Mobile Number"
                          name="mobile"
                          onChange={(e) => {
                            setOneData(e.target.value);
                          }}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol lg="3" md="3" sm="12">
                      <CButton
                        style={{
                          color: "#fff",
                          backgroundColor: "#f8b11c",
                          borderColor: "#f8b11c",
                          borderRadius: "0.25rem",
                        }}
                        type="button"
                        color="secondary"
                        variant="outline"
                        onClick={() => addOne()}
                      >
                        Add Number
                      </CButton>
                    </CCol>
                  </CRow>
                ) : (
                  ""
                )}

              {market == "Multiple" ? (
                  <CRow className="g-3 align-items-center">
                  
                  <CCol md={12} lg={6} sm={12}>
                    <CInputGroup className="mb-3">
                    <table class="table table-bordered table-striped">
                      <tbody>
                          
                          {cat !== undefined && cat.map((it) => (
                             <tr>
                             {it.centerName}
                            <CInput type="checkbox" onChange={(e)=>selectTypeMultiple(it.centerName)}/>
                         
                            </tr>
                             
                          ))}
                          
                          
                      </tbody>
                      </table>       
                    </CInputGroup>
                  </CCol>
              </CRow>
                ) : (
                  ""
                )}

                <CRow>
                  <CCol md="3" sm="12">
                  <CLabel htmlFor="inputmessage">Message</CLabel>
                </CCol>
                  <CCol md="8" sm="12">
                    <CTextarea
                      required
                      type="text"
                      placeholder="Enter Message"
                      name="message"
                      value={comm}
                      onChange={(e) => {
                        setCommonMessage(e.target.value);
                      }}
                    />
                  </CCol>
                </CRow>
              </CFormGroup>
              <br></br>
              <CFormGroup>
                <CButton
                  style={{
                    color: "#fff",
                    backgroundColor: "#f8b11c",
                    borderColor: "#f8b11c",
                    borderRadius: "0.25rem",
                    marginRight: "5px",
                    width: "120px",
                    height: "55px",
                  }}
                  type="button"
                  color="secondary"
                  variant="outline"
                  onClick={async () => {
                    await sendNotificationDelivery();
                  }}
                >
                  Send Notification
                </CButton>
              </CFormGroup>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Marketing;
