import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CreateServiceModal from "../services/createServiceModal";
import {
  CToast,
  CInputGroup,
  CInputGroupAppend,
  CButtonToolbar,
  CToastHeader,
  CToastBody,
  CToaster,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CImg,
  CModal,
  CSwitch,
  CInput,
  CDataTable,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CCardText,
  CInputGroupText,
  CSpinner,
  CFormGroup,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import firebase from "../../config/fbconfig";
import ServiceName from "../ServiceNameComponent";
import SubServiceName from "../SubServiceNameComponent";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
// import UpdateProvider from "./updateProvider";

const ServiceProvider = ({ match }) => {
  var [state, setState] = useState({
    details: null,
    showImg: false,
    showAlert: false,

    imageUrl: "",
  });
  var [bl, blState] = useState("");

  const [image, setImage] = useState({
    url: "",
    object: "",
  });
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    getServiceProvider();
  }, []);

  const getServiceProvider = () => {
    firebase
      .firestore()
      .collection("providers")
      .doc(match.params.id)
      .get()
      .then((value) => {
        // console.log(value.data());
        setState({
          ...state,
          details: value.data()
            ? value.data()
            : [
                [
                  "id",
                  <span>
                    <CIcon className="text-muted" name="cui-icon-ban" /> Not
                    found
                  </span>,
                ],
              ],
        });
        setImage({ ...image, url: value.data()?.imageUrl || null });
        blState(
          value.data()?.blacklisted === true
            ? "Remove From BlackList"
            : "Add To BlackList"
        );
      });
  };

  const getVerificationDocument = () => {
    // TODO: providers/....
    firebase
      .storage()
      .ref()
      .child("providers/" + match.params.id + "/verification_document")
      .getDownloadURL()
      .then((url) => {
        console.log(url);

        setState({
          ...state,
          imageUrl: url,
          showImg: true,
        });
      });
  };

  const updateServiceProvider = (e) => {
    e.preventDefault();

    var list = state.details.services;
    list = list
      .map((s) => (s.reduceChargeAfter ? s : { ...s, reduceChargeAfter: 0 }))
      .map((s) =>
        s.reduceChargePercent ? s : { ...s, reduceChargePercent: 100 }
      )
      .map((s) => (s.guaranteed ? s : { ...s, guaranteed: false }));
    state.details = { ...state.details, services: list };
    firebase
      .firestore()
      .collection("providers")
      .doc(match.params.id)
      .update({ ...state.details })
      .then(() => {
        setState({
          ...state,
          showAlert: true,
        });
      });
  };

  const history = useHistory();

  const showDocument = () => {
    if (!state.showImg) {
      getVerificationDocument();
    } else {
      setState({
        ...state,
        showImg: false,
      });
    }
  };

  function getChargeType(s) {
    switch (s) {
      case "hourly":
        return "hours";
      case "yearly":
        return "years";
      case "monthly":
        return "months";
      case "daily":
        return "days";
      case "estimate":
        return "estimate";
      default:
        return "";
    }
  }

  const addToBlackList = (m) => {
    if (m === "a") {
      firebase
        .firestore()
        .collection("providers")
        .doc(match.params.id)
        .update({ blacklisted: true })
        .then(() => {
          blState("Remove From BlackList");
        });
    } else if (m === "r") {
      firebase
        .firestore()
        .collection("providers")
        .doc(match.params.id)
        .update({ blacklisted: false })
        .then(() => {
          blState("Add To BlackList");
        });
    }
  };

  const confirmation = () => {
    if (bl === "Add To BlackList") {
      confirmAlert({
        title: "Confirm to BlackList",
        message: "Are you sure to blacklist this provider.",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              addToBlackList("a");
              alert("Added To BlackList");
            },
          },
          {
            label: "No",
            onClick: () => alert("Click No"),
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
    } else if (bl === "Remove From BlackList") {
      confirmAlert({
        title: "Confirm to Remove from BlackList",
        message: "Are you sure to remove provider from blacklist.",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              addToBlackList("r");
              alert("Removed From BlackList");
            },
          },
          {
            label: "No",
            onClick: () => alert("Click No"),
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
    }
  };

  const deleteVerificationDocument = () => {
    confirmAlert({
      title: "Delete Document",
      message: "Are you sure to DELETE the document.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            firebase
              .storage()
              .ref()
              .child("providers/" + match.params.id + "/verification_document")
              .delete()
              .then((url) => {
                console.log(url);
                alert("Document Deleted");
              });
          },
        },
        {
          label: "No",
          onClick: () => alert("Close"),
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

  const addImage = () => {
    console.log(image);
    console.log(match.params.id);
    setLoading(true);
    firebase
      .storage()
      .ref()
      .child(`providers/${match.params.id}/pic`)
      .put(image.object)
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        null,
        (err) => {
          setLoading(false);
          alert("Error: while uploading image");
          console.log(err);
        },
        () => {
          firebase
            .storage()
            .ref()
            .child(`providers/${match.params.id}/pic`)
            .getDownloadURL()
            .then((url) => {
              firebase
                .firestore()
                .collection("providers")
                .doc(match.params.id)
                .update({
                  imageUrl: url,
                })
                .then((data) => {
                  console.log("Done Uploading");
                  alert("Image uploaded Successfully");
                  setImage({
                    ...image,
                    url: url,
                  });
                  setLoading(false);
                });
            });
        }
      );
  };

  return (
    <>
      {/* <CAlert color="info" closeButton show={state.showAlert} onShowChange={() => {
        state.showAlert = 0;
      }}  >
        Updated
    </CAlert> */}
     
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
          <CToastBody>{`Your changes were saved`}</CToastBody>
        </CToast>
      </CToaster>

      <CModal show={state.showImg} onClose={showDocument}>
        <CModalHeader closeButton>Verification Document</CModalHeader>
        <CModalBody>
          <CImg src={state.imageUrl} className="img-fluid" />
          <br></br>
          <a href={state.imageUrl} target="_blank" rel="noopener noreferrer">
            Problem in viewing?
          </a>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={showDocument}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol lg={12}>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <span className="font-xl">Provider Details</span>
                <CButtonToolbar justify="start">
                  <CButton
                    color="info"
                    onClick={() =>
                      history.push(
                        `/service_providers/update/${match.params.id}`
                      )
                    }
                  >
                    Edit Provider
                  </CButton>
                  <CButton
                    style={{ marginLeft: "30px" }}
                    color="danger"
                    onClick={(value) => confirmation(value)}
                  >
                    {/*{state.details.blacklisted===true:'Add to BlackList'?'Remove From BlackList'}*/}
                    {/*{(() => {*/}
                    {/*  switch (state.details.blacklisted) {*/}
                    {/*    case null:   return "Add to BlackList";*/}
                    {/*    case false: return "Add to BlackList";*/}
                    {/*    case true:  return "Remove From BlackList";*/}
                    {/*    default:      return "Add to BlackList";*/}
                    {/*  }*/}
                    {/*})()}*/}
                    {bl}
                  </CButton>
                </CButtonToolbar>
              </div>
            </CCardHeader>
            <div className="table-responsive">
              <table className="table">
                {state.details ? (
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <td>{state.details.name}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{state.details.email}</td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>{state.details.phone}</td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td>{state.details.description}</td>
                    </tr>
                    <tr>
                      <th>Location</th>
                      <td>{state.details.location}</td>
                    </tr>
                    <tr>
                      <th>Credits</th>
                      <td>{state.details.credits}</td>
                    </tr>
                    <tr>
                      <th>Language</th>
                      <td>{state.details.language}</td>
                    </tr>
                    <tr>
                      <th>Range of service (in Kms)</th>
                      <td>{state.details.range}</td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}{" "}
              </table>
            </div>
          </CCard>
        </CCol>
        <CCol>
          <CCard textColor="white" color="twitter">
            <CCardHeader>
              <h3>Verification Status</h3>
            </CCardHeader>
            <CCardBody>
              {state.details ? (
                <>
                  <CSwitch
                    color="danger"
                    size="lg"
                    variant="3d"
                    checked={state.details.verified}
                    shape="pill"
                    onChange={(e) => {
                      state.details.verified = !state.details.verified;
                      updateServiceProvider(e);
                    }}
                  />
                  <h3>
                    {state.details.verified ? "Verified" : "Not Verified"}
                  </h3>
                </>
              ) : (
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CCard textColor="white" color="twitter">
            <CCardHeader>
              <h3>Available Status</h3>
            </CCardHeader>
            <CCardBody>
              {state.details ? (
                <>
                  <CSwitch
                    color="danger"
                    size="lg"
                    variant="3d"
                    checked={state.details.status}
                    shape="pill"
                    onChange={(e) => {
                      state.details.status = !state.details.status;
                      updateServiceProvider(e);
                    }}
                  />
                  <h3>
                    {state.details.status ? "Available" : "Not Available"}
                  </h3>
                </>
              ) : (
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CCard>
            <CCardHeader>
              <h3>Verification Document</h3>
            </CCardHeader>
            <CCardBody>
              {state.details ? (
                state.details.documentUploaded ? (
                  <>
                    <CIcon name="cilFile" size="2xl" onClick={showDocument} />
                    <CCardText>(click to view)</CCardText>
                    <CCardText>Document available</CCardText>
                  </>
                ) : (
                  <CCardText>No document available</CCardText>
                )
              ) : (
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </CCardBody>
            <CButton color="danger" onClick={deleteVerificationDocument}>
              Delete Document
            </CButton>
            {/* <CCardBody>

              {state.details ?

                state.details.documentUploaded ? <CRow>
                  <CCol>
                    <CIcon name="cilFile" onClick={showDocument} />

                  </CCol><CCol>
                    <CCardText>Document available</CCardText>
                  </CCol>
                </CRow>
                  :
                  <CCardText>No document available</CCardText>

                : <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>}
            </CCardBody> */}
          </CCard>
        </CCol>
       <CCol lg={12}>
          <CCard>
            <CCardHeader>
              Services
              <div className="card-header-actions d-flex">
                <CInput
                  type="number"
                  className="mr-3"
                  placeholder="Range(Kms)"
                  onChange={(e) => {
                    state.details.range = parseFloat(e.target.value);
                  }}
                />
                 
                <CButton color="primary" style={{ marginLeft: "10px" }} onClick={updateServiceProvider}>
                  Update
                </CButton>
              </div>
            </CCardHeader>

            <CCardBody>
              <CDataTable
                items={
                  state.details && state.details.services instanceof Array
                    ? state.details.services
                    : []
                }
                fields={[
                  "service name",
                  "sub service name",
                  "charge",
                  "charge_type",
                  "guaranteed",
                  { key: "reduceChargePercent", label: "Reduced Charge" },
                  {
                    key: "reduceChargeAfter",
                    label: "Reduced Charge applicable after",
                  },
                ]}
                striped
                columnFilter
                // tableFilter
                sorter
                scopedSlots={{
                  "service name": (item) => {
                    return (
                      <ServiceName serviceId={item.service_id}></ServiceName>
                    );
                  },
                  "sub service name": (item) => {
                    return (
                      <SubServiceName
                        serviceId={item.service_id}
                        subServiceId={item.sub_service_id}
                      ></SubServiceName>
                    );
                  },

                  guaranteed: (item) => (
                    <div>
                      <td>
                        <CBadge color={item.guaranteed ? "success" : "danger"}>
                          {item.guaranteed ? "Yes" : "No"}
                        </CBadge>
                      </td>
                      <td>
                        <CSwitch
                          color="primary"
                          checked={item.guaranteed}
                          shape="pill"
                          onChange={(e) => {
                            var list = state.details.services;
                            list = list.map((s) =>
                              s === item
                                ? { ...s, guaranteed: !s.guaranteed }
                                : s
                            );
                            setState({
                              ...state,
                              details: { ...state.details, services: list },
                            });
                          }}
                        />
                      </td>
                    </div>
                  ),
                  charge: (item) => (
                    <td>
                      <CInput
                        value={item.charge}
                        type="number"
                        onChange={(e) => {
                          var list = state.details.services;
                          list = list.map((s) =>
                            s === item
                              ? {
                                  ...s,
                                  charge: parseFloat(e.target.value),
                                }
                              : s
                          );
                          setState({
                            ...state,
                            details: { ...state.details, services: list },
                          });
                        }}
                      />
                    </td>
                  ),
                  reduceChargePercent: (item) => (
                    <td>
                      <CInputGroup>
                        <CInput
                          value={item.reduceChargePercent}
                          type="number"
                          onChange={(e) => {
                            var list = state.details.services;
                            list = list.map((s) =>
                              s === item
                                ? {
                                    ...s,
                                    reduceChargePercent: parseFloat(
                                      e.target.value
                                    ),
                                  }
                                : s
                            );
                            setState({
                              ...state,
                              details: { ...state.details, services: list },
                            });
                          }}
                        />
                        <CInputGroupAppend>
                          <CInputGroupText>
                            {" "}
                            {"% of " + item.charge}
                          </CInputGroupText>
                        </CInputGroupAppend>
                      </CInputGroup>
                    </td>
                  ),
                  reduceChargeAfter: (item) => (
                    <td>
                      <CInputGroup>
                        <CInput
                          value={item.reduceChargeAfter}
                          type="number"
                          onChange={(e) => {
                            var list = state.details.services;
                            list = list.map((s) =>
                              s === item
                                ? {
                                    ...s,
                                    reduceChargeAfter: parseFloat(
                                      e.target.value
                                    ),
                                  }
                                : s
                            );
                            setState({
                              ...state,
                              details: { ...state.details, services: list },
                            });
                          }}
                        />
                        <CInputGroupAppend>
                          <CInputGroupText>
                            {getChargeType(item.charge_type)}
                          </CInputGroupText>
                        </CInputGroupAppend>
                      </CInputGroup>
                    </td>
                  ),
                  charge_type: (item) => (
                    <td>
                      <select
                        className="form-control"
                        value={item.charge_type}
                        onChange={(e) => {
                          var list = state.details.services;
                          list = list.map((s) =>
                            s === item
                              ? { ...s, charge_type: e.target.value }
                              : s
                          );
                          setState({
                            ...state,
                            details: { ...state.details, services: list },
                          });
                        }}
                      >
                        <option value=""></option>

                        <option value="daily">Daily</option>
                        <option value="hourly">Hourly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="estimate">Estimate</option>
                      </select>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={12}>
          <CCard>
            <CCardHeader>Bank Accounts</CCardHeader>

            <CCardBody>
              <CDataTable
                items={state.details ? state.details.bankAccounts : []}
                fields={[
                  "accNo",
                  "accountHolderName",
                  "bankName",
                  "bankBranch",
                  "ifsc",
                ]}
                columnFilter
                // tableFilter
                sorter
                light
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={12}>
          <CCard>
            <CCardHeader>Upload Picture</CCardHeader>

            <CCardBody>
              {image.url ? (
                <CImg
                  src={image.url}
                  height={100}
                  style={{
                    objectFit: "contain",
                  }}
                />
              ) : (
                <h1>No Image</h1>
              )}
              <CInput
                className="filetype"
                type="file"
                style={{
                  marginBlock: 10,
                }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    console.log(typeof e.target.files[0]);
                    setImage({ ...image, object: e.target.files[0] });
                  }
                }}
              />
              {loading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <CButton
                  disabled={typeof image.object !== "object"}
                  color="primary"
                  style={{
                    marginTop: 5,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    addImage();
                  }}
                >
                  Upload New Picture
                </CButton>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ServiceProvider;
