import React from "react";

interface Props {
  language: "tsx" | "ts" | "js" | "jsx" | "json" | "css" | "html" | "md";
  children: React.ReactNode;
}

const Code = ({ language = "tsx", children }: Props) => {
  return <div>{children}</div>;
};

export default Code;
