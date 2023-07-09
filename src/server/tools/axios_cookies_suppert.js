/* eslint-disable no-param-reassign */
// Reference https://github.com/3846masa/axios-cookiejar-support/blob/main/src/index.ts
import crypto from 'crypto';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http';

const AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT = Symbol('AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT');

const requestInterceptor = (config) => {
  if (!config.jar) {
    return config;
  }

  if (config.jar === true) {
    throw new Error('config.jar does not accept boolean since axios-cookiejar-support@2.0.0.');
  }

  const ACBA = AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT;
  if ((config.httpAgent != null && config.httpAgent[ACBA] !== true)
  || (config.httpsAgent != null && config.httpsAgent[ACBA] !== true)) {
    throw new Error('axios-cookiejar-support does not support for use with other http(s).Agent.');
  }

  const cookieAgents = {
    // 解決北科TLS問題
    secureOptions: crypto.constants.SSL_OP_NO_TLSv1_2,
    cookies: {
      jar: config.jar,
    },
  };

  const objectProperty = {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  };
  config.httpAgent = new HttpCookieAgent(cookieAgents);
  config.httpsAgent = new HttpsCookieAgent(cookieAgents);

  Object.defineProperty(
    config.httpAgent,
    AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT,
    objectProperty,
  );
  Object.defineProperty(
    config.httpsAgent,
    AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT,
    objectProperty,
  );

  return config;
};

const withCookie = (axios) => {
  // 如果已經被包裝過，就不要再包裝了
  const iswrapped = axios.interceptors.request.handlers
    .find(({ fulfilled }) => fulfilled === requestInterceptor);

  if (iswrapped) {
    return axios;
  }

  axios.interceptors.request.use(requestInterceptor);
  if ('create' in axios) {
    const { create } = axios;
    // eslint-disable-next-line no-param-reassign
    axios.create = (...args) => {
      const instance = create.apply(axios, args);
      instance.interceptors.request.use(requestInterceptor);
      return instance;
    };
  }
  return axios;
};

export default {
  withCookie,
};
