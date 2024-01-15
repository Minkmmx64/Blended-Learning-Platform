const worker_threads = require("node:worker_threads");
const fs = require("fs");
const path = require("path");

// 创建分片文件

const filePath = path.join(__dirname, "..", "..", "..", "static", "file");

if(!worker_threads.isMainThread) {
  const { dirname, file, number } = worker_threads.workerData;
  const fsw = fs.createWriteStream(path.join(filePath, dirname, number));
  fsw.write(file);
  fsw.close();
  worker_threads.parentPort.postMessage("ok");
}