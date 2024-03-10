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
  CHeader,
  CTextarea,
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const template = {
  title: "",
  body: "",
};

const initialState = {
  title: "",
  bestData: ["", "", ""],
  howItWorks: [template, template, template],
  faq: [template, template, template],
  about: template,
  whyBook: [template, template, template, template],
  whyBookTitle: "",
  subServices: [template, template, template, template, template, template],
  metaData: {
    title: "",
    keywords: "",
    description: "",
    url: "",
  },
};

const EditService = ({ match }) => {
  const serviceId = match.params.sid;
  const db = firebase.firestore();

  const [loading, setLoading] = useState(false);
  const [submitLoading, setsubmitLoading] = useState(false);
  const [service, setService] = useState(initialState);

  useEffect(() => {
    getService();
    // getServices();
  }, []);

  const getService = async () => {
    setLoading(true);
    const serviceData = await db.collection("services").doc(serviceId).get();

    setService({
      ...service,
      ...serviceData.data(),
      id: serviceData.id,
    });
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsubmitLoading(true);

    console.log(service);

    const checkIfEmpty = (field) => {
      const tempArray = [];
      for (let i = 0; i < field.length; ++i) {
        if (field[i].title.trim() === "" || field[i].body.trim() === "")
          continue;
        else tempArray.push(field[i]);
      }

      if (tempArray.length) return tempArray;
      else return false;
    };

    const updateObject = {};
    let temp = checkIfEmpty(service.howItWorks);

    if (temp) updateObject.howItWorks = temp;

    temp = checkIfEmpty(service.faq);
    if (temp) updateObject.faq = temp;

    temp = checkIfEmpty(service.whyBook);
    if (temp) updateObject.whyBook = temp;

    temp = checkIfEmpty(service.subServices);
    if (temp) updateObject.subServices = temp;

    if (service.title.trim() !== "") updateObject.title = service.title;

    if (service.about.title.trim() !== "" && service.about.body.trim() !== "")
      updateObject.about = service.about;

    temp = service.bestData.filter((i) => i);
    if (temp.length) updateObject.bestData = temp;

    if (service.whyBookTitle) updateObject.whyBookTitle = service.whyBookTitle;

    // add meta data to updateObject
    let tempMetaData = service.metaData;
    let newMetaData = {};
    for (const [key, value] of Object.entries(tempMetaData)) {
      if (value.trim() !== "") newMetaData[key] = value;
    }
    updateObject.metaData = newMetaData;

    console.log(updateObject);

    try {
      await db
        .collection("services")
        .doc(serviceId)
        .update({
          ...updateObject,
        });
      alert("Data Added");
    } catch (e) {
      alert("Something went wrong!!");
    }

    setsubmitLoading(false);
  };

  return (
    <CCard>
      <CCardHeader>Edit Service {`${service?.name || ""}`}</CCardHeader>
      <CCardBody>
        {!loading ? (
          <>
            <CForm onSubmit={handleSubmit}>
              <CFormGroup>
                <CHeader>Title</CHeader>
                <CInput
                  type="text"
                  placeholder="Title"
                  value={service.title}
                  onChange={(e) =>
                    setService({
                      ...service,
                      title: e.target.value,
                    })
                  }
                />
              </CFormGroup>
              <CFormGroup>
                <CHeader>Best</CHeader>
                {service.bestData.map((data, index) => (
                  <CFormGroup>
                    <CInput
                      type="text"
                      placeholder="Best"
                      value={service.bestData[index]}
                      name="bestData"
                      onChange={(e) => {
                        const temp = service.bestData.map((d, i) =>
                          i === index ? e.target.value : d
                        );
                        setService({
                          ...service,
                          bestData: temp,
                        });
                      }}
                    />
                  </CFormGroup>
                ))}
              </CFormGroup>
              {/* <CFormGroup>
              <CHeader>Best</CHeader>
              {Object.keys(service.bestData).map((data, index) => (
                <CFormGroup>
                  <CInput
                    type="text"
                    placeholder="Best"
                    value={service.bestData[index]}
                    name={"bestData"}
                    onChange={(e) => {
                      setService({
                        ...service,
                        bestData: {
                          ...service.bestData,
                          [index]: e.target.value,
                        },
                      });
                    }}
                  />
                </CFormGroup>
              ))}
                  </CFormGroup>*/}
              <CFormGroup>
                <CHeader>How It Works</CHeader>
                {service.howItWorks.map((data, index) => (
                  <CFormGroup>
                    <CFormGroup>
                      <CLabel>Title</CLabel>
                      <CInput
                        type="text"
                        placeholder="Title"
                        name={"howItWorks"}
                        value={service.howItWorks[index].title}
                        onChange={(e) => {
                          const temp = service.howItWorks.map((d, i) =>
                            i === index ? { ...d, title: e.target.value } : d
                          );
                          setService({
                            ...service,
                            howItWorks: temp,
                          });
                        }}
                      />
                    </CFormGroup>
                    <CLabel>Body</CLabel>
                    <CInput
                      type="text"
                      placeholder="body"
                      name={"howItWorks"}
                      value={service.howItWorks[index].body}
                      onChange={(e) => {
                        const temp = service.howItWorks.map((d, i) =>
                          i === index ? { ...d, body: e.target.value } : d
                        );
                        setService({
                          ...service,
                          howItWorks: temp,
                        });
                      }}
                    />
                  </CFormGroup>
                ))}
              </CFormGroup>
              <CFormGroup>
                <CHeader>FAQ</CHeader>
                {service.faq.map((data, index) => (
                  <CFormGroup>
                    <CFormGroup>
                      <CLabel>Title</CLabel>
                      <CInput
                        type="text"
                        placeholder="Title"
                        name={"faq"}
                        value={service.faq[index].title}
                        onChange={(e) => {
                          const temp = service.faq.map((d, i) =>
                            i === index ? { ...d, title: e.target.value } : d
                          );
                          setService({
                            ...service,
                            faq: temp,
                          });
                        }}
                      />
                    </CFormGroup>
                    <CLabel>Body</CLabel>
                    <CInput
                      type="text"
                      placeholder="body"
                      name={"faq"}
                      value={service.faq[index].body}
                      onChange={(e) => {
                        const temp = service.faq.map((d, i) =>
                          i === index ? { ...d, body: e.target.value } : d
                        );
                        setService({
                          ...service,
                          faq: temp,
                        });
                      }}
                    />
                  </CFormGroup>
                ))}
              </CFormGroup>
              <CFormGroup>
                <CHeader>About</CHeader>
                <CFormGroup>
                  <CLabel>Title</CLabel>
                  <CInput
                    type="text"
                    placeholder="Title"
                    value={service.about.title}
                    onChange={(e) => {
                      setService({
                        ...service,
                        about: {
                          ...service.about,
                          title: e.target.value,
                        },
                      });
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CTextarea
                    value={service.about.body}
                    onChange={(e) => {
                      setService({
                        ...service,
                        about: {
                          ...service.about,
                          body: e.target.value,
                        },
                      });
                    }}
                    name="about"
                    aria-multiline
                    multiple
                  />
                </CFormGroup>
              </CFormGroup>
              <CFormGroup>
                <CHeader>Why Choose Servicexpertz</CHeader>
                <CFormGroup>
                  <CLabel>Why Choose Title</CLabel>
                  <CInput
                    type="text"
                    placeholder="Why Choose Title"
                    value={service.whyBookTitle}
                    onChange={(e) =>
                      setService({
                        ...service,
                        whyBookTitle: e.target.value,
                      })
                    }
                  />
                </CFormGroup>
                {service.whyBook.map((data, index) => (
                  <CFormGroup>
                    <CFormGroup>
                      <CLabel>Title</CLabel>

                      <CInput
                        type="text"
                        placeholder="Title"
                        name={"whyBook"}
                        value={service.whyBook[index].title}
                        onChange={(e) => {
                          const temp = service.whyBook.map((d, i) =>
                            i === index ? { ...d, title: e.target.value } : d
                          );
                          setService({
                            ...service,
                            whyBook: temp,
                          });
                        }}
                      />
                    </CFormGroup>
                    <CLabel>Body</CLabel>
                    <CInput
                      type="text"
                      placeholder="body"
                      name={"whyBook"}
                      value={service.whyBook[index].body}
                      onChange={(e) => {
                        const temp = service.whyBook.map((d, i) =>
                          i === index ? { ...d, body: e.target.value } : d
                        );
                        setService({
                          ...service,
                          whyBook: temp,
                        });
                      }}
                    />
                  </CFormGroup>
                ))}
              </CFormGroup>
              <CFormGroup>
                <CHeader>Sub Services</CHeader>
                {service.subServices.map((data, index) => (
                  <CFormGroup>
                    <CFormGroup>
                      <CLabel>Title</CLabel>
                      <CInput
                        type="text"
                        placeholder="Title"
                        name={"subServices"}
                        value={service.subServices[index].title}
                        onChange={(e) => {
                          const temp = service.subServices.map((d, i) =>
                            i === index ? { ...d, title: e.target.value } : d
                          );
                          setService({
                            ...service,
                            subServices: temp,
                          });
                        }}
                      />
                    </CFormGroup>
                    <CLabel>Body</CLabel>
                    <CInput
                      type="text"
                      placeholder="body"
                      name={"subServices"}
                      value={service.subServices[index].body}
                      onChange={(e) => {
                        const temp = service.subServices.map((d, i) =>
                          i === index ? { ...d, body: e.target.value } : d
                        );
                        setService({
                          ...service,
                          subServices: temp,
                        });
                      }}
                    />
                  </CFormGroup>
                ))}
              </CFormGroup>

              {/* meta data */}
              <CFormGroup>
                <CHeader>Meta Data</CHeader>
                <CFormGroup>
                  <CLabel>Meta Title</CLabel>
                  <CInput
                    type="text"
                    placeholder="meta title"
                    value={service.metaData.title}
                    name="metaTitle"
                    onChange={(e) => {
                      setService({
                        ...service,
                        metaData: {
                          ...service.metaData,
                          title: e.target.value,
                        },
                      });
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Meta Keywords</CLabel>
                  <CInput
                    type="text"
                    placeholder="meta keywords"
                    value={service.metaData.keywords}
                    name="metaKeywords"
                    onChange={(e) => {
                      setService({
                        ...service,
                        metaData: {
                          ...service.metaData,
                          keywords: e.target.value,
                        },
                      });
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Meta Description</CLabel>
                  <CInput
                    type="text"
                    placeholder="meta description"
                    value={service.metaData.description}
                    name="metaDescription"
                    onChange={(e) => {
                      setService({
                        ...service,
                        metaData: {
                          ...service.metaData,
                          description: e.target.value,
                        },
                      });
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel>Page URL</CLabel>
                  <CInput
                    type="text"
                    placeholder="url after servicexpertz.com/..."
                    value={service.metaData.url}
                    name="url"
                    onChange={(e) => {
                      setService({
                        ...service,
                        metaData: {
                          ...service.metaData,
                          url: e.target.value,
                        },
                      });
                    }}
                  />
                </CFormGroup>
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
                    Edit Service
                  </CButton>
                )}
              </CFormGroup>
            </CForm>
          </>
        ) : (
          <CSpinner size="small" color="info" />
        )}
      </CCardBody>
    </CCard>
  );
};

export default EditService;
