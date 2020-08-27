const getValueFromPath = (key) => {
  const url = new URL(window.location);
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

  if (item.type === "lbb" || item.type === "lba") id = `${item.item.type}${item.item.siret}`;
  else if (item.type === "training") id = `id${item.item.id}`;
  else if (item.type === "peJob") id = `id${item.item.id}`;

  let res = document.getElementById(id);

  return res;
};

export { getValueFromPath, scrollToTop, scrollToElementInContainer, getItemElement };
