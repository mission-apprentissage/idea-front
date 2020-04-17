export const types = {
  SET_JOB: "filter/SET_JOB",
};

export const setJob = (title = null, ROME = null) => {
  return {
    type: types.SET_JOB,
    job: {
      title,
      ROME,
    },
  };
};
