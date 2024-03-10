import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CBadge,
  CImg,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CButton,
  CDataTable,
  CRow,
  CSpinner,
  CSwitch,
  CTextarea,
  CInputGroup,
  CLabel,
  CPagination
} from "@coreui/react";
import Switch from "./Switch";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CWidgetProgress,
  CWidgetSimple,
  CForm,
  CFormGroup,
} from "@coreui/react";
// import {
//    }from '@coreui/react/src/components/table'
import firebase from "../../config/fbconfig";
// import CIcon from "@coreui/icons-react";
// import CustomerName from "../CustomerNameComponent";
// import ServiceProviderName from "../ServiceProviderNameComponent";
import {
  getProvider,
  getService,
  getUser,
  getReferral,
} from "../../utils/database_fetch_methods";
import { exportDataToXLSX } from "../../utils/exportData";
import orderPdf from "../../utils/orderpdf";
import { isSymbol } from "lodash";

const Services = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [refresh, setRefresh] = React.useState(false);
  const [loading, setLoading] = useState(false);
  var [cat, setCat] = useState([]);
  var [state, setState] = useState({
    orders: null,
    collapse: false,
  });
  const [orderMaker, setOrderMaker] = useState("");

  const [lastOrder, setLastOrder] = useState("");

  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    getOrders();
    getData();
  }, []);

  // function compare(b, a) {
  //   var id = "timestamp";
  //   if (a[id] < b[id]) {
  //     return -1;
  //   }
  //   if (a[id] > b[id]) {
  //     return 1;
  //   }
  //   return 0;
  // }
   
  // const updatedStatus = async (s , a) => {
  //   const updateStatus = {
  //     status: s,
  //   };
  //   try {
  //     await firebase
  //       .firestore()
  //       .collection("orders")
  //       .doc(a)
  //       .update(updateStatus);
  //        getOrders();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const getData = async () => {
    const response=await firebase.firestore().collection("categories");
    const data=await response.get();
    data.docs.forEach(item=>{
      cat.push({id:item.id,...item.data()});
    })
    setCat([...cat,cat])
  };
  
  const getOrders = async () => {
    // fetching orders and filtering it for missing mandatory fields
    setLoading(true);
    const docs = (
      await firebase
        .firestore()
        .collection("products")
        .orderBy("categoryName")
        .get()
    ).docs;
    
    setLastOrder(docs[docs.length - 1]);

    const value = docs.filter((doc) => {
      if (
        !(
          doc.data().category,
          doc.data().categoryName,
          doc.data().subCategory,          
          doc.data().description,          
          doc.data().brandName,
          doc.data().imageUrl ,
          doc.data().productPriority,
          doc.data().society ,
          doc.data().shop ,
          doc.data().hotel ,
          doc.data().type,
          doc.data().name
          // doc.data().customer_id &&
          // doc.data().service &&
          // doc.data().service["service_id"] &&
          // doc.data().service["sub_service_id"]
        )
      ) {
        // console.log(doc.data());
      }
      return (
          doc.data().category,
          doc.data().categoryName,
          doc.data().subCategory,
          // doc.data().name,         
          doc.data().description,          
          doc.data().brandName,
          doc.data().imageUrl ,
          doc.data().productPriority,
          doc.data().society ,
          doc.data().shop ,
          doc.data().hotel ,
          doc.data().type,
          doc.data().name
        // doc.data().customer_id &&
        // doc.data().service &&
        // doc.data().service["service_id"] &&
        // doc.data().service["sub_service_id"]
      );
    });

    // resolving individual orders for meta field data
    let processedOrders = await Promise.all(
      value.map(async (doc) => {
        const order = doc.data();
        // const [
        //   resolvedProvider,
        //   resolvedService,
        //   resolvedCustomer,
        //   resolvedReferral,
        // ] = await Promise.all([
        //   getProvider(order.provider_id),
        //   getService(order.service.service_id, order.service.sub_service_id),
        //   getUser(order.customer_id),
        //   // getUser(order.ref)
        //   getReferral(order.customer_id),
        // ]);
        // const supervisorsDocs = await firebase
        //   .firestore()
        //   .collection("supervisorJobs")
        //   .where("parent_TicketId", "==", order.ticketId || "")
        //   .get();
        // const [resolvedSupervisor] = await Promise.all(
        //   supervisorsDocs.docs.map(async (doc) => {
        //     const provider = await firebase
        //       .firestore()
        //       .collection("providers")
        //       .doc(doc.data().provider)
        //       .get();
        //     return {
        //       supervisorName:
        //         provider.data()?.name ||
        //         provider.data()?.phone ||
        //         "Not Assigned",
        //     };
        //   })
        // );
        // setOrderMaker(resolvedCustomer);
        return {
          ...order,
          id: doc.id,
          // provider_name: resolvedProvider.name
          //   ? resolvedProvider.name
          //   : resolvedProvider.phone,
          // service_name: resolvedService.service.name,
          // sub_service_name: resolvedService.sub_service.name,
          // customer: resolvedCustomer.phone,
          // payment_status: order.total
          //   ? order.amountPaid < order.total
          //     ? "pending"
          //     : "paid"
          //   : "pending",
          // total_amount: order.total,
          // referred_by: resolvedReferral,
          // supervisorName: resolvedSupervisor?.supervisorName || "Not Assigned",
        };
      })
    );

    // processedOrders = processedOrders.sort(compare);
    // console.log(processedOrders);
    setState({
      ...state,
      orders: processedOrders,
    });

    setLoading(false);
  };
  // console.log(state.orders);

  const edit = (rowId) => {
    history.push(
      {
      pathname: '/edit_service',
      state: rowId
      }
    )
  };

  const toggle = async(rowId,colId) => {
    console.log(rowId);
    console.log(colId);
   if(colId===true){
    await firebase.firestore().collection("products").doc(rowId).update({
      isActive:false,
    })
    getOrders();
   }else{
    await firebase.firestore().collection("products").doc(rowId).update({
      isActive:true,
    })
    getOrders();
   } 
  };


  const remove = (rowId) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure to Delete the Product?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("products").doc(rowId).delete();
            getOrders();
            // firebase
            //   .storage()
            //   .ref()
            //   .child("providers/" + match.params.id + "/verification_document")
            //   .delete()
            //   .then((url) => {
            //     console.log(url);
                alert("Product Deleted");
                setRefresh(!refresh);
            //   });
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
  const onExportData = async () => {
    const filteredData = state.orders
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
        ticketId: order.ticketId,
        timestamp: order.timestamp,
        city: order.city,
        provider_name: order.provider_name,
        customer: order.customer,
        service_name: order.service_name,
        sub_service_name: order.sub_service_name,
        payment_status: order.payment_status,
        status: order.status,
        time: order.time,
        total_amount: order.total,
        supervisorName: order.supervisorName,
      }));

    exportDataToXLSX(filteredData, "ordersList");
  };

  // const loadMoreOrders = async () => {
  //   setPageLoading(true);
  //   const docs = (
  //     await firebase
  //       .firestore()
  //       .collection("products")
  //       .orderBy("categoryName")
  //       .startAfter(lastOrder)
  //       .limit(50)
  //       .get()
  //   ).docs;

  //   setLastOrder(docs[docs.length - 1]);

  //   const value = docs.filter((doc) => {
  //     if (
  //       !(
  //         doc.data().category &&
  //         doc.data().categoryName &&
  //         doc.data().subCategory &&
  //         doc.data().name &&          
  //         doc.data().description,          
  //         doc.data().brandName,
  //         doc.data().imageUrl ,
  //         doc.data().productPriority,
  //         doc.data().society ,
  //         doc.data().shop ,
  //         doc.data().hotel ,
  //         doc.data().type
  //         // doc.data().service["sub_service_id"]
  //       )
  //     ) {
  //       // console.log(doc.data());
  //     }
  //     return (
  //       doc.data().category &&
  //         doc.data().categoryName &&
  //         doc.data().subCategory &&
  //         doc.data().name &&          
  //         doc.data().description,          
  //         doc.data().brandName,
  //         doc.data().imageUrl ,
  //         doc.data().productPriority,
  //         doc.data().society ,
  //         doc.data().shop ,
  //         doc.data().hotel ,
  //         doc.data().type
  //     );
  //   });

  //   // resolving individual orders for meta field data
  //   let processedOrders = await Promise.all(
  //     value.map(async (doc) => {
  //       const order = doc.data();
  //       // const [
  //       //   resolvedProvider,
  //       //   resolvedService,
  //       //   resolvedCustomer,
  //       //   resolvedReferral,
  //       // ] = await Promise.all([
  //       //   getProvider(order.provider_id),
  //       //   getService(order.service.service_id, order.service.sub_service_id),
  //       //   getUser(order.customer_id),
  //       //   // getUser(order.ref)
  //       //   getReferral(order.customer_id),
  //       // ]);
  //       // const supervisorsDocs = await firebase
  //       //   .firestore()
  //       //   .collection("supervisorJobs")
  //       //   .where("parent_TicketId", "==", order.ticketId || "")
  //       //   .get();
  //       // const [resolvedSupervisor] = await Promise.all(
  //       //   supervisorsDocs.docs.map(async (doc) => {
  //       //     const provider = await firebase
  //       //       .firestore()
  //       //       .collection("providers")
  //       //       .doc(doc.data().provider)
  //       //       .get();
  //       //     return {
  //       //       supervisorName:
  //       //         provider.data()?.name ||
  //       //         provider.data()?.phone ||
  //       //         "Not Assigned",
  //       //     };
  //       //   })
  //       // );
  //       // setOrderMaker(resolvedCustomer);
  //       return {
  //         ...order,
  //         id: doc.id,
  //         // provider_name: resolvedProvider.name
  //         //   ? resolvedProvider.name
  //         //   : resolvedProvider.phone,
  //         // service_name: resolvedService.service.name,
  //         // sub_service_name: resolvedService.sub_service.name,
  //         // customer: resolvedCustomer.phone,
  //         // payment_status: order.total
  //         //   ? order.amountPaid < order.total
  //         //     ? "pending"
  //         //     : "paid"
  //         //   : "pending",
  //         // total_amount: order.total,
  //         // referred_by: resolvedReferral,
  //         // supervisorName: resolvedSupervisor?.supervisorName || "Not Assigned",
  //       };
  //     })
  //   );

  //   processedOrders = processedOrders.sort(compare);

  //   setState({
  //     ...state,
  //     orders: [...state.orders, ...processedOrders],
  //   });
  //   setPageLoading(false);
  // };

  return (
    <CRow>
      {/* <CCol xl={12} className="d-flex justify-content-end">
        <CButton color="info" className="mb-2 mr-2" onClick={onExportData}>
          Export Data
        </CButton>
        <CButton
          color="info"
          className="mb-2 mr-2"
          onClick={() => history.push(`/orders/requestedOrders`)}
        >
          Order Requests
        </CButton>
        <CButton
          color="info"
          className="mb-2 mr-2"
          onClick={() => history.push(`/orders/cancelledOrders`)}
        >
          Cancelled Orders
        </CButton>
        <CButton
          color="primary"
          className="mb-2"
          onClick={() => history.push(`/orders/create_order`)}
        >
          Create Order
        </CButton>
      </CCol> */}
      <CCol xl={12}></CCol>
      <CCol xl={12}>
        <CCard>
          <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>Product List</CCardHeader>
          <CCardBody style={{textAlign: "center"}}>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onColumnFilterChange={(e) => {
                setTableFilters(e);
              }}
              onSorterValueChange={(e) => {
                console.log(e);
              }}
              items={state.orders}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "productPriority", label: "Product Priority No.", filter: true },
                { key: "categoryName", label: " Category", filter: true },
                { key: "subCategory", label: "Sub Category", filter: true },
                { key: "name", filter: true, label: "Product Name" },
                { key: "imageUrl",label:"Product Image", filter: false },
                { key: "description", filter: true, label: "Product Description" },
                { key: "price", filter: false, label: "Product Price" },
                { key: "producttype", label: " Product Type", filter: true },
                { key: "active", label: " Active/Inactive", filter: true },
                { key: "action", label: " Action", filter: false },
                // {
                //   key: "Order_Bill",
                //   label: "",
                //   // _style: { width: '5%' },
                //   sorter: false,
                //   filter: false,
                // },
                // {
                //   key: "Duplicate_Order",
                //   label: "",
                //   // _style: { width: '5%' },
                //   sorter: false,
                //   filter: false,
                // },
                // {
                //   key: "supervise_Order",
                //   label: "",
                //   // _style: { width: '5%' },
                //   sorter: false,
                //   filter: false,
                // },
                // {
                //   key: "editReferrer",
                //   label: "",
                //   // _style: { width: '5%' },
                //   sorter: false,
                //   filter: false,
                // },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {/* <CTextarea
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      > */}
                        {index+1}
                      {/* </CTextarea> */}
                    </td>
                  );
                },
                product: (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {/* <CTextarea
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      > */}
                        {item.productPriority}
                      {/* </CTextarea> */}
                    </td>
                  );
                },
                categoryName: (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                    {cat.filter(x => x.id === item.category).map( sub =>{
                        return( 
                          <p>{sub.name}</p>
                        )
                      })
                    }
                    </td>
                  );
                },

                subCategory:  (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {/* <CTextarea
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      > */}
                        {item.subCategory}
                      {/* </CTextarea> */}
                    </td>
                  );
                },

                name:  (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {/* <CTextarea
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      > */}
                        {item.name}
                        <div><b>
                          {item.brandName}</b>
                        </div>
                      {/* </CTextarea> */}
                    </td>
                  );
                },

                imageUrl:  (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {
                        item.imageUrl.map((url,index)=>{
                          return(
                            <CImg
                            key={index}
                            rounded="true"
                            src={url}
                            width={90}
                            height={90}
                          />
                          )
                        })
                      }
                      
                    </td>
                  );
                },

                description:  (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {/* <CTextarea
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      > */}
                        {item.description}
                      {/* </CTextarea> */}
                    </td>
                  );
                },

                price:  (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff",width:"15%"}}>
                      {/* <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      > */}
                        {item.society.map((val) => {
                          return <div style={{ fontWeight: "bold"}}>Society:
                                    <span>{val.weight+val.unit}  <span style={{textDecoration: "line-through"}}>₹{val.originalPrice}</span><span>₹{val.discountedPrice}</span> </span>
                                  </div>
                        })}
                        {item.shop.map((val) => {
                          return  <div style={{ fontWeight: "bold"}}>Shop:
                                    <span>{val.weight+val.unit}  <span style={{textDecoration: "line-through"}}>₹{val.originalPrice}</span><span>₹{val.discountedPrice}</span> </span>
                                  </div>
                        })}
                        {item.hotel.map((val) => {
                          return  <div style={{ fontWeight: "bold"}}>Hotel:
                                    <span>{val.weight+val.unit}  <span style={{textDecoration: "line-through"}}>₹{val.originalPrice}</span><span>₹{val.discountedPrice}</span> </span>
                                  </div>
                        })}
                      {/* </CButton> */}
                    </td>
                  );
                },
                producttype: (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {/* <CTextarea
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      > */}
                        {item.type}
                      {/* </CTextarea> */}
                    </td>
                  );
                },
                active: (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {/* <CLabel>{item.id}</CLabel> */}
                        {/* {
                          
                          <Switch
                          isOn={item.isActive}
                          onColor="#EF476F"
                          handleToggle={(e) => toggle(e.item.id,item.isActive)
                        }
                        /> */}
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
                  );
                },
                action: (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {/* <CTextarea
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      > */}
                        {
                           <CInputGroup style={{flexWrap: "nowrap"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#f8b11c",borderColor: "#f8b11c", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => edit(item)}>Edit</CButton>
                              <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={()=>remove(item.id)}>Delete</CButton>
                           </CInputGroup>
                        }
                      {/* </CTextarea> */}
                    </td>
                  );
                },
                // payment_status: (item) => {
                //   return (
                //     <td>
                //       {item.payment_status === "pending" ? (
                //         <CBadge color="danger"> Pending </CBadge>
                //       ) : (
                //         <CBadge color="success">Paid</CBadge>
                //       )}
                //     </td>
                //   );
                // },
                // Order_Bill: (item, index) => {
                //   return (
                //     <td className="py-2">
                //       <CButton
                //         color="primary"
                //         variant="outline"
                //         shape="square"
                //         size="sm"
                //         onClick={() => {
                //           orderPdf(item);
                //         }}
                //       >
                //         Download Pdf
                //       </CButton>
                //     </td>
                //   );
                // },
                // show_details: (item, index) => {
                //   return (
                //     <td className="py-2">
                //       <CButton
                //         color="primary"
                //         variant="outline"
                //         shape="square"
                //         size="sm"
                //         onClick={() => history.push(`/orders/${item.id}`)}
                //       >
                //         Show Details
                //       </CButton>
                //     </td>
                //   );
                // },
                // Duplicate_Order: (item, index) => {
                //   return (
                //     <td className="py-2">
                //       <CButton
                //         color="primary"
                //         variant="outline"
                //         shape="square"
                //         size="sm"
                //         onClick={() =>
                //           history.push(`/orders/duplicateOrder/${item.id}`)
                //         }
                //       >
                //         Duplicate Order
                //       </CButton>
                //     </td>
                //   );
                // },
                // supervise_Order: (item, index) => {
                //   return (
                //     <td className="py-2">
                //       <CButton
                //         color="primary"
                //         variant="outline"
                //         shape="square"
                //         size="sm"
                //         onClick={() =>
                //           history.push(`/orders/supervisor/${item.id}`)
                //         }
                //       >
                //         Supervise Order
                //       </CButton>
                //     </td>
                //   );
                // },
                // editReferrer: (item, index) => {
                //   return (
                //     <td className="py-2">
                //       <CButton
                //         color="primary"
                //         variant="outline"
                //         shape="square"
                //         size="sm"
                //         onClick={() =>
                //           history.push(`editReferral/${item.customer_id}`)
                //         }
                //       >
                //         Edit Referrer
                //       </CButton>
                //     </td>
                //   );
                // },
              }}
              hover
              striped
              columnFilter
              pagination
              // tableFilter
              sorter
              // itemsPerPageSelect
              itemsPerPage={30}
              // footer
              // // itemsPerPageSelect
              // itemsPerPage={5}
              
              // pagination
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
            {/* <CPagination
              activePage={page}
              onActivePageChange={pageChange}
              pages={5}
              doubleArrows={false}
              align="center"
            /> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Services;
