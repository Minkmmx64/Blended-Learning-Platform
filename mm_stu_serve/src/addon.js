const path = require("path");

const name = "eb85c1d67ccc58b38e2c1aa53f15cf8f";
const suf = "zip";
const cnt = 52;

const addon = require("mergefile/build/Release/Main");
addon.mm_merge_file({
  entry_dir: path.join(__dirname, "static", "file"),  
  out_dir: "D:/uuuuuuuu",                             //文件输出目录
  out_name: name,                                     //分片文件夹md5目录
  file_suffix: suf,                                   //文件后缀
  slice_count:  cnt                                   //分片大小
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
  } catch (error) {
      console.error(`Error writing file: ${error.message}`);
  }
}

async function writeMultipleFilesAsync(destinationFilePath) {
 for(let i = 0 ; i < cnt; i ++){
    writeFileAsync(path.join(__dirname, "static", "file", name, `${i}`), destinationFilePath);
  }
}
writeMultipleFilesAsync("D:/uuuuuuuu/tt");

// setInterval(() => {
//   console.log(k);
// }, 2000);
