import fs from "node:fs";
import { sequential } from "./UrlUtils.js";
/**
 *
 * @param {string} url
 * @param {RequestInit} opts
 * @param {string} outFileName
 */
export async function fetchImage(url, opts, outFileName) {
  if (fs.existsSync(outFileName)) {
    console.log("skipping existing file:", outFileName);
    return;
  }

  console.log(url, "->", outFileName);
  const response = await fetch(url, opts);
  if (!response.ok) {
    throw new Error(response.statusText);
    return;
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outFileName, Buffer.from(buffer));
}

/**
 * Default implementation of fetchImage
 * @param {string} image url of image
 * @param {string} outDirName path of output dir
 * @param {number} idx numeric index
 */
export async function defaultFetchImage(image, outDirName, idx) {
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
    sequential(image, outDirName, idx),
  );
}
