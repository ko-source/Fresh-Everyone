import React from "react";
import { useDispatch } from "react-redux";
import { TheContent, TheSidebar, TheFooter, TheHeader } from "./index";

import firebase from "../config/fbconfig";
const TheLayout = () => {
  const dispatch = useDispatch();
  // const role = useSelector(state => state.role)

  firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
      // alert(user.email)
      // if(role==="none"){
      //   firebase.auth().signOut();
      //   return;
      // }
      const role = localStorage.getItem("role");
      dispatch({ type: "set", loggedIn: true, role });
    } else {
      dispatch({ type: "logout" });
    }
  });

  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader />
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  );
};

export default TheLayout;
