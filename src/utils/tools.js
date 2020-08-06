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

export { getValueFromPath, scrollToTop };
