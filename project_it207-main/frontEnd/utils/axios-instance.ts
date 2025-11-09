import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://192.168.1.224:8080/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100000,
});