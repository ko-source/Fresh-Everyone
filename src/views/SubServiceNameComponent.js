import React, { useState, useEffect } from "react";

import firebase from "../config/fbconfig";

const SubServiceName = ({ ...props }) => {
  var [state, setState] = useState({
    name: null,
  });

  useEffect(() => {
    firebase
      .firestore()
      .collection("services")
      .doc(props.serviceId)
      .collection("subservices")
      .doc(props.subServiceId)
      .get()
      .then((value) => {
        setState({
          ...state,
          name: value.data() ? value.data()["name"] : null,
        });
      });
  }, [state, props]);

  return state.name !== null ? <td>{state.name}</td> : <td>Loading...</td>;
};

export default SubServiceName;
