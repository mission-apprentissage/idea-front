import { types as actionsTypes } from "./actions";

const initialState = {
  job: {
    label: "",
    ROME: "",
  },
  hasDiploma: "",
  trainingDuration: "",
  diploma: "",
  location: "",
  starttime: "",
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
      };
    case actionsTypes.SET_TRAINING_DURATION:
      return {
        ...state,
        trainingDuration: action.trainingDuration,
      };
    case actionsTypes.SET_DIPLOMA:
      return {
        ...state,
        diploma: action.diploma,
      };
    // set_start_time
    // set_location
    default:
      return state;
  }
};

export default reducer;
