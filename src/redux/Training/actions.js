export const types = {
  SET_RESULTS: "training/SET_RESULTS",
  SET_TRAININGS: "trainings/SET_TRAININGS",
  SET_JOBS: "trainings/SET_JOBS",
  SET_SELECTED_ITEM: "trainings/SET_SELECTED_ITEM",
};

export const setResults = (trainings = [], jobs = []) => {
  return {
    type: types.SET_RESULTS,
    trainings,
    jobs,
  };
};

export const setTrainings = (trainings = []) => {
  return {
    type: types.SET_TRAININGS,
    trainings,
  };
};

export const setJobs = (jobs = []) => {
  return {
    type: types.SET_JOBS,
    jobs,
  };
};

export const setSelectedItem = (selectedItem = null) => {
  return {
    type: types.SET_SELECTED_ITEM,
    selectedItem,
  };
};
