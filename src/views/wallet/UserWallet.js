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
  CSpinner
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const UserWallet = () => {
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

  // function compare(b, a) {
  //   var id = "id";
  //   if (a[id] < b[id]) {
  //     return -1;
  //   }
  //   if (a[id] > b[id]) {
  //     return 1;
  //   }
  //   return 0;
  // }
  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("User").get();
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
        phno: videoData.phone,
        // imageUrl:videoData.image,
        wallet:videoData.wallet,
        type:videoData.type
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
  // const loadMoreOrders = async () => {
  //   setPageLoading(true);
  //   const videos = 
  //       await firebase.firestore().collection("users")
  //       .orderBy("date", "desc")
  //       .startAfter(lastOrder)
  //       .limit(50)
  //       .get();

  //   setLastOrder(videos.docs[videos.docs.length - 1]);
  //   let resolvedVideos = videos.docs.map((video) => {
  //       const id = video.id;
  //       const videoData = video.data();
  
  //       return {
  //         ...videoData,
  //         id: id,
  //         name: videoData.name,
  //         fno:videoData.flatNo,
  //         wing: videoData.wing,
  //         soc: videoData.societyName,
  //         // email: videoData.email,
  //         // username: videoData.username,
  //       };
  //     });
  
  //     resolvedVideos = resolvedVideos.sort(compare);
  //     console.log(resolvedVideos);

  
  //     setState({
  //       ...state,
  //       videos:[...state.videos, ...resolvedVideos],
  //     });
  //     console.log(videos);

  //   // const value = docs.filter((doc) => {
  //   //   if (
  //   //     !(
  //   //       doc.data().provider_id &&
  //   //       doc.data().customer_id &&
  //   //       doc.data().service &&
  //   //       doc.data().service["service_id"] &&
  //   //       doc.data().service["sub_service_id"]
  //   //     )
  //   //   ) {
  //   //     // console.log(doc.data());
  //   //   }
  //   //   return (
  //   //     doc.data().provider_id &&
  //   //     doc.data().customer_id &&
  //   //     doc.data().service &&
  //   //     doc.data().service["service_id"] &&
  //   //     doc.data().service["sub_service_id"]
  //   //   );
  //   // });

  //   // // resolving individual orders for meta field data
  //   // let processedOrders = await Promise.all(
  //   //   value.map(async (doc) => {
  //   //     const order = doc.data();
  //   //     const [
  //   //       resolvedProvider,
  //   //       resolvedService,
  //   //       resolvedCustomer,
  //   //       resolvedReferral,
  //   //     ] = await Promise.all([
  //   //       getProvider(order.provider_id),
  //   //       getService(order.service.service_id, order.service.sub_service_id),
  //   //       getUser(order.customer_id),
  //   //       // getUser(order.ref)
  //   //       getReferral(order.customer_id),
  //   //     ]);
  //   //     const supervisorsDocs = await firebase
  //   //       .firestore()
  //   //       .collection("supervisorJobs")
  //   //       .where("parent_TicketId", "==", order.ticketId || "")
  //   //       .get();
  //   //     const [resolvedSupervisor] = await Promise.all(
  //   //       supervisorsDocs.docs.map(async (doc) => {
  //   //         const provider = await firebase
  //   //           .firestore()
  //   //           .collection("providers")
  //   //           .doc(doc.data().provider)
  //   //           .get();
  //   //         return {
  //   //           supervisorName:
  //   //             provider.data()?.name ||
  //   //             provider.data()?.phone ||
  //   //             "Not Assigned",
  //   //         };
  //   //       })
  //   //     );
  //   //     setOrderMaker(resolvedCustomer);
  //   //     return {
  //   //       ...order,
  //   //       id: doc.id,
  //   //       provider_name: resolvedProvider.name
  //   //         ? resolvedProvider.name
  //   //         : resolvedProvider.phone,
  //   //       service_name: resolvedService.service.name,
  //   //       sub_service_name: resolvedService.sub_service.name,
  //   //       customer: resolvedCustomer.phone,
  //   //       payment_status: order.total
  //   //         ? order.amountPaid < order.total
  //   //           ? "pending"
  //   //           : "paid"
  //   //         : "pending",
  //   //       total_amount: order.total,
  //   //       referred_by: resolvedReferral,
  //   //       supervisorName: resolvedSupervisor?.supervisorName || "Not Assigned",
  //   //     };
  //   //   })
  //   // );

  //   // processedOrders = processedOrders.sort(compare);

  //   // setState({
  //   //   ...state,
  //   //   orders: [...state.orders, ...processedOrders],
  //   // });

  //   setPageLoading(false);
  // };
//   const getUnits = () =>{
//     cat.filter(x => x.id === 'data').map( sub =>{
//         return( 
          
//         )
//       })
//       console.log(cat);
//   }
  const deleteVideo = (rowId) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("employee").doc(rowId).delete();
            setRefresh(!refresh);
                alert("Employee Deleted");
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
  const edit = (rowId) => {
    history.push(
      {
      pathname: '/wallet/add-points',
      state: rowId,
    //   index: index
      }
    )
  };
  const hist = (rowId) => {
    history.push(
      {
      pathname: '/wallet/user-history',
      state: rowId
      }
    )
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
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >User Wallet History</CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "name", label: "Username", filter: true },
                { key: "phno", label: "Phone Number", filter: true },
                { key: "wallet", label: "Wallet", filter: true },
                // { key: "wing", label: "Wing", filter: true },
                // { key: "soc", label: "Society", filter: true },
                // { key: "image", label:"Category Image" },
                // { key: "link", label: "Username",filter: true },
                // { key: "status" },
                { key: "show_delete", label: "Order History" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                phno: (item) => (
                  <td>
                    <div>{item.phno}</div>
                  </td>
                ),
                name: (item) => (
                  <td>
                    <div>{item.name}</div>
                    <div>{item.phno}</div>
                  </td>
                ),
                wallet: (item) => (
                  <td>
                    <b>₹</b>{item.wallet}
                  </td>
                ),
                // link: (item) => (
                //   <td>
                //     {item.username}
                //   </td>
                // ),
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
                      <CInputGroup style={{flexWrap: "nowrap"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline" onClick={() => hist(item)}>View History</CButton>
                              <CButton style={{ color: "#fff",backgroundColor: "#00BFFF",borderColor: "#00BFFF", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => edit(item)}>Credit Points</CButton>                              
                           </CInputGroup>
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
                //   details: (item) => {
                //     console.log(item);
                //     return (
                //       <CCollapse visible="true">
                //         <CCardBody>
                //           <h4>Description</h4>
                //           <p className="text-muted">{item.descriptioin}</p>
                //           <CButton size="sm" color="info">
                //             User Settings
                //           </CButton>
                //           <CButton size="sm" color="danger" className="ml-1">
                //             Delete
                //           </CButton>
                //         </CCardBody>
                //       </CCollapse>
                //     );
                //   },
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

export default UserWallet;
