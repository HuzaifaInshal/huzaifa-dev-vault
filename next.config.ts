import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { NextConfig } from "next";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  webpack(config) {
    // ?raw imports → return file content as a plain string
    config.module.rules.push({
      resourceQuery: /raw/,
      type: "asset/source",
    });
    // Normal .md imports → compile as MDX/JSX (marked as client components)
    config.module.rules.push({
      test: /\.md$/,
      resourceQuery: { not: [/raw/] },
      use: [
        {
          loader: require.resolve("./use-client-loader.js"),
        },
        {
          loader: "@mdx-js/loader",
          options: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
            providerImportSource: "next-mdx-import-source-file",
          },
        },
      ],
    });
    return config;
  },
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hluzsfqcrdfmzcaozfyb.supabase.co"
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos"
      },
      {
        protocol: "https",
        hostname: "flagcdn.com"
      },
      {
        protocol: "https",
        hostname: "example.com"
      },
      {
        protocol: "https",
        hostname: "placehold.co"
      }
    ]
  }
};

export default withMDX(nextConfig);
