const getValueFromPath = (key) => {
  const url = new URL(window.location);
  const searchParams = new URLSearchParams(url.search);

  let res = searchParams.get(key);

  return res;
};

export { getValueFromPath };
