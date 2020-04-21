export const types = {
  SET_JOB: "filter/SET_JOB",
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
