export const types = {
  SET_RESULTS: "training/SET_RESULTS",
  SET_TRAININGS: "trainings/SET_TRAININGS",
  SET_JOBS: "trainings/SET_JOBS",
  SET_SELECTED_ITEM: "trainings/SET_SELECTED_ITEM",
  SET_ITEM_TO_SCROLL_TO: "trainings/SET_ITEM_TO_SCROLL_TO",
  SET_FORM_VALUES: "trainings/SET_FORM_VALUES",
  SET_EXTENDED_SEARCH: "trainings/SET_EXTENDED_SEARCH",
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

export const setItemToScrollTo = (itemToScrollTo = null) => {
  return {
    type: types.SET_ITEM_TO_SCROLL_TO,
    itemToScrollTo,
  };
};

export const setFormValues = (formValues = null) => {
  return {
    type: types.SET_FORM_VALUES,
    formValues,
  };
};

export const setExtendedSearch = (extendedSearch = false) => {
  return {
    type: types.SET_EXTENDED_SEARCH,
    extendedSearch,
  };
};
