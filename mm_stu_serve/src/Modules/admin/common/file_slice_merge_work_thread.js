const mergefile = require("mergefile/build/Release/Main");
const worker_threads = require("node:worker_threads");
const path = require("node:path");
const fs = require("node:fs");

function writeFileAsync(sourceFilePath, destinationFilePath) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    try {
      const sourceData = fs.readFileSync(sourceFilePath);
      fs.appendFileSync(destinationFilePath, sourceData);
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      resolve(elapsedTime);
    } catch (error) {
      reject(error);
      console.error(`Error writing file: ${error.message}`);
    }
  })
}

function writeMultipleFilesAsync(destinationFilePath, slice, filename){
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const cb = [];
    for (let i = 0; i < slice; i++) {
      cb.push(writeFileAsync(path.join(__dirname, "..","..", ".." ,"static", "file", filename, `${i}`), destinationFilePath));
    }
    Promise.all(cb).then(e => {
      resolve(Date.now() - start);
    }).catch(reject);
  })
}
//const time = await writeMultipleFilesAsync(options.entry_dir + "_node",options.slice_count, options.out_name);

(async () => {
  //合并文件
if(!worker_threads.isMainThread) {
  const options = worker_threads.workerData;
  try {
    
    const ret = mergefile.mm_merge_file(options);
    console.log(ret, /**time */);
    worker_threads.parentPort.postMessage("ok");
  } catch (error) {
    throw new Error(error);
  }
}
})();