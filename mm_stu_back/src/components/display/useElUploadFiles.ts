import { UploadRawFile, ElMessage } from "element-plus";
import common from "@/Request/ApiModules/common";

interface  IuseElUploadFiles {
    //分片单元, 单位kb
    unit?: number;
    //上传进度，根据每一份大小和文件大小决定
    onprogress?: (value: number) => void;
}

//分片上传
export async function elUploadFiles(rawFile: UploadRawFile, options: IuseElUploadFiles) {
    options.unit = options.unit ?? 1;
    if(rawFile.size <= 0) {
        //直接上传
    } else {
        ElMessage.info("文件过大， 启用分片上传!!");
        const total = rawFile.size;
        const ByteSize = options.unit * 1024;
        const maxSlice = Math.ceil(total / ByteSize) //转换成 Byte
        //获取文件夹uuid
        const FileUploadStart = await common.FileUploadStart();
        const uuid = FileUploadStart.data.data.uuid;
        console.log(uuid, maxSlice, total, ByteSize, options.unit);
        //分片
        const send = async (slice: number) => {
            options.onprogress && options.onprogress(slice / maxSlice);
            if(slice >= maxSlice) return;
            const cliceFile: Blob = rawFile.slice(slice * ByteSize, Math.min(total, (slice + 1) * ByteSize));
            const sliceFileFormData = new FormData();
            sliceFileFormData.append("file", cliceFile);
            sliceFileFormData.append("number", `${slice}`);
            sliceFileFormData.append("uuid", uuid);
            try {
                const data = await common.uploadSlice(sliceFileFormData);
                send(slice + 1);
            } catch (error) {
                console.log(error);
                //文件分片上传失败
            }
        };
        send(0);
    }
}