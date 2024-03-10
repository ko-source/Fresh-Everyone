import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CInput,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import SearchableSelect from "../orders/searchableSelect";
import { useHistory } from "react-router";

const initialState = {
  id: "",
  keyword: "",
};

const GenerateEmployeesLink = () => {
  const db = firebase.firestore();

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [provider, setProvider] = useState(initialState);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    getServiceProviders();
  }, [submitLoading]);

  const getServiceProviders = () => {
    setLoading(true);
    db.collection("links")
      .get()
      .then(async (value) => {
        const data = await Promise.all(
          value.docs.map(async (val) => {
            return { ...val.data() };
          })
        );
        setLinks(data);
      });
    db.collection("providers")
      .get()
      .then(async (value) => {
        const data = await Promise.all(
          value.docs.map(async (val) => {
            let service_name = "Not Defined";
            if (val.data()?.services?.length > 0) {
              service_name = await (
                await firebase
                  .firestore()
                  .collection("services")
                  .doc(val.data().services[0]?.service_id)
                  .get()
              ).data()?.name;
            }
            return {
              id: val.id,
              ...val.data(),
              service_name,
            };
          })
        );
        setProviders(data);
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    if (provider.keyword == "") {
      alert("Keyword is mandatory!");
      setSubmitLoading(false);
      return;
    }
    const domain = "https://www.servicexpertz.com/";
    const generatedLlink = `${domain}${provider.keyword.toLowerCase()}`;

    const existedLinkEmployee = links.find(
      (link) => link.employeeId === provider.id
    );
    const existedLink = links.find((link) => link.link === generatedLlink);
    if (existedLinkEmployee !== undefined) {
      setSubmitLoading(false);
      alert("Employee already has a link!");
    } else if (existedLink !== undefined) {
      setSubmitLoading(false);
      alert("Link already exist!");
    } else {
      db.collection("links").add({
        employeeId: provider.id,
        link: generatedLlink,
        keyword: provider.keyword,
        orders: [],
      });
      setSubmitLoading(false);
      alert("Link generated!");
      setProvider({
        id: "",
        keyword: "",
      });
      history.push("/links");
    }
  };

  return (
    <CCard>
      <CCardHeader>Generate Employees Link</CCardHeader>
      <CCardBody>
        {!loading ? (
          <>
            <div
              style={{
                marginBottom: 10,
              }}
            >
              <CLabel>Employees</CLabel>
              <SearchableSelect
                placeholder="Select Employee"
                value={providers}
                onChange={(value) => {
                  setProvider({ ...provider, id: providers[value].id });
                }}
                list={providers.map((provider, i) => ({
                  name: `${provider.name} - ${provider.service_name}`,
                  value: i,
                }))}
              />
            </div>
            {provider.id && (
              <CForm onSubmit={handleSubmit}>
                <CFormGroup>
                  <CLabel>Keyword</CLabel>
                  <CInput
                    type="text"
                    placeholder="Enter keyword"
                    onChange={(e) =>
                      setProvider({ ...provider, keyword: e.target.value })
                    }
                  />
                </CFormGroup>
                <CFormGroup>
                  {submitLoading ? (
                    <CSpinner size="small" color="info" />
                  ) : (
                    <CButton
                      type="submit"
                      color="success"
                      disabled={submitLoading}
                    >
                      Generate Link
                    </CButton>
                  )}
                </CFormGroup>
              </CForm>
            )}
          </>
        ) : (
          <CSpinner size="small" color="info" />
        )}
      </CCardBody>
    </CCard>
  );
};

export default GenerateEmployeesLink;
