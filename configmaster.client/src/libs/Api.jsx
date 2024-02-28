import { AxiosInstance } from "./AxiosInstance";

export const Requests = () => {
  const axiosInstance = AxiosInstance();
  return {
    CommonRequest: {
      async get(data) {
        let response = await axiosInstance.get(data.url, {
          headers: data.headers,
        });
        if (response && response?.data && response.data?.Response) {
          response = {
            ...response,
            data: JSON.parse(response?.data?.Response),
          };
        }
        return response;
      },
      async post(data) {
        let response = await axiosInstance.post(
          data.url,
          JSON.stringify(data.content),
          {
            headers: data.headers,
          }
        );
        if (response && response?.data && response.data?.Response) {
          response = {
            ...response,
            data: JSON.parse(response?.data?.Response),
          };
        }
        return response;
      },
      async put(data) {
        let response = await axiosInstance.put(
          data.url,
          JSON.stringify(data.content),
          {
            headers: data.headers,
          }
        );
        if (response && response?.data && response.data?.Response) {
          response = {
            ...response,
            data: JSON.parse(response?.data?.Response),
          };
        }
        return response;
      },
      async delete(data) {
        let response = await axiosInstance.delete(
          `${data.url}/${JSON.stringify(data.content.id)}`,
          { headers: data.headers }
        );
        if (response && response?.data && response.data?.Response) {
          response = {
            ...response,
            data: JSON.parse(response?.data?.Response),
          };
        }
        return response;
      },
      async getById(data) {
        let response = await axiosInstance.get(
          `${data.url}/${JSON.stringify(data.content.id)}`,
          { headers: data.headers }
        );
        if (response && response?.data && response.data?.Response) {
          response = {
            ...response,
            data: JSON.parse(response?.data?.Response),
          };
        }
        return response;
      },
    },
  };
};
