const config = {
  local: {
    urls: [/^"localhost"$/g],
    baseUrl: "http://localhost:3000",
  },
  dev: {
    urls: [/^develop--idea-mna.netlify.app$/g /*, /^deploy-preview-[0-9]+--idea-front-dev.netlify.com$/g*/],
    baseUrl: "https://idea-mna-api-dev.herokuapp.com",
  },
  prod: {
    urls: [/^idea-mna.netlify.app$/g],
    baseUrl: "https://idea-mna-api.herokuapp.com",
  },
};

export const getEnvName = () => {
  let hostname = window.location.hostname;

  if (config.dev.urls.some((regexp) => regexp.test(hostname))) {
    return "dev";
  } else if (config.prod.urls.some((regexp) => regexp.test(hostname))) {
    return "prod";
  }

  return "local";
};

export const getConfig = (envName) => {
  switch (envName) {
    case "prod":
      return config.prod.baseUrl;
    case "dev":
      return config.dev.baseUrl;
    default:
      return config.local.baseUrl;
  }
};

export default getConfig(getEnvName());
