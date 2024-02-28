import Axios from "axios";

let instanceAxios;

export const AxiosInstance = () => {
  if (instanceAxios) {
    return instanceAxios;
  } else {
    instanceAxios = Axios.create();
    instanceAxios.interceptors.request.use(
      function (config) {
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
    instanceAxios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    return instanceAxios;
  }
};
