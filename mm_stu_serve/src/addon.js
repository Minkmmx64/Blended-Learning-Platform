const addon = require("./build/Release/Main");
const fs = require("fs");
const path = require("path");

const name = "b15b5d88d78a656ade7f8a706260aaf6";
const suf = "mp4";
const cnt = 291;

addon.mm_merge_file({
  entry_dir: path.join(__dirname, "static", "file"),
  out_dir: "D:/uuuuuuuu",
  out_name: name,
  file_suffix: suf,
  slice_count:  cnt
}, () => {

});


let k = 0;
async function writeFileAsync(sourceFilePath, destinationFilePath) {
  const startTime = Date.now();
  try {
      const sourceData = fs.readFileSync(sourceFilePath);
       fs.appendFileSync(destinationFilePath, sourceData);
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      k += elapsedTime;
      //console.log(`File ${sourceFilePath} written to ${destinationFilePath} in ${elapsedTime} ms`);
  } catch (error) {
      console.error(`Error writing file: ${error.message}`);
  }
}

async function writeMultipleFilesAsync(destinationFilePath) {
 for(let i = 0 ; i < cnt; i ++){
      await writeFileAsync(path.join(__dirname, "static", "file", name, `${i}`), destinationFilePath);
  }
}
writeMultipleFilesAsync("D:/uuuuuuuu/tt");

setInterval(() => {
  console.log(k);
}, 1000);
