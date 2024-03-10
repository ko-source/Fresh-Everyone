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
  CSwitch
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const Popup = () => {
  const history = useHistory();

  var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
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
    const response= await firebase.firestore().collection("vendorAdminImages").get();
    // const videos = await firebase.firestore().collection("vendor").get();
    // setLastOrder(videos.docs[videos.docs.length - 1]);

    let resolvedVideos = response.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        url:videoData.url
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
  };
  const toggle = async(rowId,colId) => {
   if(colId===true){
    await firebase.firestore().collection("vendorAdminImages").update({
      isActive:false,
    })
    getVideos();
   }else{
    await firebase.firestore().collection("vendorAdminImages").update({
      isActive:true,
    })
    getVideos();
   } 
  };
  const deleteVideo = (rowId) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("generalData").doc("data").collection("popup").doc(rowId).delete();
            alert("Popup Deleted");
            // getVideos();
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
  const edit = async(rowId) => {
    history.push(
      {
      pathname: '/banner/edit-popups',
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
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Popup List</CCardHeader>
          <CCardBody style={{textAlign:"center"}}>
            <CDataTable style={{border:"5px solid black",textAlign: "center"}}
              loading={loading}
              // onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                // { key: "cart", label: "Cart Message",filter: true },
                // { key: "name", label: "Deal Page Message",filter: true },
                // { key: "sequence", label: "Home Page Meaasge",filter: true },
                { key: "image", label:"Popup Image" }, 
                // { key: "page1image", label:"Page 1 Image" },
                // { key: "page2image", label:"Page 2 Image" },
                // { key: "isActive", label: "Is Active",filter: true },
                // { key: "status" },
                { key: "show_delete", label: "Action" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                cart: (item) => (
                  <td>
                    {item.cartMessage}
                  </td>
              ),
                name: (item) => (
                    <td>
                      {item.dealsPageMessage}
                    </td>
                ),
                sequence: (item) => (
                  <td>
                    {item.homePageMessage}
                  </td>
              ),
                image: (item) => (
                  <td>
                          <CImg
                          rounded="true"
                          src={item.url}
                          width={200}
                          height={100}
                        />
                  </td>
                ),
                page1image: (item) => (
                  <td>
                    {
                          <CImg
                          rounded="true"
                          src={item.page1ImageUrl}
                          width={200}
                          height={100}
                        />
                        
                    }
                  </td>
                ),
                page2image: (item) => (
                  <td>
                    {
                          <CImg
                          rounded="true"
                          src={item.page2ImageUrl}
                          width={200}
                          height={100}
                        />
                        
                    }
                  </td>
                ),
                isActive:(item)=>(
                    <td>
                        <CSwitch
                          shape= 'pill'
                          color="success"
                          size='lg'
                          checked={item.isActive}
                          onChange={async (e) => {
                            toggle(item.id,item.isActive)
                            // e.preventDefault();
                            // const docsRef = doc(db, "users", user.id);
                            // await updateDoc(docsRef, {
                            //   isVer: e.target.checked,
                            // });
                            // getUsers()
                          }}
                          /> 
                    </td>
                ),
                show_delete: (item) => {
                  return (
                    <td>
                      <CInputGroup style={{flexWrap: "nowrap"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => edit(item)}>Edit</CButton>
                              {/* <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)} >Delete</CButton> */}
                           </CInputGroup>
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
              // columnFilter
              // pagination
              // tableFilter
              // sorter
              // itemsPerPageSelect
              // itemsPerPage={30}
              clickableRows
              //   onRowClick={(item) => history.push(`/users/${item.id}`)}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default Popup;
