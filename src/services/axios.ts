"use client";
import axios from "axios";
import { BASE_URL } from "./root";

// -------------|| Axios Declaration ||-------------

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  }
});
