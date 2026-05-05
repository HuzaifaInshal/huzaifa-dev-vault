declare module "*.mdx" {
  import type { MDXComponents } from "mdx/types";
  import type React from "react";

  export const meta: {
    title: string;
    description?: string;
    order?: number;
    hideFromNav?: boolean;
    category?: string;
  };

  export default function MDXContent(props: {
    components?: MDXComponents;
  }): React.ReactElement;
}
