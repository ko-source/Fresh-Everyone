import React, { useState, useEffect } from "react";

import firebase from "../config/fbconfig";

const ServiceName = ({ ...props }) => {
  var [state, setState] = useState({
    name: null,
  });

  useEffect(() => {
    firebase
      .firestore()
      .collection("services")
      .doc(props.serviceId)
      .get()
      .then((value) => {
        setState({
          ...state,
          name: value.data() ? value.data()["name"] : null,
        });
      });
  }, [props, state]);

  return state.name !== null ? <td>{state.name}</td> : <td>Loading...</td>;
};

export default ServiceName;
