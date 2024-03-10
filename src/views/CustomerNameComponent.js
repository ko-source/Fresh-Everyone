import React, { useState, useEffect } from "react";

import firebase from "../config/fbconfig";

const CustomerName = ({ ...props }) => {
  var [state, setState] = useState({
    name: null,
  });

  useEffect(() => {
    if (props.id == null) {
      setState({
        ...state,
        name: "Does not exists",
      });
      return;
    }
    firebase
      .firestore()
      .collection("users")
      .doc(props.id)
      .get()
      .then((value) => {
        setState({
          ...state,
          name: value.data() ? value.data()["phone"] : props.id,
        });
      });
  }, [props, state]);

  return state.name !== null ? <p>{state.name}</p> : <p>Loading...</p>;
};

export default CustomerName;
