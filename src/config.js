const config = {
  local: {
    urls: [/^"localhost"$/g],
    baseUrl: "http://localhost:3000",
    aws: {
      apiGateway: {
        name: "api",
        region: "local",
        endpoint: "http://localhost:3001/local",
      },
    },
  },
  dev: {
    urls: [/^develop--idea-mna.netlify.app$/g /*, /^deploy-preview-[0-9]+--idea-front-dev.netlify.com$/g*/],
    baseUrl: "https://idea-mna-api-dev.herokuapp.com",
    aws: {
      apiGateway: {
        name: "api",
        region: "eu-west-3",
        endpoint: "https://r7mayzn08d.execute-api.eu-west-3.amazonaws.com/dev",
      },
    },
  },
  prod: {
    urls: [/^idea-mna.netlify.app$/g],
    baseUrl: "https://idea-mna-api.herokuapp.com",
    aws: {
      apiGateway: {
        name: "api",
        region: "eu-west-3",
        endpoint: "https://c7a5ujgw35.execute-api.eu-west-3.amazonaws.com/prod",
      },
    },
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
      return config.prod;
    case "dev":
      return config.dev;
    default:
      return config.local;
  }
};

export default getConfig(getEnvName());
