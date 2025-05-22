import { readFileSync, writeFileSync } from "fs";
import * as htmlPdf from "html-pdf-chrome";
import { launch } from "chrome-launcher";

const TOC_TMPL = `${process.env.TEMPLATES_DIR}/toc.tmpl.html`;
const TMP_DIR = process.env.TMP_DIR;
const TOC_TXT = `${TMP_DIR}/toc.txt`;
const TOC_HTML = `${TMP_DIR}/toc.html`;
const TOC_PDF = `${TMP_DIR}/toc.pdf`;
const COMPOSERS_TXT = `${TMP_DIR}/composers.txt`;
const TITLES_PER_PAGE = 34;
const EDWIN_FONT = readFileSync("./assets/edwin-roman.woff2", "base64");
const EDWIN_BOLD_FONT = readFileSync("./assets/edwin-bold.woff2", "base64");

const chrome = await launch({
  startingUrl: "https://google.com",
  chromeFlags: ["--headless", "--disable-gpu", "--disable-translate"],
});

console.log("Chrome running on port", chrome.port);
console.log("Reading template");

const toc = readFileSync(TOC_TXT, "utf8");
const template = readFileSync(TOC_TMPL, "utf8")
  .replace("{{EDWIN_FONT}}", EDWIN_FONT)
  .replace("{{EDWIN_BOLD_FONT}}", EDWIN_BOLD_FONT);
const composers = readFileSync(COMPOSERS_TXT, "utf8").split("\n");
let isPageOdd = true;

const toc_tags = toc
  .trim()
  .split("\n")
  .map((line, index) => {
    const regex = /^"(.*)" (\d+)$/g;
    const matches = line.matchAll(regex);

    if (matches) {
      const match = matches.next();
      const composer = composers[index];
      const title = match.value[1].replace(composer, "").trim();
      const page = match.value[2];

      if (index > 0 && index % TITLES_PER_PAGE === 0) {
        isPageOdd = !isPageOdd;
        return `<div class="pagebreak"><\/div>`;
      } else if (match.value.length > 2) {
        return `<div class="row ${isPageOdd ? "odd" : "even"}">
            <div class="title">${title}<\/div>
            <div class="composer">${composer}<\/div>
            <div class="line"><\/div>
            <div class="page">${page}<\/div>
            <\/div>`;
      }
    }
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
