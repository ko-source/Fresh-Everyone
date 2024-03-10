import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  CBadge,
  CImg,
  CInputGroup,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CSpinner,
  CSwitch
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import Chart from "react-apexcharts";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Pgprop = () => {
  const history = useHistory();
  var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState("");
  // const [details, setDetails] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
    // getVendors();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("rider")
    .orderBy("createdOn","desc")
    .get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        // accHolderName:videoData.accHolderName,
        // accNo:videoData.accountNo,
        // accType:videoData.accType,
        // address:videoData.address,
        // bankBranchName:videoData.bankBranchName,
        // bankName:videoData.bankName,
        // city:videoData.city,
        // deliveryMode:videoData.deliveryMode,
        dob:new Date(videoData.dob.toDate()).toUTCString(),
        // driverlicense:videoData.driverlicense,
        email:videoData.email,
        gender:videoData.gender,
        // ifscCode:videoData.ifsc,
        // locality:videoData.locality,
        name:videoData.name,
        surName:videoData.surName,
        // panCard:videoData.panCard,
        // panName:videoData.panName,
        phoneNumber:videoData.mobile,
        // pincode:videoData.pincode,
        // shift:videoData.shift,
        // state:videoData.state,
        // tShirtSize:videoData.tShirtSize,
        // token:videoData.token,
        // uid:videoData.uid,
        // value:videoData.value,
        // vehicle:videoData.vehicle,
        imageUrl:videoData.profile,
        block:videoData.isBlock,
        isActive:videoData.verified,
        isOnline:videoData.online
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
  const getVendors = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("vendor").get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        refCode:videoData.refCode,
        // isActive:videoData.block,
        // country: videoData.country,
        // soc: videoData.societyName,
        // email: videoData.email,
        // username: videoData.username,
      };
    });

    // resolvedVideos = resolvedVideos.sort(compare);
    // console.log(resolvedVideos);
    setCat(resolvedVideos);
    setLoading(false);
    // console.log(videos);
  };
  const deleteVideo = (rowId) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            // await firebase.firestore().collection("User").doc(rowId).delete();
            await firebase.firestore().collection("rider").doc(rowId).delete();
            setRefresh(!refresh);
                alert("Vendor Deleted");
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
  const edit = (rowId,index) => {
    history.push(
      {
      pathname: '/blogs/vendor-reviews',
      state: rowId,
      index: index
      }
    )
  };
  const hist = (rowId) => {
    history.push(
      {
      pathname: '/rider-report',
      state: rowId
      }
    )
  };
  const ref = (rowId,code) => {
    history.push(
      {
      pathname: '/emp-hist',
      state: rowId,
      id: code
      }
    )
  };
  let mob1 = [];
  const [mob, setMob] = useState([]);
  const toggle = async(rowId,colId,token) => {
    // console.log(rowId);
    // console.log(colId);
    // mob1.push(token);
    // setMob(mob1);
    // console.log(mob1);
   if(colId===true){
    await firebase.firestore().collection("rider").doc(rowId).update({
      verified:false,
    })
    getVideos();
   }else{
    await firebase.firestore().collection("rider").doc(rowId).update({
      verified:true,
    })
    // await sendNotification()
    getVideos();
   } 
  };
  const toggle2 = async(rowId,colId,token) => {
    // console.log(rowId);
    // console.log(colId);
    // mob1.push(token);
    // setMob(mob1);
   if(colId===true){
    await firebase.firestore().collection("rider").doc(rowId).update({
      isBlock:false,
    })
    getVideos();
   }else{
    await firebase.firestore().collection("rider").doc(rowId).update({
      isBlock:true,
    })
    // await sendNotification()
    getVideos();
   } 
  };
  const [commonTitle, setCommonTitle] = useState("Verified Successfully");
  const [comm, setComm] = useState("Hi, You have been verified by Admin.");
  firebase.messaging().onMessage((res) => {
    // console.log(res);
  });
  const sendNotification = async () => {
    console.log(mob);
    let body = {
      registration_ids: mob,
      notification: {
        title: commonTitle,
        body: comm,
      },
    };
    let options = {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json",
        'Authorization':
          "key=AAAAuqzn3WE:APA91bGU9VP_lHfgvRPsBRdc0V-Brx7IlEHDqKBlSpggq87c12ou-24_V2Xpz8ynymGwXxPlM0ej9o2EjL26AK2BQpPz9oLxJANWmUjJvZJ2IyAT0ZhBSzhjBjMP0wsHYOGI7eItvaKg",
      }),
      //  body:JSON.parse(JSON.stringify(body))
      body: JSON.stringify(body)
      // data: JSON.stringify(msg)
    };
    fetch("https://fcm.googleapis.com/fcm/send", options)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
      })
      .catch((e) => console.log(e));
    // console.log(body);
    // console.log(res.data())
    // setUserDetails(res.data().customerToken)
  };
  const onExportData = async () => {
    const filteredData = state.videos
      .filter((order) => {
        // return Object.keys(tableFilters).reduce((p, c) => {
        //   return String(order[c]).includes(tableFilters[c]) && p
        // }, true)
        for (const filterKey in tableFilters) {
          console.log(
            String(order[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(order[filterKey]).search(
              new RegExp(tableFilters[filterKey], "i")
            ) >= 0
          ) {
            continue;
          } else {
            return false;
          }
        }
        return true;
      })
      .map((order) => ({
        // order.category,
        id:order.id,
        dob:order.dob,
        email:order.email,
        gender:order.gender,
        name:order.name,
        surName:order.surName,
        phoneNumber:order.mobile,
      }));
      // console.log(filteredData);
      exportPDF(filteredData);
    // exportDataToXLSX(filteredData, "ProductList");
  };
  const exportPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Rider List";
    const headers = [["Rider Id","Rider Name","Rider Number","Rider Email","DoB","Gender"]];

    const data = e.map((sub,index) =>[
      // [elt.name + "\n" + elt.number],
      sub.id.slice(0, 7),
      sub.name+sub.surName,
      sub.phoneNumber,
      sub.email,
      sub.dob ,
      sub.gender
      // ["Name : "+sub.bankingDetails.name+"\n Account Number : "+sub.bankingDetails.accountNumber]
  ]);
    // props.location.state.items.map(elt=>
    // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
    // const footer = [["Total Amount: Rs."+props.location.state.amount]]
    // let text = weight[index]
    //     const myArray = text.split(" ");
    //     var temp=sQuantity[index]*myArray[0]


    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    // console.log(content);
    // console.log(data);
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("riderlist.pdf")
  }
  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
        <span className="font-xl">Rider Management</span>
            <span>
              <CButton color="info" className="mb-2 mr-2" onClick={onExportData} style={{ float:"right"}}>
                Export Data
              </CButton>
            </span>
        </CCardHeader>
          <CCardBody>
            {/* <div>

            <Chart
            style = {{marginLeft:"-20px"}}
              options={{
                labels: ['Today Order'+"-"+15, 'Delivered Order'+"-"+20,'Cancelled Order'+"-"+30],
                fill: {
                  type: 'gradient',
                },
              }}
              series={[15, 20,30]}
              type="donut"
              width={350}
            /> 
            </div> */}
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onColumnFilterChange={(e) => {
                setTableFilters(e);
              }}
              onSorterValueChange={(e) => {
                // console.log(e);
              }}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "id", label: "Id", filter: true },
                { key: "image", label: "Image", filter: true },
                { key: "name", label: "Name", filter: true },
                { key: "surName", label: "Name", filter: true },
                { key: "email", label: "Email", filter: true },
                { key: "phoneNumber", label: "Number", filter: true },
                { key: "dob", label: "DOB", filter: true },
                { key: "gender", label: "Gender", filter: true },
                // { key: "accNo", label: "Account No", filter: true },
                { key: "isOnline", label: "Online", filter: true },
                { key: "active", label: "Approved", filter: true },
                { key: "block", label: "Blocked", filter: true },
                // { key: "wallet", label: "Wallet", filter: true },
                // { key: "refCode", label: "Reffered By" },
                { key: "show_delete", label: "Actions" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                id: (item) => (
                  <td>
                    {item.id.slice(0, 7)}
                  </td>
                ),
                image: (item) => (
                  <td>
                    <CImg
                      rounded="true"
                      src={item.imageUrl}
                      width={100}
                      height={100}
                    />
                  </td>
                ),
                name: (item) => (
                  <td>
                    <div>{item.name}</div>
                  </td>
                ),
                surName: (item) => (
                  <td>
                    <div>{item.surName}</div>
                  </td>
                ),
                email: (item) => (
                  <td>
                    <div>{item.email}</div>
                  </td>
                ),
                phoneNumber: (item) => (
                  <td>
                    {item.phoneNumber}
                  </td>
                ),
                dob: (item) => (
                  <td>
                    {item.dob}
                  </td>
                ),
                gender: (item) => (
                  <td>
                    {item.gender}
                  </td>
                ),
                accNo: (item) => (
                  <td>
                    {item.accNo}
                  </td>
                ),
                ifscCode: (item) => (
                  <td>
                    {item.ifscCode}
                  </td>
                ),
                // wallet: (item) => (
                //   <td>
                //     <b>₹</b>{item.wallet}
                //   </td>
                // ),
                isOnline: (item, index) => {
                  return (
                    <td>
                           <CSwitch
                          shape= 'pill'
                          color="success"
                          size='lg'
                          checked={item.isOnline}
                          // onChange={async (e) => {
                          //   toggle(item.id,item.isActive,item.token)
                          // }}
                          />                         
                    </td>
                  );
                },
                active: (item, index) => {
                  return (
                    <td>
                           <CSwitch
                          shape= 'pill'
                          color="success"
                          size='lg'
                          checked={item.isActive}
                          onChange={async (e) => {
                            toggle(item.id,item.isActive,item.token)
                          }}
                          />                         
                    </td>
                  );
                },
                block: (item, index) => {
                  return (
                    <td>
                           <CSwitch
                          shape= 'pill'
                          color="success"
                          size='lg'
                          checked={item.block}
                          onChange={async (e) => {
                            toggle2(item.id,item.block,item.token)
                          }}
                          />                         
                    </td>
                  );
                },
                bankingDetails: (item,index) => {
                    return (
                        
                      <td>
                        <div>
                          <div><b>Account Number : </b>{item.bankingDetails.accountNumber}</div>
                          <div><b>Name : </b>{item.bankingDetails.name}</div>
                        </div>
                        {/* {

                          item.bankingDetails.map((sub)=>{
                            console.log(sub);
                                  // return () 
                          })

                        } */}
                      </td>
                    );
                  },
                show_delete: (item,index) => {
                  return (
                    // <td className="py-2">
                    //   <CButton
                    //     color="primary"
                    //     variant="outline"
                    //     shape="square"
                    //     size="sm"
                    //     onClick={() => {
                    //       toggleDetails(item.id);
                    //     }}
                    //   >
                    //     {details.includes(item.id) ? "Hide" : "Show"}
                    //   </CButton>
                    // </td>
                    <td>
                      {/* <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => hist(item)}>View History</CButton> */}
                      <CInputGroup style={{flexWrap: "nowrap"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => hist(item)}>View Report</CButton>
                              {/* <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)}>Delete</CButton> */}
                              
                        </CInputGroup>
                        {/* <CInputGroup style={{flexWrap: "nowrap", marginTop:"5px"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => edit(item)}>View Review</CButton>
                              <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)}>Delete</CButton>
                              
                        </CInputGroup> */}
                      {/* <CButton
                        size="sm"
                        color="danger"
                        className="ml-1"
                        onClick={() => deleteVideo(item.id)}
                      >
                        Delete
                      </CButton> */}
                    </td>
                  );
                },
              }}
              hover
              striped
              columnFilter
              pagination
              // tableFilter
              sorter
              // itemsPerPageSelect
              itemsPerPage={50}
              clickableRows
              //   onRowClick={(item) => history.push(`/users/${item.id}`)}
            />
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
                <td hidden></td>
                // <CButton
                //   color="primary"
                //   disabled={pageLoading || loading}
                //   // variant="ghost"
                //   shape="square"
                //   size="sm"
                //   onClick={loadMoreOrders}
                // >
                //   Load More
                // </CButton>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default Pgprop;
