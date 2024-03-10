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
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const Videos = () => {
  const history = useHistory();

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
    const videos = await firebase.firestore().collection("enquiryQuestions").get();
    // console.log(videos.docs.length);

    const resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        ans:videoData.ans,
        ques:videoData.ques,
        // imageUrl:videoData.imageUrl
      };
    });

    setState({
      ...state,
      videos: resolvedVideos,
    });
    setLoading(false);
  };

  const deleteVideo = (rowId) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("enquiryQuestions").doc(rowId).delete();
            alert("Question Deleted");
            history.push('/');
            history.replace("/videos");
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
      pathname: '/videos/edit-category',
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
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Questions List</CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"5px solid black",textAlign: "center"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                // { key: "image", label:"Category Image" },
                // { key: "id", label: "Services Name",filter: true },
                { key: "ques", label: "Question",filter: true },
                { key: "ans", label: "Answer",filter: true },
                // { key: "imageUrl", label: "Image",filter: true },
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
                imageUrl: (item) => (
                  <td>
                    <CImg
                      rounded="true"
                      src={item.imageUrl}
                      width={200}
                      height={100}
                    />
                  </td>
                ),
                id: (item) => (
                  <td>
                    {item.id}
                  </td>
                ),
                ques: (item) => (
                  <td>
                    {item.ques}
                  </td>
                ),
                ans: (item) => (
                  <td>
                    {item.ans}
                  </td>
                ),
                show_delete: (item) => {
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
                              {/* <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => edit(item)}>Edit</CButton> */}
                              <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)} >Delete</CButton>
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
              itemsPerPage={30}
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

export default Videos;
