import { Root } from "rehype-raw";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

import { ipfsLinkToHttpLink } from "@/lib/ipfs";

export type RehypeImageCache = {
  cover?: string;
  images: string[];
};

export const rehypeImage: Plugin<Array<{ cache: RehypeImageCache }>, Root> =
  (config) => (tree:any) => {
    const cache = config?.cache ?? {};

    visit(tree, { tagName: "img" }, (node) => {
      const imgUrl = getUrl(node.properties?.src);

      if (imgUrl) {
        if (node.properties) {
          cache.images.push(imgUrl);
          node.properties.src = imgUrl;
        }

        if (!cache.cover) {
          cache.cover = imgUrl;
        }
      }
    });
  };

function getUrl(src: unknown): string {
  const url = typeof src === "string" && src ? src : "";
  return ipfsLinkToHttpLink(url);
}
