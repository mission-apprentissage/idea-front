import { types as actionsTypes } from "./actions";

const initialState = {
  trainings: [],
  jobs: [],
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

    default:
      return state;
  }
};

export default reducer;
