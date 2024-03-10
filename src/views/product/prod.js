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
import Multiselect from "multiselect-react-dropdown";
import { add } from "lodash";

const Product = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);
  const [cat, setCat] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [category, setCatategory] = useState([]);
  var arr = [];
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
    getVendors();
  }, []);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("productitems").orderBy("name", "asc").get();
    // console.log(videos.docs.length);

    const resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        categoryName: videoData.categoryName,
        categoryId: videoData.categoryId,
        image: videoData.image,
        name: videoData.name,
        price: videoData.price,
        productId: videoData.productId,
        productType: videoData.productType,
        quantity: videoData.quantity,
        vendorId: videoData.vendorId,
        weight: videoData.weight,
        weightType: videoData.weightType,
        pieces: videoData.pieces,
        serves: videoData.serves,
      };
    });
    setState({
      ...state,
      videos: resolvedVideos,
    });
    setCat(resolvedVideos)
    setLoading(false);
  };
  const getVendors = async () => {
    // setLoading(true);
    const videos = await firebase.firestore().collection("vendors").orderBy("marketName", "asc").get();

    let resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        name: videoData.marketName
      }
    });
    setVendor(resolvedVideos);
    // setLoading(false);
  };
  const toggle = async (value, index) => {
    var data = cat[0];
    const updateddata = data.list.map((sub, i) => index == i ?
      Object.assign(sub, { ["inStock"]: value === true ? false : true }) : sub);
    await firebase.firestore().collection("productItems").doc("B0szi8YwcegMB54BsmA8").update({
      list: updateddata
    })
    getVideos();
  };

  const deleteVideo = (rowId, docid, index) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            // console.log(updateddata);

            await firebase.firestore().collection("productitems").doc(docid).delete().then(() => {
              alert("Product Deleted");
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
      willUnmount: () => { },
      afterClose: () => { },
      onClickOutside: () => { },
      onKeypressEscape: () => { },
      // overlayClassName: "overlay-custom-class-name"
    });

  };
  const addIntoTodayDeals = (rowId, docid, index) => {
    confirmAlert({
      title: "Today Deals",
      message: "Are you sure to add into today deals?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            // console.log(updateddata);

            await firebase.firestore().collection("productitems").doc(docid).update({
              "todayDeals":true
            }).then(() => {
              alert("Updated product succesfully");
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
      willUnmount: () => { },
      afterClose: () => { },
      onClickOutside: () => { },
      onKeypressEscape: () => { },
      // overlayClassName: "overlay-custom-class-name"
    });

  };
  const addIntoBestSeller = (rowId, docid, index) => {
    confirmAlert({
      title: "Best Seller",
      message: "Add into best seller ?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            // console.log(updateddata);

            await firebase.firestore().collection("productitems").doc(docid).update({
              "bestSeller":true
            }).then(() => {
              alert("Updated product succesfully");
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
      willUnmount: () => { },
      afterClose: () => { },
      onClickOutside: () => { },
      onKeypressEscape: () => { },
      // overlayClassName: "overlay-custom-class-name"
    });

  };
  const updateCategory = async (s) => {
    // setCatategory(s);
    arr = [];
    arr = s;
  };
  const addVendor = (docid) => {
    confirmAlert({
      title: "Add Vendors",
      message: (
        <CRow>
          {/* <CCol sm={12}>
            <CLabel style={{ marginLeft: "15px" }} rows="3">
              Refund/Cancel :
            </CLabel>
            <select
              style={{
                marginLeft: "21px",
                border: "1px solid #d8dbe0",
                borderRadius: "0.25rem",
                textAlign: "left",
              }}
              id="status"
              onChange={(e) => handleChange(e)}
            >
            <option value="" selected>Select Type</option>
              <option value="Refund">Refund</option>
              <option value="Cancel">Cancel</option>
            </select>
          </CCol> */}
          {/* <CCol sm={12}>
            <CLabel style={{ marginLeft: "15px" }} rows="3">
              Status :
            </CLabel>
            <select
              style={{
                marginLeft: "21px",
                border: "1px solid #d8dbe0",
                borderRadius: "0.25rem",
                textAlign: "left",
              }}
              id="dropdown"
            >
              <option value="Out Of Stock">Out Of Stock</option>
              <option value="Wrong Item">Wrong Item</option>
              <option value="Quality Issue">Quality Issue</option>
              <option value="Other">Other</option>
            </select>
          </CCol> */}
          <CLabel style={{ marginLeft: "15px" }}>Add Vendors :</CLabel>
          <br></br>
          <div
            class="form-floating"
            style={{ marginLeft: "15px", color: "#333" }}
            rows="3"
          >
            <Multiselect
              displayValue="name"
              onKeyPressFn={function noRefCheck() { }}
              onRemove={(event) => { updateCategory(event) }}
              onSelect={(event) => { updateCategory(event) }}
              // onSearch={function noRefCheck(){}} 
              options={vendor}
            // showCheckbox
            />
          </div>
        </CRow>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            arr.map(async (sub) => {
              await firebase.firestore().collection("productitems").doc(docid).update({
                "vendorId": firebase.firestore.FieldValue.arrayUnion(sub.id)
              }).then(() => { console.log("Updated"); })
            })

            // await firebase.firestore().collection("productitems").doc(docid).update({
            //   vendorId: idf
            // })
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
      willUnmount: () => { },
      afterClose: () => { },
      onClickOutside: () => { },
      onKeypressEscape: () => { },
      // overlayClassName: "overlay-custom-class-name"
    });

  };
  const edit = async (rowId) => {
    history.push(
      {
        pathname: '/edit-prod',
        state: rowId
      }
    )
  };
  const addItem = async (rowId) => {
    var ref = await firebase.firestore().collection("TodayDeals").doc();
    var myId = ref.id;
    await ref.set({
      categoryName: rowId.categoryName,
      image: rowId.image,
      price: rowId.price,
      productId: myId,
      name: rowId.name,
      quantity: rowId.quantity,
      vendorId: rowId.vendorId,
      weight: rowId.weight,
      weightType: rowId.weightType
    }).then(() => {
      alert("Product Added To Today's Deal")
    })
  };
  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
          <CCardHeader style={{ fontWeight: "bold", backgroundColor: "#f7f7f7", fontSize: "1.1rem", color: "black" }} >Product List</CCardHeader>
          <CCardBody style={{ textAlign: "center" }}>
            <CDataTable style={{ border: "5px solid black", textAlign: "center" }}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                { key: "productId", label: "Product Id", filter: true },
                { key: "name", label: "Product Name", filter: true },
                { key: "categoryName", label: "Category Name", filter: true },
                { key: "price", label: "Product Price", filter: true },
                { key: "quantity", label: "Product Quantity", filter: true },
                { key: "productType", label: "Product Type", filter: true },
                { key: "weight", label: "Product Weight", filter: true },
                { key: "weightType", label: "Weight", filter: true },
                { key: "pieces", label: "Pieces", filter: true },
                { key: "serves", label: "Serves", filter: true },
                { key: "image", label: "Product Image", filter: false },
                { key: "vendorId", label: "Vendor Id", filter: true },
                { key: "show_delete", label: "Actions", filter: false },
                { key: "show_update", label: "Switch", filter: false },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                      {index + 1}
                    </td>
                  );
                },
                productId: (item) => {
                  return (
                    // item.isCancelled == true?<td hidden></td>:
                    <td>{item.productId}</td>
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
                weightType: (item) => (
                  <td>
                    {item.weightType}
                  </td>
                ),
                pieces: (item) => (
                  <td>
                    {item.pieces}
                  </td>
                ),
                serves: (item) => (
                  <td>
                    {item.serves}
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
                  return (
                    // item.isCancelled == true?<td hidden></td>:
                    <td>{item.vendorId
                      //   .map((sub)=>{
                      //   return(
                      //     <div>
                      //       {sub}
                      //     </div>
                      //   )
                      //  })
                    }</td>
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
                show_delete: (item, index) => {
                  return (
                    <td>
                      <CInputGroup style={{ flexWrap: "nowrap" }}>
                        <CButton style={{ color: "#fff", backgroundColor: "#007bff", borderColor: "#007bff", borderRadius: "0.25rem", marginRight: "5px" }} type="button" color="secondary" variant="outline" onClick={() => edit(item)}>Edit</CButton>
                        <CButton style={{ color: "#fff", backgroundColor: "#dc3545", borderColor: "#dc3545", borderRadius: "0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item, item.id, index)} >Delete</CButton>
                      </CInputGroup>
                      <CInputGroup style={{ flexWrap: "nowrap", marginTop: "5px" }}>
                        {/* <CButton style={{ color: "#fff", backgroundColor: "#007bff", borderColor: "#007bff", borderRadius: "0.25rem", marginRight: "5px" }} type="button" color="secondary" variant="outline" onClick={() => addItem(item)}>Add To Today's Deal</CButton> */}
                        <CButton style={{ color: "#fff", backgroundColor: "#321fdb", borderColor: "#321fdb", borderRadius: "0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => addVendor(item.id)} >Add Vendors</CButton>
                      </CInputGroup>
                    </td>
                  );
                },
                show_update: (item, index) => {
                  return (
                    <td>
                      <CInputGroup style={{ flexWrap: "nowrap" }}>
                        <CButton style={{ color: "#fff", backgroundColor: "#007bff",
                         borderColor: "#007bff", borderRadius: "0.25rem", marginRight: "5px" }} 
                         type="button" color="secondary" variant="outline" onClick={() => addIntoTodayDeals(item, item.id, index)}>TodayDeal</CButton>
                        <CButton style={{ color: "#fff", backgroundColor: "#dc3545", borderColor: "#dc3545",
                         borderRadius: "0.25rem" }} type="button" color="secondary" variant="outline" 
                         onClick={() => addIntoBestSeller(item, item.id, index)} >BestSeller</CButton>
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

export default Product;
