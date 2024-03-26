import axios from "axios";
// 상황따라 주소 다름
const LOCAL_BACKEND = process.env.REACT_APP_LOCAL_BACKEND;
// const PROD_BACKEND = process.env.REACT_APP_PROD_BACKEND;
// const BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY;
const token = sessionStorage.getItem("token");
const api = axios.create({
  baseURL: LOCAL_BACKEND,
  headers: {
    "Content-Type": "application/json",
    "authorization": token? `Bearer ${token}` : undefined
  },
});
api.interceptors.request.use(
  (request) => {
    // console.log("Start api request", request);
    return request;
  },
  function (error) {
    console.log("request error", error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    error = error.response.data;
    console.log("response error", error);
    return Promise.reject(error);
  }
);

export default api;
