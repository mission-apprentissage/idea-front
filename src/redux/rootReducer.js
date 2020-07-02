import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Filter from "./Filter/reducer";
import Training from "./Training/reducer";

const appState = {
  filters: Filter,
  trainings: Training,
};

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    ...appState,
  });
