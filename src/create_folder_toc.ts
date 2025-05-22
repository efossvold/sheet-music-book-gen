import { readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import * as htmlPdf from "html-pdf-chrome";
import { launch } from "chrome-launcher";
import { Glob } from "bun";

const TOC_TMPL = `${process.env.TEMPLATES_DIR}/toc_folder.tmpl.html`;
const TOC_HTML = `${process.env.TMP_DIR}/toc_folder.html`;
const TOC_PDF = `${process.env.TMP_DIR}/toc_folder.pdf`;
const SOURCE_DIR = `${homedir()}/Documents/Music/Piano Sheet Music`;
const TITLES_PER_PAGE = 34;
const EDWIN_FONT = readFileSync("./assets/edwin-roman.woff2", "base64");
const EDWIN_BOLD_FONT = readFileSync("./assets/edwin-bold.woff2", "base64");

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

const template = readFileSync(TOC_TMPL, "utf8")
  .replace("{{EDWIN_FONT}}", EDWIN_FONT)
  .replace("{{EDWIN_BOLD_FONT}}", EDWIN_BOLD_FONT);

let isPageOdd = true;

const toc_tags = files
  .sort()
  .map((line, index) => {
    const [title, composer] = line.replace(".pdf", "").split(" - ");
    const clean_title = title.replace(composer, "").trim();

    if (index > 0 && index % TITLES_PER_PAGE === 0) {
      isPageOdd = !isPageOdd;
      return `<div class="pagebreak"><\/div>`;
    } else
      return `<div class="row ${isPageOdd ? "odd" : "even"}">
                <div class="title">${clean_title}<\/div>
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

await pdf.toFile(TOC_PDF);
writeFileSync(TOC_HTML, html, "utf-8");
console.log(`Wrote PDF to '${TOC_PDF}'"`);

chrome.kill();
console.log("Done");
