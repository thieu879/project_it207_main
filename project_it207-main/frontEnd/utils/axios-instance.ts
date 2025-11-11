import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://172.20.10.4:8080/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000000,
});