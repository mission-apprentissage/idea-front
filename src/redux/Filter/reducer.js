import { types as actionsTypes } from "./actions";

const initialState = {
  job: {
    label: "",
    ROME: "",
  },
  hasDiploma: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsTypes.SET_JOB:
      return {
        ...state,
        job: action.job,
      };
    case actionsTypes.SET_HAS_DIPLOMA:
      return {
        ...state,
        hasDiploma: action.hasDiploma,
      }
    default:
      return state;
  }
};

export default reducer;
