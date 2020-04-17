import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Filter from "./Filter/reducer";

const appState = {
  filters: Filter,
};

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    ...appState,
  });
