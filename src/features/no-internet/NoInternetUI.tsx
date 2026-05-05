import ErrorTemplateComponent from "@/components/various/ErrorTemplateComponent";
import React from "react";

const NoInternetUI = () => {
  return (
    <ErrorTemplateComponent
      errorCode="NO_INTERNET_CONNECTION"
      retryBtn
      homePageBtn={false}
      textA="Uh Oh"
      textB="Looks like you are not connected to internet for now."
      textC="It's okay, once you get reconnected we will auto show you the web app. If you think you are connected and its an error then try refreshing from below."
      className={{
        container: "fixed top-0 bottom-0 left-0 right-0 z-[1000000]"
      }}
    />
  );
};

export default NoInternetUI;
