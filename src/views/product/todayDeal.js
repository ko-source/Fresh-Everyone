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

const TodayDeal = () => {
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
    const videos = await firebase.firestore().collection("TodayDeals").get();
    // console.log(videos.docs.length);

    const resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        categoryName:videoData.categoryName,
        image:videoData.image,
        name:videoData.name,
        price:videoData.price,
        quantity:videoData.quantity,
        weight:videoData.weight,
        weightType:videoData.weightType,
        productId:videoData.productId,
        // title: videoData.mainText,
        // // service: videoData.cat,
        // discAmt:videoData.discountRate,
        // imageUrl:videoData.imgUrl,
        // subTitle:videoData.descText,
        // couponCode:videoData.couponCode 
        // name: videoData.code,
        // discountType: videoData.type,
        // discountAmount:videoData.discount,
        // minimumAmount:videoData. minOrder,
        // expiryDate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(videoData.validity),
        // isActive:videoData.isActive,
      };
    });


    setState({
      ...state,
      videos: resolvedVideos,
    });
    setCat(resolvedVideos)
    setLoading(false);
  };
  const toggle = async(rowId,colId) => {
   if(colId===true){
    await firebase.firestore().collection("Offers").doc(rowId).update({
      isActive:false,
    })
    getVideos();
   }else{
    await firebase.firestore().collection("Offers").doc(rowId).update({
      isActive:true,
    })
    getVideos();
   } 
  };
  const deleteVideo = (docid,index) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            // const updateddata = rowId.filter((socPrice,i) => index != i );
            // console.log(updateddata);
            
            await firebase.firestore().collection("TodayDeals").doc(docid).delete().then(()=>{
              alert("Deal Deleted");
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
      pathname: '/coupon/edit-coupon',
      state: rowId
      }
    )
  };
  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Today's Deal List</CCardHeader>
          <CCardBody style={{textAlign:"center"}}>
            <CDataTable style={{border:"5px solid black",textAlign: "center"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[  
                { key: "sNo", label: "Sr No",filter: false },              
                // { key: "Id", label: "Today's Deal",filter: false },
                { key: "categoryName", label: "Category Name",filter: true },
                { key: "productId", label: "Product Id",filter: true },
                { key: "name", label: "Name",filter: true },
                { key: "price", label: "Price",filter: true },
                { key: "quantity", label: "Quantity",filter: true },
                { key: "weight", label: "Weight",filter: true },
                { key: "weightType", label: "Weight Type",filter: true },
                { key: "image", label: "Image",filter: false },
                { key: "actions", label: "Action",filter: false },

              ]}
              scopedSlots={{

                // category: (item) => (
                //     <td>
                //       {item.category.map((sub,index)=>{
                //         return(
                //           <div>
                //             <CRow>
                //               <CCol>
                //               <div><b>Product Name :</b>{sub.productName}</div>
                //               <div><b>Price :</b>{sub.price}</div>
                //               <div><b>Quantity :</b>{sub.quantity}</div>
                //               <div><b>Weight :</b>{sub.weight}</div>
                //               <div><b>Category :</b>{sub.categoryName}</div>
                //               {/* <div><b>Vendor Id :</b>{sub.vendorId}</div> */}
                //               <div><b>Image :</b><CImg
                //                                 rounded="true"
                //                                 src={sub.image}
                //                                 width={100}
                //                                 height={100}
                //                               /></div>
                //               <hr></hr>
                //               </CCol>
                //               <CCol>
                //               </CCol>
                //             </CRow>
                            
                //           </div>
                //         )
                //       })}
                //     </td>
                // ),
                sNo: (item,index) => (
                  <td>
                      {index+1}
                  </td>
                ),
                categoryName: (item) => (
                  <td>
                      {item.categoryName}
                  </td>
                ),
                productId: (item) => (
                  <td>
                      {item.productId}
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
                actions: (item) => (
                  <td>
                    <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id,)}>Delete</CButton>
                  </td>
                ),
                
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

export default TodayDeal;
