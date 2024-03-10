import { createStore } from "redux";

const initialState = {
  sidebarShow: "responsive",
  loggedIn: false,
  role: "none",
};

const changeState = (state = initialState, payload) => {
  switch (payload.type) {
    case "toggleSidebar":
      return { ...state, sidebarShow: payload.sidebarShow };

    case "set":
      localStorage.setItem("role", payload.role);
      return { ...state, role: payload.role, loggedIn: payload.loggedIn };
    case "logout":
      localStorage.removeItem("role");
      return { ...state, role: null, loggedIn: false };
    default:
      return state;
  }
};

const store = createStore(changeState);
export default store;
