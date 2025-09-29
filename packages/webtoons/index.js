import {
  host,
  fetchList,
  fetchImage,
  AbstractPlugin,
  sequential,
} from "@toonscraper/plugin-core";

/** @type {AbstractPlugin  & { chapterNames }} */
export const WebtoonsPlugin = {
  name: "WebtoonsPlugin",
  chapterNames: {},
  handles(url) {
    return host(url) === "www.webtoons.com";
  },

  async fetchTitle(url) {
    const list = await fetchList(url, ".info .subj", (e) =>
      e.textContent.trim()
    );
    return list[0];
  },

  async fetchIndex(url) {
    const firstPageChapter = (await fetchList(url, "#_listUl a", "href"))[0];
    return await fetchList(
      firstPageChapter,
      "#topEpisodeList .episode_cont a",
      (e) => {
        const url = e.getAttribute("href");
        WebtoonsPlugin.chapterNames[url] = e
          .querySelector(".subj")
          .textContent.trim();
        return url;
      }
    );
  },

  async fetchChapter(url) {
    return fetchList(url, "#_imageList img", "data-url");
  },

  async getChapterName(url) {
    return WebtoonsPlugin.chapterNames[url];
  },

  async downloadImage(image, outDirName, idx) {
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
          Referer: "https://www.webtoons.com/",
        },
      },
      sequential(image, outDirName, idx)
    );
  },
};
