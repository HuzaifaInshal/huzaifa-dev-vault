"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import NoInternetUI from "./NoInternetUI";

interface Props {
  children: React.ReactNode;
}

async function isInternetConnectionWorking() {
  if (!navigator.onLine) return false;

  const headers = new Headers();
  headers.append("cache-control", "no-cache");
  headers.append("pragma", "no-cache");

  try {
    await fetch("/api/status", {
      method: "HEAD",
      headers,
      cache: "no-store"
    });
    return true;
  } catch (error) {
    if (error instanceof TypeError) return false;
    throw error;
  }
}

const NoInternetOverlay = ({ children }: Props) => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isOfflineWithDelay] = useDebounce(isOffline, 1000);

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await isInternetConnectionWorking();
      // console.log("isConnected", isConnected);
      setIsOffline(!isConnected);
    };

    checkConnection();

    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, []);

  return (
    <Fragment>
      {isOfflineWithDelay && isOffline ? <NoInternetUI /> : null}
      {children}
    </Fragment>
  );
};

export default NoInternetOverlay;
