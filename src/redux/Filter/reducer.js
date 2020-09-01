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
  radius: "",
  startTime: "",
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
    case actionsTypes.SET_TRAINING_START_TIME:
      return {
        ...state,
        startTime: action.startTime,
      };
    case actionsTypes.SET_TRAINING_LOCATION:
      return {
        ...state,
        location: action.location,
        radius: action.radius,
      };
    default:
      return state;
  }
};

export default reducer;
