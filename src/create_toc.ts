import { readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import * as htmlPdf from "html-pdf-chrome";
import { launch } from "chrome-launcher";
import { Glob } from "bun";

const TMP_DIR = "tmp";
const TOC_TMPL = "toc_folder.tmpl.html";
const TOC_HTML = `${TMP_DIR}/toc.html`;
const TOC_PDF = `${TMP_DIR}/toc.pdf`;
const SOURCE_DIR = `${homedir()}/Documents/Music/Piano Sheet Music`;
const TITLES_PER_PAGE = 34;

const glob = new Glob("*.pdf");

const files = [];
for await (const file of glob.scan(SOURCE_DIR)) {
  files.push(file);
}

const chrome = await launch({
  startingUrl: "https://google.com",
  chromeFlags: ["--headless", "--disable-gpu", "--disable-translate"],
});

console.log("Chrome running on port", chrome.port);
console.log("Reading template");

const template = readFileSync(TOC_TMPL, "utf8");
let isPageOdd = true;

const toc_tags = files
  .sort()
  .map((line, index) => {
    const [title, composer] = line.replace(".pdf", "").split(" - ");

    if (index > 0 && index % TITLES_PER_PAGE === 0) {
      isPageOdd = !isPageOdd;
      return `<div class="pagebreak"><\/div>`;
    } else
      return `<div class="row ${isPageOdd ? "odd" : "even"}">
                <div class="title">${title}<\/div>
                <div class="composer">${composer}</div>
              </div>`;
  })
  .join("\n");

console.log("Generating PDF");

const html = template.replace("{{TOC}}", toc_tags);

const pdf = await htmlPdf.create(html, {
  port: chrome.port,
  // A4 dimensions
  printOptions: {
    paperWidth: 8.2677,
    paperHeight: 11.6929,
  },
});

console.log("PDF generated");
console.log("Writing PDF to file");

await pdf.toFile(TOC_PDF);
writeFileSync(TOC_HTML, html, "utf-8");

chrome.kill();
console.log("Done");
