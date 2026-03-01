import axios from "axios";

const API = axios.create({
  baseURL: "https://hierarchy-management.onrender.com"
});

export default API;