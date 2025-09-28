import path from "node:path";

export function host(url) {
  const parsed = new URL(url);
  return parsed.hostname;
}

export function getBaseName(url) {
  const parsedURL = new URL(url);
  return path.basename(parsedURL.pathname);
}

export function localPathFromUrl(url, baseDir) {
  const baseName = getBaseName(url);
  const outFileName = path.join(baseDir, baseName);
  return outFileName;
}

export function sequential(url, baseDir, idx) {
  const baseName = getBaseName(url);
  const ext = path.extname(baseName);
  const outFileName = path.join(baseDir, `${idx}${ext}`);
  return outFileName;
}
