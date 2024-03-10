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

const VendorRooms = () => {
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
    getVendors();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("vendor_rooms").where("isEdit","==",false).where("isDelete","==",false).get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        advanceSecurity:videoData.advanceSecurity,
        cleaningFacility:videoData.cleaningFacility,
        descOfAccomodation:videoData.descOfAccomodation,
        distanceFromCoaching:videoData.distanceFromCoaching,
        electricityBillPayment:videoData.electricityBillPayment,
        hometownState:videoData.hometownState,
        inverterFacility:videoData.inverterFacility,
        isAvailable:videoData.isAvailable,
        isActive:videoData.isRoomAdminVerified,
        laundryFacility:videoData.laundryFacility,
        location:videoData.location,
        messInAvailable:videoData.messInAvailable,
        noOfRooms:videoData.noOfRooms,
        randomId:videoData.randomId,
        rent:videoData.rent,
        roomIn:videoData.roomIn,
        typeOfPlace:videoData.typeOfPlace,
        uid:videoData.uid,
        urls: videoData.urls,
        want: videoData.want,
        waterCooler: videoData.waterCooler,
        wifiFacility: videoData.wifiFacility,
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
        name: videoData.name,
        phno: videoData.phone,
        // imageUrl:videoData.imageUrl,
        document:videoData.document,
        registration:videoData.registration,
        // // refCode:videoData.refCode,
        isActive:videoData.verified,
        token: videoData.token,
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
            await firebase.firestore().collection("vendor_rooms").doc(rowId).delete();
            setRefresh(!refresh);
                alert("Room Deleted");
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
    mob1.push(token);
    setMob(mob1);
    // console.log(mob1);
   if(colId===true){
    await firebase.firestore().collection("vendor_rooms").doc(rowId).update({
      isRoomAdminVerified:false,
    })
    getVideos();
   }else{
    await firebase.firestore().collection("vendor_rooms").doc(rowId).update({
        isRoomAdminVerified:true,
    })
    await sendNotification(token)
    getVideos();
   } 
  };
  const [commonTitle, setCommonTitle] = useState("Verified Successfully");
  const [comm, setComm] = useState("Hi, Your Room has been verified by Admin.");
  firebase.messaging().onMessage((res) => {
    // console.log(res);
  });
  const sendNotification = async (token) => {
    // console.log(mob);
    let fbtoken ="";
    {cat.map((sub)=>{
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
  const toggle2 = async(rowId,colId,token) => {
   if(colId===true){
    await firebase.firestore().collection("vendor_rooms").doc(rowId).update({
      isAvailable:false,
    })
    getVideos();
   }else{
    await firebase.firestore().collection("vendor_rooms").doc(rowId).update({
        isAvailable:true,
    })
    // await sendNotification()
    getVideos();
   } 
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
        <span className="font-xl">Vendor Room 2 Management</span>
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
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "randomId", label: "Id", filter: true },
                { key: "nameOfAccomodation", label: "Name Of Accomodation", filter: true },
                { key: "noOfRooms", label: "No Of Rooms", filter: true },
                { key: "rent", label: "Rent", filter: true },
                { key: "roomIn", label: "Room In", filter: true },
                { key: "active", label: "Approved", filter: true },
                { key: "available", label: "Available", filter: true },
                { key: "uid", label: "Vendor Details", filter: true },
                { key: "location", label: "Location", filter: true },
                { key: "urls", label: "Images", filter: true },
                { key: "lookingFor", label: "Looking For", filter: true },
                { key: "advanceSecurity", label: "Advance Security", filter: true },
                { key: "descOfAccomodation", label: "Description", filter: true },
                { key: "electricityBillPayment", label: "Bill  Payment", filter: true },
                { key: "hometownState", label: "Hometown State", filter: true },
                // { key: "type", label: "User Type", filter: true },
                { key: "typeOfPlace", label: "Type Of Place", filter: true },
                { key: "laundryFacility", label: "Laundry Facility", filter: true },
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
                randomId: (item) => (
                  <td>
                    {item.randomId}
                  </td>
                ),
                urls:  (item, index) => {
                    return (
                      <td>
                        {
                          item.urls.map((url,index)=>{
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
                        
                      </td>
                    );
                  },
                advanceSecurity: (item) => (
                  <td>
                    <div>{item.advanceSecurity}</div>
                  </td>
                ),
                descOfAccomodation: (item) => (
                  <td>
                    <div>{item.descOfAccomodation}</div>
                  </td>
                ),
                electricityBillPayment: (item) => (
                  <td>
                    {item.electricityBillPayment}
                  </td>
                ),
                hometownState: (item) => (
                    <td>
                      {item.hometownState}
                    </td>
                  ),
                  nameOfAccomodation: (item) => (
                    <td>
                      {item.nameOfAccomodation}
                    </td>
                  ),
                  noOfRooms: (item) => (
                    <td>
                      {item.noOfRooms}
                    </td>
                  ),
                  rent: (item) => (
                  <td>
                    <b>₹</b>{item.rent}
                  </td>
                ),
                roomIn: (item) => (
                    <td>
                      {item.roomIn}
                    </td>
                  ),
                  typeOfPlace: (item) => (
                    <td>
                      {item.typeOfPlace}
                    </td>
                  ),
                  uid: (item) => (
                    <td>
                      {cat.map((sub)=>{
                        if (sub.id == item.uid) {
                            return(<div>
                                <div><b>Name : </b>{sub.name}</div>
                                <div><b>Phone : </b>{sub.phno}</div>
                            </div>)
                            
                        }

                      })}
                    </td>
                  ),
                  laundryFacility: (item) => (
                    <td>
                      {item.laundryFacility}
                    </td>
                  ),
                  location: (item) => (
                    <td>
                      {item.location}
                    </td>
                  ),
                  lookingFor: (item) => (
                    <td>
                      {item.lookingFor}
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
                            toggle(item.id,item.isActive,item.uid)
                          }}
                          />                         
                    </td>
                  );
                },
                available: (item, index) => {
                    // console.log(item.isActive);
                    return (
                      <td>
                             <CSwitch
                            shape= 'pill'
                            color="success"
                            size='lg'
                            checked={item.isAvailable}
                            onChange={async (e) => {
                              toggle2(item.id,item.isAvailable)
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

export default VendorRooms;
