import { types as actionsTypes } from "./actions";

const initialState = {
  trainings: [],
  jobs: [],
  itemToScrollTo: null,
  selectedItem: null,
  formValues: null,
  extendedSearch: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsTypes.SET_RESULTS:
      return {
        trainings: action.trainings,
        jobs: action.jobs,
      };
    case actionsTypes.SET_TRAININGS:
      return {
        ...state,
        trainings: action.trainings,
      };
    case actionsTypes.SET_JOBS:
      return {
        ...state,
        jobs: action.jobs,
      };
    case actionsTypes.SET_SELECTED_ITEM:
      return {
        ...state,
        selectedItem: action.selectedItem,
      };
    case actionsTypes.SET_ITEM_TO_SCROLL_TO:
      return {
        ...state,
        itemToScrollTo: action.itemToScrollTo,
      };
    case actionsTypes.SET_FORM_VALUES:
      return {
        ...state,
        formValues: action.formValues,
      };
    case actionsTypes.SET_EXTENDED_SEARCH:
      return {
        ...state,
        extendedSearch: action.extendedSearch,
      };
    default:
      return state;
  }
};

export default reducer;
