import axios from "axios";

const api = axios.create({
  baseURL: "http://172.20.41.249:8000/api",
});

export default api;