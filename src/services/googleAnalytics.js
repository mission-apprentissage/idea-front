export const gtag = (category, action, label, params) => {
  try {
    let p = params || {};

    if (category) p.event_category = category;

    if (label) p.event_label = label;

    if (window.gtag) {
      console.log("gtag : ", category, action, p);
      window.gtag("event", action, p);
    }
  } catch (err) {
    console.log("Error logging to google analytics : ", err);
  }
};
