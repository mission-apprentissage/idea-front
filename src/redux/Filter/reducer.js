import { types as actionsTypes } from "./actions";

const initialState = {
  job: {
    title: null,
    ROME: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsTypes.SET_JOB:
      return {
        ...state,
        job: action.job,
      };
    default:
      return state;
  }
};

export default reducer;
