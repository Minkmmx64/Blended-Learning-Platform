import { UploadRawFile, ElMessage } from "element-plus";
import common from "@/Request/ApiModules/common";

/**
 * 获取文件分片
 * @param slice 当前第几片 从 0 开始
 * @param chunk 每一片大小 单位 kb
 * @param File  文件信息
 */
function getFileSlice(slice : number, chunk: number, File: UploadRawFile) : Blob {
    return File.slice(slice * chunk, Math.min((slice + 1) * chunk, File.size));
}

interface IuseElUploadFiles {
    //分片单元, 单位kb
    chunk?: number;
    //上传进度，根据每一份大小和文件大小决定
    onprogress?: (value: number) => void;
    //文件md5生成成功
    oncalcmd5?: ({ md5: string, time: number }) => void;
    //生成md5进度
    oncalcmd5progress?: (value: number | string) => void;
}

//分片上传
export async function useElUploadFiles(rawFile: UploadRawFile, options: IuseElUploadFiles) {
    options.chunk = (options.chunk ?? 1) * 1024;
    const max_slice = Math.ceil(rawFile.size / (options.chunk));
    if(rawFile.size <= 0) {
        //直接上传
    } else {
        ElMessage.info("文件过大， 启用分片上传!!");
        const calcMd5Worker = new Worker("./calculate_slice_file_md5.js");
        calcMd5Worker.postMessage([ rawFile, options.chunk ]);
        calcMd5Worker.onmessage = async e => {
            if(typeof e.data === "string" || typeof e.data === "number") {
                let progress = e.data as number;
                options?.oncalcmd5progress && options?.oncalcmd5progress(progress);
            } else {
                const { md5, time } = e.data;
                options?.oncalcmd5 && options?.oncalcmd5({ md5, time });
                try {
                    //在服务端创建一个md5名字的文件夹
                    const res = await common.FileUploadStart(md5, rawFile.name);
                    const { chunk } = res.data.data;
                    await startUploadSliceFile(chunk, md5);
                } catch (e) {
                    ElMessage.error("文件上传停止，错误:" + JSON.stringify(e));
                    //删除这个文件md5的所有信息
                    //......

                }
            }
        }
    }

    async function startUploadSliceFile(slice: number, md5: string) {
        options?.onprogress && options?.onprogress(parseFloat(((slice / max_slice) * 100).toFixed(2)));
        if(slice >= max_slice) {
            //文件传输完成，开始合并

            return
        }
        const req = new FormData();
        req.append("md5", md5)
        req.append("file", getFileSlice(slice, options.chunk, rawFile));
        req.append("number", slice.toString());
        await common.uploadSlice(req);
        await startUploadSliceFile(slice + 1, md5);
    }

    //暂停上传
    function useStopUpload() {

    }

    //继续上传
    function useAccessUpload() {

    }

    return {
        useStopUpload,
        useAccessUpload
    }
}