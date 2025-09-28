import fs from "node:fs";

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
