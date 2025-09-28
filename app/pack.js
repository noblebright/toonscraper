import fs from "node:fs";
import path from "node:path";
import AdmZip from "adm-zip";

export function pack(name) {
  if (!fs.existsSync("packed")) {
    fs.mkdirSync("packed");
  }
  const src = path.join("output", name);
  const dirs = fs.readdirSync(src, { withFileTypes: true });

  if (!fs.existsSync(src)) {
    throw new Error(`Unable to find source dir: ${src}`);
  }

  const base = path.join("packed", name);
  if (!fs.existsSync(base)) {
    fs.mkdirSync(base);
  }
  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    console.log("packing:", dir.name);
    const zip = new AdmZip();
    zip.addLocalFolder(path.join(src, dir.name));
    zip.writeZip(path.join(base, `${name} - ${dir.name}.cbz`));
  }
}
