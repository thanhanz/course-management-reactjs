import axios from "axios";


const BASE_URL = "http://localhost:5000";

export const endpoints = {
    "login": "/login",
    "current-user":"/current-user",
    "logout": "/logout",
    "register": "/register",
    "get-all-courses": '/api/courses'
};

export const apiClient = () => axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Để gửi cookies nếu cần
});