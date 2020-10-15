import * as Sentry from "@sentry/react";

const getValueFromPath = (key) => {
  const url = new URL(window.location);

  // WARNING: URLSearchParams not supported by IE
  const searchParams = new URLSearchParams(url.search);

  let res = searchParams.get(key);

  return res;
};

const scrollToTop = (elementId) => {
  document.getElementById(elementId).scrollTo({
    top: 0,
    left: 0,
  });
};

const scrollToElementInContainer = (containerId, el, yOffsett, behavior) => {
  document.getElementById(containerId).scrollTo({
    top: el.offsetTop - yOffsett,
    left: 0,
    behavior,
  });
};

const getItemElement = (item) => {
  let id = "";

  if (item.type === "training") id = `id${item.item.trainings ? item.item.trainings[0].id : item.item.id}`;
  else {
    let realItem = item.item.jobs ? item.item.jobs[0] : item.item;

    if (realItem.type === "peJob") id = `id${realItem.id}`;
    else id = `${realItem.type}${realItem.siret}`;
  }

  let res = document.getElementById(id);

  return res;
};

const logError = (title, error) => {
  let err = error instanceof Error ? error : new Error(error);
  err.name = title;
  Sentry.captureException(err);
};

export { getValueFromPath, scrollToTop, scrollToElementInContainer, getItemElement, logError };
