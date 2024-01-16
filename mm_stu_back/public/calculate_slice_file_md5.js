importScripts("./spark-md5/spark-md5.js")

onmessage = e => {
    //console.log('开始计算文件 hash');
    const current_time = Date.now();
    //计算md5 第三方库
    const SparkMD5 = new self.SparkMD5.ArrayBuffer();
    //文件信息
    const rawFile = e.data[0];
    //切片大小 单位 Byte
    const chunk = e.data[1];
    //获取某一片
    const getFileSlice = (slice, chunk, File) => {
        return File.slice(slice * chunk, Math.min((slice + 1) * chunk, File.size));
    }
    //文件大小
    const size = rawFile.size;
    //切分总大小
    const max_slice = Math.ceil(size / (chunk));
    //读取文件分片
    const calc_file_md5 = (slice) => {
        postMessage((((slice / max_slice) * 100).toFixed(2)));
        if(slice >= max_slice) {
            postMessage({
                md5: SparkMD5.end(),
                time: Date.now() - current_time
            });
            return;
        }
        const fs = new FileReader();
        fs.readAsArrayBuffer(getFileSlice(slice, chunk, rawFile));
        fs.addEventListener("load", e => {
            SparkMD5.append(e.target.result);
            calc_file_md5(slice + 1);
        })

    }
    calc_file_md5(0);
}