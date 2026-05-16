import {
  host,
  AbstractPlugin,
  defaultFetchImage,
  fetchDOM,
} from "@toonscraper/plugin-core";

/** @type {AbstractPlugin & {hydrationContext, chapterNames}} */
export const ComixToMangaPlugin = {
  name: "ComixToMangaPlugin",
  hydrationContext: null,
  chapterNames: null,

  handles(url) {
    return host(url) === "comix.to";
  },

  async fetchTitle(url) {
    const DOM = await fetchDOM(url);
    const hydrationText = DOM.getElementText(
      "script",
      /hash_id/,
      (x) => x.match(/self.__next_f.push\((.*)\)/)[1],
    );
    const j1 = JSON.parse(hydrationText);
    const j2 = JSON.parse(j1[1].substring(2));

    ComixToMangaPlugin.hydrationContext =
      j2[1][3].children[1][3].children[3].manga;
    ComixToMangaPlugin.chapterNames = {};

    console.log("hash_id:", ComixToMangaPlugin.hydrationContext.hash_id);
    return DOM.getText("h1.title", (x) => x.trim());
  },

  async fetchIndex(url) {
    const id = ComixToMangaPlugin.hydrationContext.hash_id;

    // fetch first page
    console.log(
      `fetching: https://comix.to/api/v2/manga/${id}/chapters?limit=100&order[number]=asc`,
    );
    const firstPage = await fetch(
      `https://comix.to/api/v2/manga/${id}/chapters?limit=100&order[number]=asc`,
    ).then((x) => x.json());
    const chapters = firstPage.result.items;
    const pagination = firstPage.result.pagination;

    // fetch remaining pages
    for (let i = 2; i <= pagination.last_page; i++) {
      console.log(
        `fetching: https://comix.to/api/v2/manga/${id}/chapters?page=${i}&limit=100&order[number]=asc`,
      );

      const currentPage = await fetch(
        `https://comix.to/api/v2/manga/${id}/chapters?page=${i}&limit=100&order[number]=asc`,
      ).then((x) => x.json());
      chapters.push(...currentPage.result.items);
    }

    // group volume, then chapter.
    const groupedData = {};
    for (const chapter of chapters) {
      groupedData[chapter.volume] ??= {};
      groupedData[chapter.volume][chapter.number] ??= [];
      groupedData[chapter.volume][chapter.number].push(chapter);
    }

    const urls = [];

    for (const volume of Object.keys(groupedData)) {
      for (const number of Object.keys(groupedData[volume])) {
        const chapterCandidates = groupedData[volume][number];
        // prefer higher voted candidates
        chapterCandidates.sort((a, b) => b.votes - a.votes);
        urls.push(
          `https://comix.to/api/v2/chapters/${chapterCandidates[0].chapter_id}/`,
        );
      }
    }

    return urls;
  },

  async fetchChapter(url) {
    const response = await fetch(url).then((x) => x.json());
    ComixToMangaPlugin.chapterNames[url] =
      `v${response.result.volume}-chapter-${response.result.number}`;
    return response.result.images.map((x) => x.url);
  },

  async getChapterName(url) {
    return ComixToMangaPlugin.chapterNames[url];
  },

  async downloadImage(image, outDirName, idx) {
    return defaultFetchImage(image, outDirName, idx);
  },
};
