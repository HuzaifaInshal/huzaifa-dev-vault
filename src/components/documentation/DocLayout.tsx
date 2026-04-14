import React from "react";
import DocumentationWrapper from "./DocumentationWrapper";
import { CommonPageProps } from "@/features/navigation/navigationType";

const DocLayout = ({
  children,
  description,
  title
}: {
  children: React.ReactNode;
} & CommonPageProps) => {
  return (
    <DocumentationWrapper description={description} title={title}>
      <div className="doclayout flex-1">{children}</div>
    </DocumentationWrapper>
  );
};

export default DocLayout;
