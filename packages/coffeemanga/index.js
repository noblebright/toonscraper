import {
  host,
  fetchList,
  fetchImage,
  localPathFromUrl,
  getBaseName,
} from "@toonscraper/plugin-core";

/** @type {import("@toonscraper/plugin-core").AbstractPlugin} */
/** @implements {AbstractPlugin} */
export const CoffeeMangaPlugin = {
  name: "CoffeMangaPlugin",

  handles(url) {
    return host(url) === "www.coffeemanga.art";
  },

  async fetchTitle(url) {
    const list = await fetchList(url, "h1", (e) => e.textContent.trim());
    return list[0];
  },

  async fetchIndex(url) {
    return (await fetchList(url, ".wp-manga-chapter a", "href")).reverse();
  },

  async fetchChapter(url) {
    return fetchList(url, "div.page-break.no-gaps > img", "src");
  },

  async getChapterName(url) {
    return getBaseName(url);
  },

  async downloadImage(image, outDirName) {
    return fetchImage(
      image,
      {
        headers: {
          accept:
            "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          pragma: "no-cache",
          priority: "i",
          "sec-ch-ua":
            '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "image",
          "sec-fetch-mode": "no-cors",
          "sec-fetch-site": "cross-site",
          "sec-fetch-storage-access": "active",
          Referer: "https://www.coffeemanga.art/",
        },
      },
      localPathFromUrl(image, outDirName)
    );
  },
};
