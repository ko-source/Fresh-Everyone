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

const Coupon = () => {
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
    const videos = await firebase.firestore().collection("coupons").get();
    // console.log(videos.docs.length);

    const resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        couponsList:videoData.couponsList
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
  const deleteVideo = (rowId,docid,index) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            const updateddata = rowId.filter((socPrice,i) => index != i );
            console.log(updateddata);
            
            await firebase.firestore().collection("coupons").doc(docid).update({
              couponsList:updateddata
            });
            alert("Coupon Deleted");
            getVideos();
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
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >Coupons List</CCardHeader>
          <CCardBody style={{textAlign:"center"}}>
            <CDataTable style={{border:"5px solid black",textAlign: "center"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={state.videos}
              fields={[
                // { key: "srno", label: "Sr. No.", filter: true },
                // { key: "couponCode", label: "Coupon Code",filter: true },
                // { key: "title", label: "Title",filter: true },
                // // { key: "service", label: "Service Name",filter: true },
                // { key: "discAmt", label: "Discount Amount",filter: true },
                // { key: "image", label: "Coupon Image",filter: true },
                // { key: "subTitle", label: "Sub Title",filter: true },
                
                { key: "couponsList", label: "Coupons",filter: false },
                // { key: "societyName", label:"Society Name",filter: true },
                // { key: "expiryDate", label:"Expiry Date",filter: true }, 
                // { key: "discountAmount", label: "Discount Rate",filter: true },
                // { key: "minimumAmount", label:"Minimum Order Amount",filter: true },0
                // { key: "isActive", label: "Is Active",filter: true },
                // { key: "status" },
                // { key: "show_delete", label: "Action" },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
                    </td>
                  );
                },
                couponCode: (item) => (
                  <td>
                    {item.couponCode}
                  </td>
                ),
                title: (item) => (
                  <td>
                    {item.title}
                  </td>
                ),
                service: (item) => (
                  <td>
                    {item.service}
                  </td>
                ),
                discAmt: (item) => (
                  <td>
                    {item.discAmt}
                  </td>
                ),
                subTitle: (item) => (
                  <td>
                    {item.subTitle}
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

                couponsList: (item) => (
                    <td>
                      {item.couponsList.map((sub,index)=>{
                        return(
                          <div>
                            <CRow>
                              <CCol>
                              <div><b>Title :</b>{sub.title}</div>
                              <div><b>Sub Title :</b>{sub.subtitle}</div>
                              <div><b>Coupon Code :</b>{sub.couponCode}</div>
                              <div><b>Discount :</b>{sub.discount}</div>
                              <div><b>Product Id :</b>{sub.productId}</div>
                              <hr></hr>
                              </CCol>
                              <CCol>
                                <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.couponsList,item.id,index)}>Delete</CButton>
                              </CCol>
                            </CRow>
                            
                          </div>
                        )
                      })}
                    </td>
                ),
                societyName: (item) => (
                  <td>
                    {item.societyName}
                  </td>
                  ),
                expiryDate: (item) => (
                <td>
                  {item.expiryDate}
                </td>
                ),
                discountAmount: (item) => (
                  <td>
                    {item.discountType=="Flat"?item.discountType+" ₹"+item.discountAmount:item.discountAmount+"%"}

                  </td>
                ),
                minimumAmount: (item) => (
                    <td>
                        {item.minimumAmount}
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
                              <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item.id)} >Delete</CButton>
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

export default Coupon;
