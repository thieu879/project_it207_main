import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://192.168.1.7:8080/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});