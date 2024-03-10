import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormGroup,
  CButton,
  CDataTable,
  CSpinner,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { useFormik } from "formik";
import { firestore } from "firebase";
import SearchableSelect from "./searchableSelect";

export const ProviderSupervisor = ({ match }) => {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [addingSupervisor, setAddingSupervisor] = useState(false);
  const [providersList, setProvidersList] = useState([]);
  const [superisorList, setSuperisorList] = useState([]);
  const [supervisorServices, setSupervisorServices] = useState([]);
  const [parentTicketId, setParentTicketId] = useState();
  const [addedSupervisor, setAddedSupervisor] = useState();
  const [showAddSupervisorForm, setShowAddSupervisorForm] = useState(false);

  const formik = useFormik({ initialValues: { service: "", provider: "" } });

  useEffect(() => {
    setLoading(false);

    getProvidersForJob().then((parentTicketId) => {
      return checkSupervisorAdded(parentTicketId);

    });
    getSupervisor().then(() => {

    });

  }, []);

  async function getProvidersForJob() {
    const curretnOrder = await firestore()
      .collection("orders")
      .doc(match.params.id)
      .get()
      .then((result) => ({ ...result.data(), id: result.id }));

    let orders;
    let parentTicketId;
    if (curretnOrder.parent_ticketId) {
      orders = await firestore()
        .collection("orders")
        .where("parent_ticketId", "==", curretnOrder.parent_ticketId)
        .get()
        .then((result) =>
          result.docs.map((order) => ({
            ...order.data(),
            id: order.id,
          }))
        );
      parentTicketId = curretnOrder.parent_ticketId;
    } else {
      orders = await firestore()
        .collection("orders")
        .where("ticketId", "==", curretnOrder.ticketId)
        .get()
        .then((result) =>
          result.docs.map((order) => ({
            ...order.data(),
            id: order.id,
          }))
        );
      parentTicketId = curretnOrder.ticketId;
    }

    const providers = [];
    for (const order of orders) {
      providers.push(
        await firestore()
          .collection("providers")
          .doc(order.provider_id)
          .get()
          .then((provider) => ({
            name: provider.data().name,
            phone: provider.data().phone,
            order_ticketId: order.ticketId,
            order_id: order.id,
            id: provider.id,
          }))
      );
    }

    setParentTicketId(parentTicketId);
    setProvidersList(providers);
    return parentTicketId;
  }

  const getSupervisor = async () => {
    const resolvedProvider = await firebase
      .firestore()
      .collection("/services/tssSVIVmt35yrydUZxW8/subservices")
      .get()
      .then(async (subServices) => {
        const resolvedServices = [];
        for (const subService of subServices.docs) {
          if (subService.data().providers != null) {
            const subServiceData = subService.data();
            // const resolvedProvider = [];

            // for (const providerId of subServiceData.providers) {
            //   let provider;

            //   if (providerId instanceof String) {
            //     provider = await firebase
            //       .firestore()
            //       .collection("providers")
            //       .doc(providerId)
            //       .get();
            //   } else {
            //     provider = (
            //       await firebase
            //         .firestore()
            //         .collection("providers")
            //         .where(firestore.FieldPath.documentId(), "==", providerId)
            //         .get()
            //     ).docs[0];
            //   }

            //   if (!!provider?.data() && provider?.data().verified === true) {
            //     resolvedProvider.push({
            //       ...provider.data(),
            //       id: provider.id,
            //     });
            //   }
            // }

            resolvedServices.push({
              ...subServiceData,
              id: subService.id,
              // providers: resolvedProvider,
            });
          }
        }

        return resolvedServices;
      });

    setSupervisorServices(resolvedProvider);
  }

  async function getSupervisorList(serviceIndex) {
    let selectedServiceProviders = [...supervisorServices[serviceIndex].providers];
    var resolvedProvider = [];
    if (selectedServiceProviders != null) {
      let batches = [];
      while (selectedServiceProviders.length) {
        // firestore limits batches to 10
        const batch = selectedServiceProviders.splice(0, 10);

        // add the batch request to to a queue
        batches.push(
          new Promise(response => {
            firebase
              .firestore()
              .collection("providers")
              .where(firestore.FieldPath.documentId(), "in", batch)
              .get()
              .then(results => response(results.docs.map(result => ({ ...result.data(), id: result.id })).filter(item => item.verified)))
          })
        )
      }
      let content = await Promise.all(batches);
      resolvedProvider = content.flat();
    }
    setSuperisorList(resolvedProvider);
  }

  async function checkSupervisorAdded(parent_ticketId) {
    const supervisor = (
      await firebase
        .firestore()
        .collection("supervisorJobs")
        .where("parent_TicketId", "==", parent_ticketId)
        .get()
    ).docs[0];

    if (supervisor) {
      const provider = await firestore()
        .collection("providers")
        .doc(supervisor.data().provider)
        .get();
      setAddedSupervisor({
        id: supervisor.id,
        ...supervisor.data(),
        provider: provider.data(),
      });
      setShowAddSupervisorForm(false);
    }
  }

  async function onAddSupervisor(e) {
    e.preventDefault();

    console.log(formik.values);
    console.log(supervisorServices);
    setAddingSupervisor(true);
    if (addedSupervisor) {
      const supervisorJobData = {
        provider:
          supervisorServices[formik.values.service].providers[
          formik.values.provider
          ],
        last_updated: new Date(),
      };

      await firebase
        .firestore()
        .collection("supervisorJobs")
        .doc(addedSupervisor.id)
        .update(supervisorJobData);
      await checkSupervisorAdded(addedSupervisor.parent_TicketId);
    } else {
      const supervisorJobData = {
        service: supervisorServices[formik.values.service].id,
        provider:
          supervisorServices[formik.values.service].providers[
          formik.values.provider
          ],
        parent_TicketId: parentTicketId,
        status: "new",
        timestamp: new Date(),
        last_updated: new Date(),
      };

      await firebase
        .firestore()
        .collection("supervisorJobs")
        .doc()
        .set(supervisorJobData);
      await checkSupervisorAdded(supervisorJobData.parent_TicketId);
    }

    alert("supervisor Added");
    setAddingSupervisor(false);
  }

  return (
    <CCard>
      <CCardHeader>
        <h2>Providers Assigned</h2>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <CSpinner size="small" color="info" />
        ) : (
          <>
            {addedSupervisor && !showAddSupervisorForm ? (
              <CCard>
                <CCardHeader>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>Supervising By</strong>
                    <CButton
                      color="warning"
                      type="button"
                      onClick={() => {
                        setShowAddSupervisorForm(true);
                      }}
                    >
                      Change
                    </CButton>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <div className="table-responsive">
                    <table className="table" style={{ marginBottom: 0 }}>
                      <tbody>
                        <tr>
                          <th>Name</th>
                          <td>
                            {addedSupervisor.provider.name ||
                              addedSupervisor.provider.phone}
                          </td>
                        </tr>
                        <tr>
                          <th>Phone</th>
                          <td>{addedSupervisor.provider.phone}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CCardBody>
              </CCard>
            ) : (
              supervisorServices.length !== 0 ?
                <CForm onSubmit={onAddSupervisor}>
                  <CFormGroup>
                    <select
                      required
                      name="service"
                      id="service"
                      className="form-control"
                      value={formik.values.service}
                      onChange={(e) => {
                        formik.handleChange(e);

                        getSupervisorList(e.target.value);
                      }}
                    >
                      <option value="-1">Select Service</option>
                      {supervisorServices.map((s, index) => {
                        return (
                          <option key={s.id} value={index}>
                            {s.name}
                          </option>
                        );
                      })}
                    </select>
                  </CFormGroup>
                  <CFormGroup>
                    <CFormGroup>
                      <SearchableSelect
                        placeholder="Select Provider"
                        value={formik.values.provider}
                        onChange={(value) => {
                          let v = supervisorServices[formik.values.service].providers.indexOf(superisorList[value].id)

                          console.log(v)
                          formik.setFieldValue("provider", v);
                        }}
                        list={superisorList.map((provider, i) => {
                          return {
                            name: `${provider.name} | ${provider.phone} | ${provider.location}`,
                            value: i,
                          }


                        })}
                      />
                    </CFormGroup>
                  </CFormGroup>
                  {addingSupervisor ? (
                    <CSpinner size="small" color="info" />
                  ) : (
                    <CButton type="submit" color="success" disabled={loading}>
                      Add Supervisor
                    </CButton>
                  )}
                </CForm> : <CSpinner size="small" color="info" />
            )}
            <div style={{ padding: "10px 0", marginTop: "10px" }}>
              <strong>Providers</strong>
            </div>
            <CDataTable
              loading={loading}
              items={providersList}
              fields={[
                { key: "phone", _classes: "font-weight-bold" },
                "name",
                "order_ticketId",
              ]}
              hover
              striped
              columnFilter
              sorter
              clickableRows
              scopedSlots={{
                order_ticketId: (item, index) => {
                  return (
                    <td className="py-2">
                      <CButton
                        type="button"
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          history.push(`/orders/${item.order_id}`);
                        }}
                      >
                        {item.order_ticketId}
                      </CButton>
                    </td>
                  );
                },
              }}
              onRowClick={(item) =>
                history.push(`/service_providers/${item.id}`)
              }
            />
          </>
        )}
      </CCardBody>
    </CCard>
  );
};
