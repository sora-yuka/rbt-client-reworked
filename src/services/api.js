import axios from "axios";

import { baseUrl } from "../utils/constants";
import { tokenService } from "../utils/token";

const api = axios.create({ baseURL: baseUrl });

let logoutHandler = () => {};
export const registerLogoutHandler = (handler) => {
  logoutHandler = handler;
};

api.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = "Bearer " + accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originRequest = error.config;

    if (error.response?.status === 401 && !originRequest._retry) {
      originRequest._retry = true;

      try {
        const refreshToken = tokenService.getRefreshToken();

        const response = await axios.post(baseUrl + "/api/v1/users/refresh", {
          refresh: refreshToken,
        });
        const { access, refresh } = response.data;

        tokenService.setTokens(access, refresh);
        originRequest.headers.Authorization = "Bearer " + access;
        return api(originRequest);
      } catch (refreshError) {
        tokenService.clearTokens();
        logoutHandler;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
