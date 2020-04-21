export const types = {
  SET_JOB: "filter/SET_JOB",
  SET_HAS_DIPLOMA: "filter/SET_HAS_DIPLOMA",
};

export const setJob = (label = "", ROME = "") => {
  return {
    type: types.SET_JOB,
    job: {
      label,
      ROME,
    },
  };
};

export const setHasDiploma = (hasDiploma = "") => {
  return {
    type: types.SET_HAS_DIPLOMA,
    hasDiploma,
  };
};
