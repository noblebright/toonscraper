import {
  host,
  fetchList,
  getBaseName,
  AbstractPlugin,
  defaultFetchImage,
} from "@toonscraper/plugin-core";

/** @type {AbstractPlugin} */
export const MangaTownPlugin = {
  name: "MangaTownPlugin",

  handles(url) {
    return host(url) === "sso.mangatown.com";
  },

  async fetchTitle(url) {
    const list = await fetchList(url, "h1", (e) => e.textContent.trim());
    return list[0];
  },

  async fetchIndex(url) {
    return (await fetchList(url, ".chapter-list a", "href")).reverse();
  },

  async fetchChapter(url) {
    return fetchList(url, "div.page-break.no-gaps > img", (e) => {
      if (e.getAttribute("src").startsWith("data:")) {
        return e.getAttribute("data-src");
      } else {
        return e.getAttribute("src");
      }
    });
  },

  async getChapterName(url) {
    const rawName = getBaseName(url);
    const match = rawName.match(/chapter-\d+/);
    if (!match) {
      console.warn(`Chapter name didn't match expected pattern: ${rawName}`);
      return rawName;
    }
    return match[0];
  },

  async downloadImage(image, outDirName, idx) {
    return defaultFetchImage(image, outDirName, idx);
  },
};
