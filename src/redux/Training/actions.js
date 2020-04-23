export const types = {
  SET_RESULTS: "training/SET_RESULTS",
};

export const setResults = (trainings = [], jobs = []) => {
  return {
    type: types.SET_RESULTS,
    trainings,
    jobs,
  };
};
