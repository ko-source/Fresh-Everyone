import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

// routes config
import routes from "../routes";

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks,
} from "./index";
const TheHeader = () => {
  // const loggedIn = useSelector(state => state.loggedIn)

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const toggleSidebar = () => {
    const doToggle = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "toggleSidebar", sidebarShow: doToggle });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "toggleSidebar", sidebarShow: val });
  };

  return (
    <CHeader
      withSubheader
      style={{
        zIndex: 1030,
      }}
    >
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        {/* <CIcon name="logo" height="48" alt="Logo" /> */}

        <CImg src={"avatars/logo.png"} height={100} alt="company-logo" />
        {/* {!loggedIn ? <CButton color="primary" className="px-4" onClick={handleLoginClick}>Login</CButton> : <></>} */}
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        {/* <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
        </CHeaderNavItem> */}
        {/* <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/users">Users</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/service_providers">
            Service Providers
          </CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/services">Services</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/orders">Orders</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/referralCodes">Referral Codes</CHeaderNavLink>
        </CHeaderNavItem> */}
        {/* <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/telecallers">Telecallers</CHeaderNavLink>
        </CHeaderNavItem> */}
        {/* <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/reviews">Reviews</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/payments">Payments</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/activity">Activity</CHeaderNavLink>
        </CHeaderNavItem> */}
        {/* <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/blogs">Blogs</CHeaderNavLink>
        </CHeaderNavItem> */}
        {/* <CHeaderNavItem className="px-3">
          {!loggedIn ? <CButton color="primary" className="px-4" onClick={handleLoginClick}>Login</CButton> : <></>}
        </CHeaderNavItem> */}
      </CHeaderNav>

      <CHeaderNav className="px-3">
        {/* <TheHeaderDropdownNotif />
        <TheHeaderDropdownTasks />
        <TheHeaderDropdownMssg /> */}
        <TheHeaderDropdown />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
        <div className="d-md-down-none mfe-2 c-subheader-nav">
          {/* <CLink className="c-subheader-nav-link" href="#">
            <CIcon name="cil-speech" alt="Settings" />
          </CLink> */}
          <CLink
            className="c-subheader-nav-link"
            aria-current="page"
            to="/dashboard"
          >
            <CIcon name="cil-graph" alt="Dashboard" />
            &nbsp;Dashboard
          </CLink>
          {/* <CLink className="c-subheader-nav-link" href="#">
            <CIcon name="cil-settings" alt="Settings" />
            &nbsp;Settings
          </CLink> */}
        </div>
      </CSubheader>
    </CHeader>
  );
};

export default TheHeader;
