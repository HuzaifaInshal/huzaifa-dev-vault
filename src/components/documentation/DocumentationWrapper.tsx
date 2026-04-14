import { CommonPageProps } from "@/features/navigation/navigationType";
import React from "react";

const DocumentationWrapper = ({
  children,
  description,
  title
}: {
  children: React.ReactNode;
} & CommonPageProps) => {
  return (
    <div className="py-5 max-w-[40rem] min-w-0 px-4 md:px-0 mx-auto flex flex-col gap-5">
      <div className="flex-1 flex gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
          <p className="text-sm font-medium text-text-secondary">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default DocumentationWrapper;
