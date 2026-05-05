"use client";
import { DynamicObject } from "@/types/common";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

// ----------------------------------------------------------------------
// 🔹 Common utility to extract a readable message from any Axios/Error
// ----------------------------------------------------------------------
function extractErrorMessage(error: Error | AxiosError): string {
  try {
    if (axios.isAxiosError(error)) {
      const responseMessage = error?.response?.data?.message;

      // 1️⃣ Message is a plain string
      if (typeof responseMessage === "string") {
        return responseMessage;
      }

      // 2️⃣ Message is an array of constraint objects (NestJS validation errors)
      if (Array.isArray(responseMessage)) {
        const messages = responseMessage.flatMap(
          (each: { constraints?: DynamicObject }) =>
            each?.constraints ? Object.values(each.constraints) : []
        );
        if (messages.length > 0) return messages.join(", ");
      }

      // 3️⃣ Fallback: Axios' own message
      if (typeof error.message === "string") {
        return error.message;
      }
    } else if (typeof error.message === "string") {
      return error.message;
    }
  } catch {
    // Ignore
  }

  // 4️⃣ Default fallback
  return "An unexpected error occurred";
}

// ----------------------------------------------------------------------
// 🔹 Toast-based handler (UI feedback)
// ----------------------------------------------------------------------
export function handleMutationError(error: Error | AxiosError) {
  toast.dismiss();
  const message = extractErrorMessage(error);
  toast.error(message);
}

// ----------------------------------------------------------------------
// 🔹 Return-based handler (non-UI usage)
// ----------------------------------------------------------------------
export function returnMutationError(error: Error | AxiosError): string {
  return extractErrorMessage(error);
}
