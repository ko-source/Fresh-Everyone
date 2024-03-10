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

const Brand = () => {
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
    const response=await firebase.firestore().collection("generalData").doc("brand").get();
    response.data().brand.map(sub1 =>{
        return(cat.push(sub1))
      })
    setCat([...cat,cat])
    console.log(cat.length);
    setLoading(false);
  };
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
            await firebase.firestore().collection("generalData").doc("brand").update({
                brand : firebase.firestore.FieldValue.arrayRemove(rowId)
            })
            // setRefresh(!refresh);
                alert("Brand Deleted");
                history.push('/');
            history.replace("/videos/brand");
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
  const edit = (rowId,index) => {
    history.push(
      {
      pathname: '/videos/edit-unit',
      state: rowId,
      index: index
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
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Brand List</CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={cat}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                // { key: "image", label:"Category Image" },
                { key: "link", label: "Brand Name",filter: true },
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
                // image: (item) => (
                //   <td>
                //     <CImg
                //       rounded="true"
                //       src={item.image}
                //       width={100}
                //       height={100}
                //     />
                //   </td>
                // ),
                link: (item) => (
                  <td>
                    {item}
                  </td>
                ),
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
                              {/* <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => edit(item,index)}>Edit</CButton> */}
                              <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item)} >Delete</CButton>
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
              // pagination
              // tableFilter
              sorter
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

export default Brand;
