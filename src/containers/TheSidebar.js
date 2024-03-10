import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg,
} from "@coreui/react";

// sidebar nav config
import navigation from "./_nav";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);

  const role = localStorage
    .getItem("role")
    ?.split("-")
    .map((r) => r.toLowerCase());
  const [navContent, setNavContent] = useState([]);

  useEffect(() => {
    if (role && role[0]?.toLowerCase() !== "admin") {
      const navs = role.map((r) => {
        let n = null;
        navigation.forEach((nav) => {
          // console.log(nav.name.toLowerCase());
          if (r === nav.name.toLowerCase()) {
            // console.log(r);
            n = nav;
          }
        });
        return n;
      });
      setNavContent(navs);
    } else {
      setNavContent(navigation);
    }
    // console.log(role);

    // console.log(navs);
    // console.log([navigation.find((nav) => nav.name.toLowerCase() in role)]);
    return () => {};
  }, []);

  return (
    <CSidebar
      show={show}
      onShowChange={(val) =>
        dispatch({ type: "toggleSidebar", sidebarShow: val })
      }
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <CImg
          src={"avatars/logo.png"}
          className="c-sidebar-brand-full"
          height={100}
          alt="company-logo"
        />
        <CImg
          className="c-sidebar-brand-minimized"
          src={"avatars/logo.png"}
          height={35}
          alt="company-logo"
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={navContent}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
