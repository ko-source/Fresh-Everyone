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

const WithdrawVendor = () => {
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
    const videos = await firebase.firestore().collection("VendorWithdrawRequest")
    .orderBy("date","desc")
    .get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        name:videoData.vendorName,
        amount : videoData.amount,
        date : videoData.date.toDate().toString()
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
  const hist = async(rowId , name ,amt) => {
   console.log(rowId , name)
    const data1 = await firebase.firestore().collection("VendorTotalAmount").where("vendorName" , "==" , name).orderBy("date","desc")
.get();
    let resolvedVideos = data1.docs.map((video) => {
        const id = video.id;
        const videoData = video.data();
  
        return {
          ...videoData,
          id: id,
          name: videoData.vendorName,
        };
      });
    // console.log(resolvedVideos[0])
      await firebase.firestore().collection("VendorTotalAmount").doc(resolvedVideos[0].id).update({
        amount : resolvedVideos[0].amount-amt,
      });
      await firebase.firestore().collection("VendorWithdrawRequest").doc(rowId).update({
        amount : 0,
      });
      alert("SuccessFull")
      getVideos();
      
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
        <span className="font-xl">Withdraw request</span>
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
                { key: "name", label: "Rider Name", filter: true },
                { key: "amount", label: "Amount", filter: true },
                { key: "date", label: "Date", filter: true },
                { key: "withdraw", label: "Actions" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                
                name: (item) => (
                  <td>
                    <div>{item.name}</div>
                  </td>
                ),
                amount: (item) => (
                  <td>
                    <div>{item.amount}</div>
                  </td>
                ),
                date: (item) => (
                    <td>
                      <div>{item.date}</div>
                    </td>
                  ),
                withdraw: (item,index) => {
                  return (
                    
                    <td>
                      <CInputGroup style={{flexWrap: "nowrap"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => hist(item.id , item.name , item.amount)}>Withdraw</CButton>
                              {/* <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)}>Delete</CButton> */}
                              
                        </CInputGroup>
                       
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

export default WithdrawVendor;
