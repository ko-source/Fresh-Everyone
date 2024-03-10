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

const VendorNotification = () => {
  const history = useHistory();
  var [cat, setCat] = useState([]);
  var [data, setData] = useState([]);
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
    getData();
    getVideos();
    getVendors();
  }, [refresh]);

  const getData = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("inquiry").orderBy("date","desc").get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        date: videoData.date,
        userID: videoData.userID,
        vendorId:videoData.vendorId,
        // document:videoData.document,
        // registration:videoData.registration,
        // // refCode:videoData.refCode,
        isActive:videoData.isNotificationSent,
        // token: videoData.token,
        // soc: videoData.societyName,
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

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("vendor").get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        name: videoData.name,
        phno: videoData.phone,
        imageUrl:videoData.imageUrl,
        document:videoData.document,
        registration:videoData.registration,
        // // refCode:videoData.refCode,
        isActive:videoData.verified,
        token: videoData.token,
        // soc: videoData.societyName,
        // email: videoData.email,
        // username: videoData.username,
      };
    });

    // resolvedVideos = resolvedVideos.sort(compare);
    // console.log(resolvedVideos);

    setData(resolvedVideos)
    setLoading(false);
    // console.log(videos);
  };
  const getVendors = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("user").get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        name: videoData.name,
        phno: videoData.phone,
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
            await firebase.firestore().collection("vendor").doc(rowId).delete();
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
      pathname: '/blogs/vendor-history',
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
    await firebase.firestore().collection("inquiry").doc(rowId).update({
      isNotificationSent:false,
    })
    getData();
   }else{
    await firebase.firestore().collection("inquiry").doc(rowId).update({
        isNotificationSent:true,
    })
    await sendNotification(token)
    getData();
   } 
  };
  const [commonTitle, setCommonTitle] = useState("Inquiry Update");
  const [comm, setComm] = useState("Hi, Your property has an inqury by User.");
  firebase.messaging().onMessage((res) => {
    // console.log(res);
  });
  const sendNotification = async (token) => {
    // console.log(mob);
    let fbtoken ="";
    {data.map((sub)=>{
        if (sub.id == token) {
                fbtoken = sub.token                          
            
        }

      })}
    let body = {
        to : fbtoken,
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
        console.log(data);
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
        name: order.name,
        phno: order.phone,
        // imageUrl:videoData.image,
        wallet:order.wallet,
        type:order.type,
        isActive:order.isActive
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

    const title = "Vendor List";
    const headers = [["Vendor Id","Vendor Name","Vendor Number","Wallet Balance","Approved","Referred By"]];

    const data = e.map((sub,index) =>[
      // [elt.name + "\n" + elt.number],
      sub.id,
      sub.name,
      sub.phno,
      sub.wallet,
      sub.isActive == true?"Yes":"No",
      cat.map((sub1) =>
        sub1.id == sub.id?sub1.refCode:"  "
      )
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
    doc.save("vendorlist.pdf")
  }
  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
        <span className="font-xl">Vendor Notifications Management</span>
            {/* <span>
              <CButton color="info" className="mb-2 mr-2" onClick={onExportData} style={{ float:"right"}}>
                Export Data
              </CButton>
            </span> */}
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
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: false },
                { key: "date", label: "Date", filter: false },
                // { key: "image", label: "Image", filter: true },
                { key: "userID", label: "User Details", filter: false },
                { key: "vendorId", label: "Vendor Details", filter: false },
                // { key: "wallet", label: "Wallet", filter: true },
                // { key: "type", label: "User Type", filter: true },
                { key: "active", label: "Is Notification Sent", filter: false },
                // { key: "refCode", label: "Reffered By" },
                // { key: "show_delete", label: "Actions" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                date: (item) => (
                  <td>
                    <div>
                        {new Intl.DateTimeFormat(['ban', 'id'], {year: "numeric",month: "2-digit",day: "2-digit",}).format(item.date)}
                    </div>
                    <div>
                        {new Intl.DateTimeFormat("en-US", {hour: "numeric",minute: "numeric",}).format(item.date)}
                    </div>
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
                userID: (item) => (
                  <td>
                    <div>{cat.map((sub)=>{
                        if (sub.id == item.userID) {
                            return(<div>
                                <div><b>Name : </b>{sub.name}</div>
                                <div><b>Phone : </b>{sub.phno}</div>
                            </div>)
                            
                        }

                      })}</div>
                  </td>
                ),
                vendorId: (item) => (
                  <td>
                    <div>{data.map((sub)=>{
                        if (sub.id == item.vendorId) {
                            return(<div>
                                <div><b>Name : </b>{sub.name}</div>
                                <div><b>Phone : </b>{sub.phno}</div>
                            </div>)
                            
                        }

                      })}</div>
                  </td>
                ),
                type: (item) => (
                  <td>
                    {item.type}
                  </td>
                ),
                wallet: (item) => (
                  <td>
                    <b>₹</b>{item.wallet}
                  </td>
                ),
                active: (item, index) => {
                //   console.log(item.isActive);
                  return (
                    <td>
                           <CSwitch
                          shape= 'pill'
                          color="success"
                          size='lg'
                          checked={item.isActive}
                          onChange={async (e) => {
                            toggle(item.id,item.isActive,item.vendorId,data)
                          }}
                          />                         
                    </td>
                  );
                },
                refCode: (item,index) => {
                    return (
                        
                      <td>
                          <div>{

                              cat.map((sub)=>{
                                  if (sub.id == item.id) {
                                      return (<div>
                                          <p>{sub.refCode}</p>
                                            <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => ref(item,sub.refCode)}>View Details</CButton>
                                      </div>)   
                                  }
                              })

                              }</div>
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
                              {/* <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => hist(item)}>View Details</CButton> */}
                              <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)}>Delete</CButton>
                              
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

export default VendorNotification;
