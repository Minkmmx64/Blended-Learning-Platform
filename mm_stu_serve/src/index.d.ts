declare module "mergefile/build/Release/Main" {
  export interface MMMergeFile {
    /**
     * 将要进行文件合并的文件目录的父目录，列如你要合并的文件目录是 file/mergename , 路径只需要 file
     */
    entry_dir: string;
    /**
     * 文件合并完成输出的目录
     */
    out_dir: string;
    /**
     * 输出文件名称
     */
    out_name: string;
    /**
     * 生成文件后缀名
     */
    file_suffix: string;
    /**
     * 文件分片长度
     */
    slice_count: number;
  }

  /**
   * @param options 合并参数
   * @returns 删除成功会删除 目录entry_dir下的所有文件以及该目录
   */
  export function mm_merge_file(options: MMMergeFile);
}