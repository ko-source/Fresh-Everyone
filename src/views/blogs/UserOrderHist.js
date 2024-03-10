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

const UserOrderHist = () => {
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
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("users").get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);
    
    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data(); 

      return {
        ...videoData,
        id: id,
        name: videoData.name,
        // lname: videoData.last_name,
        phno: videoData.mobile,
        // block:videoData.block,
        imageUrl:videoData.image,
        gender:videoData.gender,
        // pgender:videoData.prop_gender,
        // dob:new Date(videoData.date of birth.toDate()).toUTCString()
        // isActive:videoData.lookingForRoommate,
        // country: videoData.country,
        // soc: videoData.societyName,
        email: videoData.email,
        address:videoData.address,
        // uid:videoData.userID
        // username: videoData.username,
      };
    });

    // resolvedVideos = resolvedVideos.sort(compare);
    // console.log(resolvedVideos);

    setState({
      ...state,
      videos: resolvedVideos,
    });
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
            await firebase.firestore().collection("users").doc(rowId).delete();
            setRefresh(!refresh);
                alert("User Deleted");
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
      pathname: '/blogs/edit-user',
      state: rowId,
      index: index
      }
    )
  };
  const hist = (rowId) => {
    history.push(
      {
      pathname: '/blogs/user-history',
      state: rowId
      }
    )
  };
  const toggle = async(rowId,colId) => {
    // console.log(rowId);
    // console.log(colId);
   if(colId===true){
    await firebase.firestore().collection("Users").doc(rowId).update({
      lookingForRoommate:false,
    })
    getVideos();
   }else{
    await firebase.firestore().collection("Users").doc(rowId).update({
      lookingForRoommate:true,
    })
    getVideos();
   } 
  };
  const toggle2 = async(rowId,colId,token) => {
    // console.log(rowId);
    // console.log(colId);
    // mob1.push(token);
    // setMob(mob1);
   if(colId===true){
    await firebase.firestore().collection("Users").doc(rowId).update({
      block:false,
    })
    getVideos();
   }else{
    await firebase.firestore().collection("Users").doc(rowId).update({
      block:true,
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
        phone:order.phno,
        gender:order.gender,
        dob:order.dateOfBirth,
        email: order.email,
        address:order.address,
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

    const title = "User List";
    const headers = [["User Id","User Name","Number","Email","Address","Gender"]];

    const data = e.map((sub,index) =>[
      // [elt.name + "\n" + elt.number],
      sub.id.slice(0, 7),
      sub.name,
      sub.phone,
      sub.email,
      sub.address,
      // sub.dob,
      sub.gender,
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
    doc.save("userlist.pdf")
  }
  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
        <span className="font-xl">User Management</span>
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
            {state.videos && (<CDataTable style={{border:"1px solid #ebedf0"}}
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
                { key: "id", label: "UserId", filter: true },
                { key: "image", label: "Image", filter: true },
                { key: "name", label: "Username", filter: true },
                { key: "phno", label: "Phone Number", filter: true },
                { key: "email", label: "Email", filter: true },
                { key: "address", label: "Address", filter: true },
                // { key: "block", label: "Blocked", filter: true },
                { key: "gender", label: "Gender", filter: true },
                // { key: "dob", label: "DOB", filter: true },
                // { key: "active", label: "Looking For Roommate", filter: true },
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
                phno: (item) => (
                  <td>
                    <div>{item.phno}</div>
                  </td>
                ),
                email: (item) => (
                  <td>
                    <div>{item.email}</div>
                  </td>
                ),
                address: (item) => (
                  <td>
                    {<p>Location:   {item.address?(item.address["location"]??""):""}</p>}
                    {<p>Landmark:   {item.address?(item.address["landmark"]??""):"" }</p>}
                  </td>
                ),
                gender: (item) => (
                  <td>
                    <div>{item.gender}</div>
                  </td>
                ),
                dob: (item) => (
                  <td>
                    <div>{item.dob}</div>
                  </td>
                ),
                // wallet: (item) => (
                //   <td>
                //     <b>₹</b>{item.wallet}
                //   </td>
                // ),
                active: (item, index) => {
                  return (
                    <td>
                           <CSwitch
                          shape= 'pill'
                          color="success"
                          size='lg'
                          checked={item.isActive}
                          onChange={async (e) => {
                            toggle(item.id,item.isActive)
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
                show_delete: (item,index) => {
                  return (
                    <td>
                      <CInputGroup style={{flexWrap: "nowrap"}}>
                        {/* <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => edit(item,index)}>Edit</CButton> */}
                        <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)}>Delete</CButton>
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
                // onRowClick={(item) =>  edit(item)}
            />)}
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

export default UserOrderHist;
