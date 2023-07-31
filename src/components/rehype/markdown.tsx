import React, { createElement, Fragment } from "react";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkBreaks from "remark-breaks";
import remarkFrontmatter from "remark-frontmatter";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeInferDescriptionMeta from "rehype-infer-description-meta";

import {
  rehypeImage,
  rehypeLink,
  rehypeSanitize,
  sanitizeSchema,
  RehypeImageCache,
  RehypeLinkCache,
} from "./plugins";
import { components } from "./components";

import styles from "./markdown.module.css";

const processor = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeInferDescriptionMeta)
  .use(rehypeReact, { createElement, Fragment, components });

const renderCache = new Map<string, RenderMarkdownResult>();

export type RenderMarkdownParams = {
  content: string;
  previewLink: boolean;
};

export type RenderMarkdownResult = {
  node: React.ReactNode;
  images: string[];
  cover: string;
  description: string;
  links: string[];
};

export function renderMarkdown({
  content,
}: Pick<RenderMarkdownParams, "content">): RenderMarkdownResult {
  const cached = renderCache.get(content);
  const result =
    cached ??
    ((): RenderMarkdownResult => {
      const imageCache: RehypeImageCache = { images: [] };
      const linkCache: RehypeLinkCache = { links: [] };
      const renderer = processor()
        .use(rehypeImage, { cache: imageCache })
        .use(rehypeLink, { cache: linkCache })
        .processSync(content);

      return {
        node: renderer.result as React.ReactNode,
        cover: imageCache.cover ?? "",
        images: imageCache.images,
        description: renderer.data.meta?.description ?? "",
        links: linkCache.links,
      };
    })();

  if (!cached) {
    renderCache.set(content, result);
  }

  return result;
}

export function Markdown({ content }: RenderMarkdownParams) {
  const markdown = renderMarkdown({ content });
  return <div className={styles.container}>{markdown.node}</div>;
}
