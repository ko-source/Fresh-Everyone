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
  CSwitch,
  CLabel
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { add } from "lodash";

const Distance = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);
  const [cat, setCat] = useState([]);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("distance").get();
    // console.log(videos.docs.length);

    const resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        km:videoData.km,
        // image:videoData.image,
        // name:videoData.name,
        // price:videoData.price,
        // productId:videoData.productId,
        // productType:videoData.productType,
        // quantity:videoData.quantity,
        // vendorId:videoData.vendorId,
        // weight:videoData.weight
      };
    });
    setState({
      ...state,
      videos: resolvedVideos,
    });
    setCat(resolvedVideos)
    setLoading(false);
  };
  const toggle = async(value,index) => {
    var data = cat[0];
    const updateddata = data.list.map((sub,i) => index == i ?
    Object.assign(sub,{["inStock"]: value===true?false:true}) : sub );
    await firebase.firestore().collection("productItems").doc("B0szi8YwcegMB54BsmA8").update({
    list:updateddata
    })
    getVideos();
  };

  const deleteVideo = (docid,index) => {
    confirmAlert({
      title: "Update",
      message: (
        <CRow>
        {/* <CRow>
        <CCol sm={3}>
          <CLabel style={{ marginLeft: "15px" }}>Name</CLabel>
        </CCol>
        <CCol sm={6}>
          <div
            class="form-floating"
            style={{ marginLeft: "15px", color: "#333" }}
            rows="3"
          >
            <input
              type="text"
              placeholder="Enter Stock Name"
              name="name"
              id="name"
            />
          </div>
        </CCol>
        </CRow> */}
        {/* <CRow style={{marginTop:"3px"}}>
          <CCol sm={3}>
            <CLabel style={{ marginLeft: "15px" }} rows="3">
              Select Category
            </CLabel>
          </CCol>
          <CCol sm={6}>
            <select
              style={{
                marginLeft: "21px",
                border: "1px solid #d8dbe0",
                borderRadius: "0.25rem",
                textAlign: "left",
              }}
              id="dropdown"
            >
              <option value="" selected>Select Category</option>
              <option value="Large">Large</option>
              <option value="Mid">Mid</option>
              <option value="Mini">Mini</option>
              <option value="Micro">Micro</option>
            </select>
          </CCol>
        </CRow> */}
        <CRow style={{marginTop:"3px"}}>
        <CCol sm={3}>
          <CLabel style={{ marginLeft: "15px" }}>Distance</CLabel>
        </CCol>
        <CCol sm={6}>
          <div
            class="form-floating"
            style={{ marginLeft: "15px", color: "#333" }}
            rows="3"
          >
            <input
              type="number"
              placeholder={index}
              name="credit"
              id="credit"
            />
          </div>
          </CCol>
        </CRow>
        {/* <CRow style={{marginTop:"3px"}}>
          <CCol sm={3}>
          <CLabel style={{ marginLeft: "15px" }}>Type</CLabel>
          </CCol>
          <CCol sm={6}>
          <div
            class="form-floating"
            style={{ marginLeft: "15px", color: "#333" }}
            rows="3"
          >
            <input
              type="text"
              placeholder="Enter Stock Type"
              name="type"
              id="type"
            />
          </div>
          </CCol>
        </CRow> */}
        </CRow>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            // console.log(updateddata);
            
            await firebase.firestore().collection("distance").doc(docid).update({
                km:parseFloat(document.getElementById("credit").value)
            }).then(()=>{
              alert("Distance Updated");
              getVideos();
            })
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
      pathname: '/edit-prod',
      state: rowId
      }
    )
  };
  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Distance</CCardHeader>
          <CCardBody style={{textAlign:"center"}}>
            <CDataTable style={{border:"5px solid black",textAlign: "center"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "km", label: "Radius",filter: true },
                // { key: "name", label: "Product Name",filter: true },
                // { key: "categoryName", label: "Category Name",filter: true },
                // { key: "price", label: "Product Price",filter: true },
                // { key: "quantity", label: "Product Quantity",filter: true },
                // { key: "productType", label: "Product Type",filter: true },
                // { key: "weight", label: "Product Weight",filter: true },
                // { key: "image", label: "Product Image",filter: false },
                // { key: "vendorId", label: "Vendor Id",filter: true },
                { key: "show_delete", label: "Actions",filter: false },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                return (
                    <td>
                        {index+1}
                    </td>
                );
                },
                km: (item) => {
                  return(
                   // item.isCancelled == true?<td hidden></td>:
                   <td>{item.km}</td>
                  )
                 },
                categoryName: (item) => (
                <td>
                    {item.categoryName}
                </td>
                ),
                name: (item) => (
                <td>
                    {item.name}
                </td>
                ),
                price: (item) => (
                <td>
                    {item.price}
                </td>
                ),
                quantity: (item) => (
                <td>
                    {item.quantity}
                </td>
                ),
                weight: (item) => (
                <td>
                    {item.weight}
                </td>
                ),
                image: (item) => (
                <td>
                    <CImg
                    rounded="true"
                    src={item.image}
                    width={100}
                    height={100}
                    />
                </td>
                ),
                productType: (item) => (
                <td>
                    {item.productType}
                </td>
                ),
                vendorId: (item) => {
                  return(
                   // item.isCancelled == true?<td hidden></td>:
                   <td>{item.vendorId.slice(0, 7)}</td>
                  )
                 },
                // inStock:(item,index)=>(
                //     <td>
                //         <CSwitch
                //         shape= 'pill'
                //         color="success"
                //         size='lg'
                //         checked={item.inStock}
                //         onChange={async (e) => {
                //             toggle(item.inStock,index)
                //         }}
                //         /> 
                //     </td>
                // ),
                show_delete: (item,index) => {
                return (
                    <td>
                    <CInputGroup style={{flexWrap: "nowrap"}}>
                            <CButton style={{ color: "#fff",backgroundColor: "#007bff",borderColor: "#007bff", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => deleteVideo(item.id,item.km)}>Edit</CButton>
                            {/* <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id,index)} >Delete</CButton> */}
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
              columnFilter
              pagination
            //   // tableFilter
              sorter
            //   // itemsPerPageSelect
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

export default Distance;
