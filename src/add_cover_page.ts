import { readFileSync, writeFileSync } from "fs";
import * as htmlPdf from "html-pdf-chrome";
import { launch } from "chrome-launcher";

const TITLE = Bun.argv[3];
const COMPOSER = Bun.argv[4];
const TOC_TMPL = `${process.env.TEMPLATES_DIR}/cover.tmpl.html`;
const TOC_HTML = `${process.env.TMP_DIR}/cover.html`;
const TOC_PDF = `${process.env.TMP_DIR}/cover.pdf`;

const chrome = await launch({
  startingUrl: "https://google.com",
  chromeFlags: ["--headless", "--disable-gpu", "--disable-translate"],
});

console.log("Chrome running on port", chrome.port);
console.log("Reading template");

const template = readFileSync(TOC_TMPL, "utf8");

console.log("Generating PDF");

const html = template
  .replace("{{TITLE}}", TITLE)
  .replace("{{COMPOSER}}", COMPOSER);

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
