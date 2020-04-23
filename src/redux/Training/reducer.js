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
    default:
      return state;
  }
};

export default reducer;
