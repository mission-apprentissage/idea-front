export const logEvent = (type, parameters) => {
  window.amplitude.logEvent(type, parameters);
};
