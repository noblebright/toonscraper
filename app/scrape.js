import { CoffeeMangaPlugin } from "@toonscraper/coffeemanga";
import { XBatoMangaPlugin } from "@toonscraper/xbato";
import { WebtoonsPlugin } from "@toonscraper/webtoons";
import { pack } from "./pack.js";
import fs from "node:fs";
import path from "node:path";

const PLUGINS = [CoffeeMangaPlugin, XBatoMangaPlugin, WebtoonsPlugin];

function normalizeName(str) {
  return str.replaceAll(/[:><\[\]"|\\/?*]/g, "").replaceAll(/\n/g, " ");
}

/**
 *
 * @param {string} url Url of the manga to scrape
 */
async function scrape(url) {
  const plugin = PLUGINS.find((x) => x.handles(url));
  if (!plugin) {
    throw new Error(`No plugin found to handle: ${url}`);
  }
  console.log("fetching title");
  // strip invalid chars from the name
  const name = normalizeName(await plugin.fetchTitle(url));
  console.log(`Name detected: ${name}`);
  console.log("fetching index");
  const chapters = await plugin.fetchIndex(url);
  if (!fs.existsSync("output")) {
    fs.mkdirSync("output");
  }
  const base = path.join("output", name);
  if (!fs.existsSync(base)) {
    fs.mkdirSync(base);
  }
  console.log(`found ${chapters.length} chapters`);
  for (let chapter of chapters) {
    console.log("fetching chapter:", chapter);
    const images = await plugin.fetchChapter(chapter);
    const chapterName = normalizeName(await plugin.getChapterName(chapter));
    let idx = 0;
    for (let image of images) {
      const outDirName = path.join(base, chapterName);
      if (!fs.existsSync(outDirName)) {
        fs.mkdirSync(outDirName);
      }
      await plugin.downloadImage(image, outDirName, idx);
      idx++;
    }
  }
  pack(name);
}

await scrape(process.argv[2]);
