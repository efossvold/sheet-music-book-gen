import { writeFileSync } from "fs";
import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import "dotenv/config";

const api = new ILovePDFApi(
  process.env.I_LOVE_PDF_API_PUBLIC,
  process.env.I_LOVE_PDF_API_SECRET_KEY
);

const task = api.newTask("pagenumber");

const src = process.argv[2];
const dest = process.argv[3];

if (!src || !dest) {
  console.log(`Usage: ${process.argv[1]} source.pdf dest.pdf`);
  process.exit(1);
}

task
  .start()
  .then(() => {
    console.log("ILovePDFApi: Uploading", src);
    return task.addFile(new ILovePDFFile(src));
  })
  .then(() => {
    console.log("ILovePDFApi: Processing");
    return task.process({
      // With the facing_pages property you can set your PDF numbering in facing mode, like a book or a magazine. This only takes effect when combined with horizontal_position left or right and will place all page numbers mirrored between pages where left will place numbers to the inside and right to the outside of the page.
      facing_pages: true,
      starting_number: "2",
      pages: "2-end",
      vertical_position: "bottom",
      vertical_position_adjustment: 20,
      horizontal_position: "left",
      horizontal_position_adjustment: 20,
      font_family: "Times New Roman",
      font_size: 11,
      font_color: "#000000",
    });
  })
  .then(() => {
    console.log("ILovePDFApi: Downloading");
    return task.download();
  })
  .then((data) => {
    console.log("ILovePDFApi: Writing", dest);
    writeFileSync(dest, data);
  });
