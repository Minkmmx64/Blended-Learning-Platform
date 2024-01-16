import { UploadRawFile, ElMessage } from "element-plus";
import common from "@/Request/ApiModules/common";
import {ref, Ref} from "vue";
/**
 * 获取文件分片
 * @param slice 当前第几片 从 0 开始
 * @param chunk 每一片大小 单位 kb
 * @param File  文件信息
 */
function getFileSlice(slice : number, chunk: number, File: UploadRawFile) : Blob {
    return File.slice(slice * chunk, Math.min((slice + 1) * chunk, File.size));
}

export interface MergeData {
  url: string;
  type: string;
}

interface IuseElUploadFiles {
    //分片单元, 单位kb
    chunk?: number;
    //上传进度，根据每一份大小和文件大小决定
    onprogress?: (value: number) => void;
    //文件md5生成成功
    oncalcmd5?: (value: { md5: string, time: number }) => void;
    //生成md5进度
    oncalcmd5progress?: (value: number | string) => void;
    //上传文件成功
    onsuccess: (value: MergeData) => void;
}

interface useElUploadFilesRet {
    //暂停上传
    useStopUpload: () => void;
    //重新开始上传
    useAccessUpload: () => void;
    //第一次开始上传
    StartUpload: () => void;
    //是否暂停
    isStop: Ref<boolean>;
    //load
    loading: Ref<loadingProps>
}

interface loadingProps {
  //上传按钮load
  uploading: boolean;
  //停止上传load
  deloading: boolean
}

//分片上传
export function useElUploadFiles(rawFile: Ref<UploadRawFile>, options: IuseElUploadFiles)
    : useElUploadFilesRet
{
    const loading = ref<loadingProps>({
      uploading: false,
      deloading: false
    });

    const isStop = ref<boolean>(false);
    let MD5 = null;
    let max_slice = null;
    options.chunk = (options.chunk ?? 1) * 1024;

    function StartUpload() {
        //
        loading.value.uploading = true;
        //
        if(rawFile.value.size <= 0) {
            //直接上传
        } else {
            max_slice = Math.ceil(rawFile.value.size / (options.chunk));
            ElMessage.info("文件过大， 启用分片上传!!");
            const calcMd5Worker = new Worker("./calculate_slice_file_md5.js");
            calcMd5Worker.postMessage([ rawFile.value, options.chunk ]);
            calcMd5Worker.onmessage = async e => {
                if(typeof e.data === "string" || typeof e.data === "number") {
                    let progress = e.data as number;
                    options?.oncalcmd5progress && options?.oncalcmd5progress(progress);
                } else {
                    const { md5, time } = e.data;
                    MD5 = md5;
                    options?.oncalcmd5 && options?.oncalcmd5({ md5, time });
                    try {
                        //在服务端创建一个md5名字的文件夹
                        await Action();
                    } catch (e) {
                        ElMessage.error("文件上传停止，错误:" + JSON.stringify(e));
                        //删除这个文件md5的所有信息
                        //......

                    }
                }
            }
        }
    }

    async function Action() {
      //尝试秒传
      const res = await common.FileUploadStart(MD5, rawFile.value.name);
      const { chunk, exist } = res.data.data;
      //文件秒传
      if(exist) {
        options?.onsuccess && options?.onsuccess({ url: exist.src, type: exist.type });
        ElMessage.success("文件上传成功");
        loading.value.uploading = false;
      } else 
          await startUploadSliceFile(chunk, MD5, max_slice);
    }

    async function startUploadSliceFile(slice: number, md5: string, max_slice: number) {
        options?.onprogress && options?.onprogress(parseFloat(((slice / max_slice) * 100).toFixed(2)));
        if(slice >= max_slice) {
            //文件传输完成，开始合并
            const MergeResult = await common.MergeFile(md5);
            const { url, type } = MergeResult.data.data as MergeData;
            console.log(MergeResult.data.data);
            options?.onsuccess && options?.onsuccess({ url, type });
            ElMessage.success("文件上传成功");
            loading.value.uploading = false;
            return;
        }
        if(isStop.value) {
            ElMessage.info("暂停...");
            return;
        }
        const req = new FormData();
        req.append("md5", md5)
        req.append("file", getFileSlice(slice, options.chunk, rawFile.value));
        req.append("number", slice.toString());
        await common.uploadSlice(req);
        await startUploadSliceFile(slice + 1, md5, max_slice);
    }

    //暂停上传
    function useStopUpload() {
        isStop.value = true;
    }

    //继续上传
    async function useAccessUpload() {
        isStop.value = false;
        await Action();
    }

    return {
        useStopUpload,
        useAccessUpload,
        StartUpload,
        isStop,
        loading
    }
}