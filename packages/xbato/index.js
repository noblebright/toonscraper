import {
  host,
  fetchList,
  fetchImage,
  fetchDOM,
  sequential,
  AbstractPlugin,
} from "@toonscraper/plugin-core";

/** @type {AbstractPlugin  & { chapterNames }} */
export const XBatoMangaPlugin = {
  name: "XBatoPlugin",
  chapterNames: {},
  handles(url) {
    console.log(host(url));
    return host(url) === "xbato.com";
  },

  async fetchTitle(url) {
    const list = await fetchList(url, ".item-title", (e) =>
      e.textContent.trim()
    );
    return list[0];
  },

  async fetchIndex(url) {
    return (
      await fetchList(url, ".main a.chapt", (e) => {
        url = e.getAttribute("href");
        const fullURL = `https://xbato.com${url}`;
        XBatoMangaPlugin.chapterNames[fullURL] = e.textContent.trim();
        return fullURL;
      })
    ).reverse();
  },

  async fetchChapter(url) {
    const DOM = await fetchDOM(url);
    const scriptElements = [...DOM.querySelectorAll("script:not([src])")];
    const scriptElement = scriptElements.find((x) =>
      x.innerText.includes("imgHttps")
    );
    const imageList = JSON.parse(
      scriptElement.textContent.match(/const imgHttps = (\[[^[\]]+\])/)[1]
    );
    return imageList;
  },

  async getChapterName(url) {
    return XBatoMangaPlugin.chapterNames[url];
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
          Referer: "https://xbato.com/",
        },
      },
      sequential(image, outDirName, idx)
    );
  },
};
