"use server";

import { getCookiesForServer } from "@/features/cookies/utils/get-server-cookies";
import { BASE_URL } from "./root";

interface Options {
  method?: "POST" | "PUT" | "GET" | "DELETE" | "PATCH";
  body?: unknown;
  externalCookie?: string;
}

/**
 * A generic server query function for server-side or API routes.
 * Automatically parses JSON response and returns both raw and parsed results.
 */
export const serverQuery = async <T>(
  url: string,
  options?: Options
): Promise<{
  initialResponse?: Response;
  jsonResponse?: T;
}> => {
  try {
    const cookieStringified =
      options?.externalCookie || (await getCookiesForServer());

    const initialResponse = await fetch(`${BASE_URL}${url}`, {
      method: options?.method || "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieStringified
        // "x-contract-id": DEFAULT_CONTRACT_ID || "1",
      },
      ...(options?.body ? { body: JSON.stringify(options.body) } : {})
    });

    if (!initialResponse.ok) {
      console.error(
        `Request failed with status ${initialResponse.status}: ${initialResponse.statusText}`
      );
      return { initialResponse, jsonResponse: undefined };
    }

    const jsonResponse = (await initialResponse.json()) as T;

    return {
      initialResponse,
      jsonResponse
    };
  } catch (error) {
    console.error("serverQuery error:", error);
    return { initialResponse: undefined, jsonResponse: undefined };
  }
};
