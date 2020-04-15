const config = {
  local: {
    urls: ["localhost:3003"],
    aws: {
      apiGateway: {
        name: "api",
        region: "local",
        endpoint: "http://localhost:3001/local",
      }
    },
  },
  dev: {
    urls: [/^idea-front-dev.netlify.com$/g, /^deploy-preview-[0-9]+--idea-front-dev.netlify.com$/g],
    aws: {
      apiGateway: {
        name: "api",
        region: "",
        endpoint: "",
      },
    },
  },
  prod: {
    urls: [/^idea-front-prod.netlify.com$/g],
    aws: {
      apiGateway: {
        name: "api",
        region: "",
        endpoint: "",
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
      return config.prod.aws;
    case "dev":
      return config.dev.aws;
    default:
      return config.local.aws;
  }
};

export default getConfig(getEnvName());
