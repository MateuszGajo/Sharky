import axios from "axios";
import Router from "next/router";

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async (error) => {
    const message = error.response?.data;
    const status = error.response?.status;
    if (
      (message === "invalid-token" || message === "password-changed") &&
      status === 401
    ) {
      await axios.get("/user/logout").then(() => {
        Router.push("/signin");
      });
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default axios;
