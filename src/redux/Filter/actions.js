export const types = {
  SET_JOB: "filter/SET_JOB",
  SET_HAS_DIPLOMA: "filter/SET_HAS_DIPLOMA",
  SET_DIPLOMA: "filter/SET_DIPLOMA",
  SET_TRAINING_DURATION: "filter/SET_TRAINING_DURATION",
  SET_TRAINING_LOCATION: "filter/SET_TRAINING_LOCATION",
  SET_TRAINING_START_TIME: "filter/SET_TRAINING_START_TIME",
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

export const setTrainingDuration = (trainingDuration = "") => {
  return {
    type: types.SET_TRAINING_DURATION,
    trainingDuration,
  };
};

export const setDiploma = (diploma = "") => {
  return {
    type: types.SET_DIPLOMA,
    diploma,
  };
};
export const setTrainingLocation = (location = "") => {
  return {
    type: types.SET_TRAINING_LOCATION,
    location,
  };
};

export const setTrainingStartTime = (startTime = "") => {
  return {
    type: types.SET_TRAINING_START_TIME,
    startTime,
  };
};
