export const gtag = (category, action, label) => {
  let params = {};

  if (category) params.event_category = category;

  if (label) params.event_label = label;

  if (window.gtag) {
    console.log("gtag : ", category, action, label);
    window.gtag("event", action, params);
  } else console.log("gtag pas là ", category, action, label);
};
