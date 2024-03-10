import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { useDispatch } from "react-redux";

import CIcon from "@coreui/icons-react";
import firebase from "../../../config/fbconfig";
const Login = ({ ...props }) => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    username: "",
    password: "",
    message: "",
    loading: true,
  });

  useEffect(() => {
    const checkLoggedInuser = async () => {
      setState({
        ...state,
        loading: true,
      });
      try {
        const loggedUserInRole = localStorage.getItem("role");
        if (loggedUserInRole) {
          dispatch({ type: "set", role: loggedUserInRole, loggedIn: true });
          props.history.push("/");
          return true;
        }
      } catch (error) {
        console.error(error);
      }
      setState({ ...state, loading: false });
    };
    checkLoggedInuser();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
      message: "",
    }));
  };

  const getUser = () => {
    return firebase.firestore().collection("admins").doc("admin").get();
  };

  const logInUser = (subadmins, username, password) => {
    for (let i of subadmins) {
      if (username === i["username"] && password === i["password"]) {
        const role = i.role || i.accessTo.join("-");
        dispatch({ type: "set", role: role, loggedIn: true });
        props.history.push("/");
        return true;
      }
    }
    return false;
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      if (state.username.length && state.password.length) {
        setState({ ...state, loading: true });

        await firebase
          .auth()
          .signInWithEmailAndPassword("admin@gmail.com", "123456");

        try {
          const response=await firebase.firestore().collection("admins");
            const data=await response.get();
            data.docs.forEach((item,index)=>{
              // console.log(item.data()["subadmins"]);
              if (index == 0) {
                let subadmins = item.data()["subadmins"];
                if (logInUser(subadmins, state.username, state.password)) {
                  return;
                }else{
                  firebase.auth().signOut();
                  setState((prevState) => ({
                    ...prevState,
                    loading: false,
                    message: "User does not exists",
                  }));
                }
              }
              
            })
          // firebase.auth().signOut();
          // setState((prevState) => ({
          //   ...prevState,
          //   loading: false,
          //   message: "User does not exists",
          // }));
        } catch (error) {
          alert(error.message);
          setState((prevState) => ({
            ...prevState,
            loading: false,
            message: "Login failed",
          }));
        }
      } else {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          message: "Both fields are mandatory",
        }));
      }
    } catch (error) {
      alert(error.message);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        message: "Login failed",
      }));
      console.error(error);
    }
    // setState({ ...state, loading: true });
  };
  return (
    <div className="c-app c-default-layout flex-row align-items-center justify-content-center">
      {state.loading ? (
        <span style={{ fontSize: "16px" }}>Please Wait...</span>
      ) : (
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="8">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="text"
                          value={state.username}
                          id="username"
                          onChange={handleChange}
                          placeholder="username"
                          autoComplete="username"
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="password"
                          value={state.password}
                          id="password"
                          onChange={handleChange}
                          placeholder="password"
                          autoComplete="current-password"
                        />
                      </CInputGroup>
                      <p className="text-danger">{state.message}</p>
                      <CRow>
                        <CCol xs="6">
                          <CButton
                            color="primary"
                            className="px-4"
                            onClick={handleLoginClick}
                          >
                            Login
                          </CButton>
                        </CCol>
                        <CCol xs="6" className="text-right">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CCardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua.
                      </p>
                      <Link to="/register">
                        <CButton
                          color="primary"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now!
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      )}
    </div>
  );
};

export default Login;
