import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CInputGroup,
  CInputGroupAppend,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CCard,
  CButton,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CInput,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import {
  getOrder,
  getProvider,
  getReferral,
  getService,
} from "../../utils/database_fetch_methods";

const ReferralCodes = () => {
  const history = useHistory();

  var [state, setState] = useState({
    codes: null,
    selectedOrder: null,
    showAlert: false,
  });
  useEffect(() => {
    getReferralCodes();
    getCompletedOrders();
  }, []);

  const getReferralCodes = async () => {
    console.log("inside codes");
    let value = await firebase.firestore().collection("referralCodes").get();

    const promisedData = value.docs
      .filter((doc) => !!doc.data().orders)
      .map(async (doc) => {
        const referral = doc.data();
        const resolvedOrder = await getOrder(referral.orders[0].id);

        const [resolvedProvider, resolvedServices] = await Promise.all([
          getProvider(resolvedOrder.provider_id),
          getService(
            resolvedOrder.service.service_id,
            resolvedOrder.service.sub_service_id
          ),
        ]);

        return {
          // ...doc.data(),
          ...referral,
          id: doc.id,
          referralCode: referral.referralCode,
          order_ticketId: resolvedOrder.ticketId,
          order_timestamp: resolvedOrder.timestamp,
          order_status: resolvedOrder.status,
          order_time: resolvedOrder.time,
          order_provider_name: resolvedProvider.name,
          order_service_name: resolvedServices.service.name,
          order_sub_service_name: resolvedServices.sub_service.name,
          order_remark: referral.orders[0].reason,
        };
      });

    const resolvedData = await Promise.all(promisedData);

    console.log(resolvedData);
    setState({
      ...state,
      codes: resolvedData,
    });
  };

  const getCompletedOrders = async () => {
    let value = await firebase.firestore().collection("orders").get();

    const promisedData = value.docs
      .filter((doc) => doc.data().status === "completed")
      .map(async (doc) => {
        const referral = doc.data();
        // const resolvedOrder = await getOrder(referral.orders[0].id);
        // const status=await resolvedOrder.status;

        const [resolvedProvider, resolvedServices, resolvedReferral] =
          await Promise.all([
            getProvider(referral.provider_id),
            getService(
              referral.service.service_id,
              referral.service.sub_service_id
            ),
            getReferral(referral.customer_id),
          ]);
        return {
          // ...doc.data(),
          ...referral,
          // id: resolvedReferral,
          id: doc.id,
          referralCode: referral.referralCode,
          order_ticketId: referral.ticketId,
          order_timestamp: referral.timestamp,
          order_status: referral.status,
          order_time: referral.time,
          order_provider_name: resolvedProvider.name,
          order_service_name: resolvedServices.service.name,
          order_sub_service_name: resolvedServices.sub_service.name,
          // order_remark: referral.orders[0].reason
          total_amount: referral.total,
          city: referral.city,
        };
      });
    const resolvedData = await Promise.all(promisedData);
    // console.log(resolvedData);
    setState({
      ...state,
      codes: resolvedData,
    });
  };

  const payToOwnerOfReferralCode = (ownerId, ownerType) => {
    // console.log(ownerId);
    firebase
      .firestore()
      .collection(ownerType + "s")
      .doc(ownerId)
      .update({
        credits: firebase.firestore.FieldValue.increment(
          state.selectedOrder.amount
        ),
        statement: firebase.firestore.FieldValue.arrayUnion({
          amount: state.selectedOrder.amount,
          id: state.selectedOrder.id,
        }),
      })
      .then((value) => {
        setState({
          ...state,
          showAlert: true,
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <CToaster position="top-center">
        <CToast
          onStateChange={(e) => {
            if (e === false) {
              setState({
                ...state,
                showAlert: false,
              });
            }
          }}
          show={state.showAlert}
          autohide={3000}
          fade={true}
        >
          <CToastHeader closeButton={true}>Updated</CToastHeader>
          <CToastBody>{`Credits transferred successfully`}</CToastBody>
        </CToast>
      </CToaster>

      <CRow>
        <CCol xl={12} className="d-flex justify-content-end">
          <CButton
            color="primary"
            className="mb-2"
            onClick={() => history.push(`/referralCodes/new_referrals`)}
          >
            New Referrals
          </CButton>
        </CCol>
        <CCol xl={12}></CCol>
        <CCol xl={12}>
          <CCard>
            <CCardHeader color="secondary">
              ReferralCodes
              <div className="card-header-actions"></div>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                fields={[
                  { key: "referralCode", filter: true },
                  { label: "Ticket Id", key: "order_ticketId", filter: true },
                  // { label: 'Remark', key: 'order_remark', filter: true, },
                  { key: "city", filter: true },
                  {
                    label: "Employee",
                    key: "order_provider_name",
                    filter: true,
                  },
                  { label: "Order Time", key: "order_time", filter: true },
                  // { label: 'Last Updated', key: 'order_timestamp', filter: true, },
                  { label: "Status", key: "order_status", filter: true },
                  { label: "Service", key: "order_service_name", filter: true },
                  {
                    label: "Sub Service",
                    key: "order_sub_service_name",
                    filter: true,
                  },
                  {
                    key: "total_amount",
                    label: "Total Amount",
                    filter: false,
                    sorter: false,
                  },
                  { label: "Action", key: "action", filter: false },
                ]}
                items={state.codes}
                hover
                striped
                columnFilter
                scopedSlots={{
                  // order_provider_name: (order) => <td>{order.order_provider.name}</td>,
                  order_ticketId: (item, index) => {
                    return (
                      <td className="py-2">
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={() => history.push(`/orders/${item.id}`)}
                        >
                          {item.order_ticketId}
                        </CButton>
                      </td>
                    );
                  },
                  action: (order) => {
                    return (
                      <td>
                        <CInputGroup>
                          <CInput
                            type="number"
                            placeholder="Bonus amount"
                            onChange={(e) => {
                              setState({
                                ...state,
                                selectedOrder: {
                                  ...order,
                                  amount: parseFloat(e.target.value),
                                  code: order.id,
                                },
                              });
                            }}
                          />
                          <CInputGroupAppend>
                            <CButton
                              disabled={
                                state.selectedOrder?.id !== order.id ||
                                state.selectedOrder?.code !== order.id
                              }
                              onClick={(e) => {
                                payToOwnerOfReferralCode(
                                  order["owner"],
                                  order["owner_type"]
                                );
                              }}
                              className={"bg-info text-white"}
                            >
                              Pay
                            </CButton>
                          </CInputGroupAppend>
                        </CInputGroup>
                      </td>
                    );
                  },
                }}
              />

              {/* <table className='table'>
                <thead>
                  <tr>
                    <th>Referral Code</th>
                    <th>Ticket Id</th>
                    <th>Remark</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {state.codes ? (
                  <tbody>
                    {state.codes.map(code => {
                      return code['orders'] ? (
                        code['orders'].map(order => {
                          return (
                            <tr key={order.id}>
                              <td

                              // onClick={()=>
                              //   history.push(
                              //   `/referralCodes/${code.id}`
                              // )
                              // }
                              >
                                {code['referralCode']}
                              </td>


                              <td>{order['ticketId']}</td>
                              <td>{order['reason']}</td>
                              <td>
                                <CInputGroup>
                                  <CInput
                                    type='number'
                                    placeholder='Bonus amount'
                                    onChange={e => {
                                      setState({
                                        ...state,
                                        selectedOrder: {
                                          ...order,
                                          amount: parseFloat(e.target.value),
                                          code: code.id,
                                        },
                                      });
                                    }}
                                  />
                                  <CInputGroupAppend>
                                    <CButton
                                      disabled={
                                        state.selectedOrder?.id !==
                                        order['id'] ||
                                        state.selectedOrder?.code !== code.id
                                      }
                                      onClick={e => {
                                        payToOwnerOfReferralCode(
                                          code['owner'],
                                          code['owner_type']
                                        );
                                      }}
                                      className={'bg-info text-white'}>
                                      Pay
                                    </CButton>
                                  </CInputGroupAppend>
                                </CInputGroup>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                          <></>
                        );
                    })}
                  </tbody>
                ) : (
                    <></>
                  )}
              </table> */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ReferralCodes;
