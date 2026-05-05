import { mdxComponents } from "@/doc-ui/mdx-components";
import { CodeBlock } from "@/doc-ui/CodeBlock";
import { Demo } from "@/doc-ui/Demo";
import { Prompt } from "@/doc-ui/Prompt";
import type { ComponentProps } from "react";
import { MDXProvider } from "@mdx-js/react";

type MDXComponents = ComponentProps<typeof MDXProvider>["components"];

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    CodeBlock,
    Demo,
    Prompt,
    ...components,
  };
}
