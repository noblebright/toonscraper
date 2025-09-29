import path from "node:path";

/**
 * returns hostname of URL
 * @param {string} url
 * @returns {string}
 */
export function host(url) {
  const parsed = new URL(url);
  return parsed.hostname;
}

/**
 * Returns the base filename + extension of a url, without path.
 * @param {string} url
 * @returns {string}
 */
export function getBaseName(url) {
  const parsedURL = new URL(url);
  return path.basename(parsedURL.pathname);
}

/**
 * Returns path to save a file based on sequential index
 * @param {string} url
 * @param {string} baseDir
 * @param {number} idx
 * @returns {string}
 */
export function sequential(url, baseDir, idx) {
  const baseName = getBaseName(url);
  const ext = path.extname(baseName);
  const outFileName = path.join(baseDir, `${pad(idx)}${ext}`);
  return outFileName;
}

/**
 * returns the number n right-padded to 5 digits.
 * @param {number} n
 * @returns {string}
 */
function pad(n) {
  const digits = `${n}`.length;
  const padding = new Array(5 - digits).fill("0").join("");
  return `${padding}${n}`;
}
