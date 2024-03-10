import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";
import { useSelector } from "react-redux";
// routes config
import routes from "../routes";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheContent = () => {
  const loggedIn = useSelector((state) => state.loggedIn);

  // splitting the string from '-' to make it and array
  // Turning all elements to lowecase
  // if there are two words and combining them with '_' to match the url path
  const role = localStorage
    .getItem("role")
    ?.split("-")
    .map((r) => r.toLowerCase().split(" ").join("_"));
  const checkIfThere = (path) => {
    for (const idx in role) {
      if (path.includes(role[idx])) return true;
    }
    return false;
  };

  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              if (
                loggedIn &&
                (checkIfThere(route.path) ||
                  route.path === "/dashboard" ||
                  role[0] === "admin")
              ) {
                return (
                  route.component && (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={(props) => (
                        <CFade>
                          <route.component {...props} />
                        </CFade>
                      )}
                    />
                  )
                );
              }
              return "";
            })}
            {loggedIn ? (
              <Redirect from="/" to="/dashboard" />
            ) : (
              <Redirect from="/" to="/login" />
            )}
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default React.memo(TheContent);
