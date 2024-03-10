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

const Eventlist = () => {
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
    const videos = await firebase.firestore().collection("Events").orderBy("eventStartDate").get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        add:videoData.addr,
        city:videoData.city,
        eventCat:videoData.eventCat,
        enentDesc:videoData.eventDesc,
        eventEndDate:videoData.eventEndData,
        eventImage:videoData.eventImage,
        eventStartDate:videoData.eventStartDate,
        eventTargetCity:videoData.eventTargetCity,
        eventTime:videoData.eventTime,
        eventName:videoData.name,
        org:videoData.org,  
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
      pathname: '/blogs/vendor-history',
      state: rowId
      }
    )
  };
  const toggle = async(rowId,colId) => {
    // console.log(rowId);
    // console.log(colId);
   if(colId===true){
    await firebase.firestore().collection("Users").doc(rowId).update({
      block:false,
    })
    getVideos();
   }else{
    await firebase.firestore().collection("Users").doc(rowId).update({
      block:true,
    })
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
        add:order.addr,
        city:order.city,
        eventCat:order.eventCat,
        enentDesc:order.eventDesc,
        eventEndDate:order.eventEndData,
        // eventImage:order.eventImage,
        eventStartDate:order.eventStartDate,
        eventTargetCity:order.eventTargetCity,
        eventTime:order.eventTime,
        eventName:order.name,
        org:order.org, 
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

    const title = "Event List";
    const headers = [["Event Id","Event Name","Event Category","Event Target City","Event Start Date","Event Time","Event End Date","Event Organizer"]];

    const data = e.map((sub,index) =>[
      // [elt.name + "\n" + elt.number],
      sub.id,
      sub.eventName,
      sub.eventCat,
      sub.eventTargetCity,
      sub.eventStartDate,
      sub.eventTime,
      sub. eventEndDate,
      sub.org,
      // sub.city,
      // sub.add

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
    doc.save("eventlist.pdf")
  }
  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
        <span className="font-xl">Event List</span>
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
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "eventStartDate", label: "Event Start Date", filter: true },
                { key: "eventEndDate", label: "Event End Date", filter: true },
                { key: "eventName", label: "Event Name", filter: true },
                { key: "eventCat", label: "Event Category", filter: true },
                { key: "eventImage", label: "Event Image", filter: true },
                { key: "eventTargetCity", label: "Event Target City", filter: true },
                { key: "eventTime", label: "Event Time", filter: true },
                { key: "org", label: "Organizer", filter: true },
                { key: "city", label: "City", filter: true },
                { key: "add", label: "Address", filter: true },
                // { key: "active", label: " Block/Unblock", filter: true },
                // { key: "show_delete", label: "Vendor Details" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                eventStartDate: (item) => (
                  <td>
                    {item.eventStartDate}
                  </td>
                ),
                eventEndDate: (item) => (
                    <td>
                      {item.eventEndDate}
                    </td>
                  ),
                  eventName: (item) => (
                    <td>
                      {item.eventName}
                    </td>
                  ),
                  eventCat: (item) => (
                    <td>
                      {item.eventCat}
                    </td>
                  ),
                  eventImage: (item) => (
                  <td>
                    <CImg
                      rounded="true"
                      src={item.eventImage}
                      width={100}
                      height={100}
                    />
                  </td>
                ),
                eventTargetCity: (item) => (
                  <td>
                    <div>{item.eventTargetCity}</div>
                  </td>
                ),
                eventTime: (item) => (
                  <td>
                    <div>{item.eventTime}</div>
                  </td>
                ),
                org: (item) => (
                  <td>
                    {item.org}
                  </td>
                ),
                city: (item) => (
                  <td>
                      {item.city}
                  </td>
                ),
                add: (item) => (
                    <td>
                        {item.add}
                    </td>
                  ),
                active: (item, index) => {
                  console.log(item.isActive);
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
                      <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => hist(item)}>View History</CButton>
                      {/* <CInputGroup style={{flexWrap: "nowrap"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => hist(item)}>View History</CButton>
                              <CButton style={{ color: "#fff",backgroundColor: "#00BFFF",borderColor: "#00BFFF", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => edit(item,index)}>Update User</CButton>
                              
                           </CInputGroup>
                      <CButton
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

export default Eventlist;
