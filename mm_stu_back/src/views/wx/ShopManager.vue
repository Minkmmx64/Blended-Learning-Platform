<template>
  <div class="w-full h-full scroll">
    <div class="TableHead">
      <el-row class="mb-10 mt-10" :gutter="20">
        <el-col :span="6">
          <div class="grid-content ep-bg-purple-dark">
            <el-button
              type="primary"
              @click="TableProps.handleEditOpen('create')"
            >
              添加 {{ TableProps.apiname }}
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="QueryParams.classify_id"
            class="m-2"
            placeholder="select classify"
          >
            <el-option
              v-for="item in Classify"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="QueryParams.name"
            placeholder="shop name"
          />
        </el-col>
        <el-col :span="6">
          <div class="grid-content ep-bg-purple-dark">
            <el-button
              type="success"
              @click="TableProps.loadTableDatas()"
            >
              查询 {{ TableProps.apiname }}
            </el-button>
            <el-button
              type="info"
              @click="TableProps.handleClearQuery()"
            >
              <IconFont icon="refresh" />
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      v-model="isEdit"
      :title="`${EditTxt}-${TableProps.apiname}`"
      width="30%"
    >
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}名称:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.name"
            placeholder="shop name"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}照片:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-upload
            ref="uploadRef"
            class="upload-demo mt-5"
            :before-upload="onBeforeUploadAvatar"
          >
            <ImageLayout
              class="mt-5"
              :width="80"
              :height="80"
              :resource="EditParams.avatar"
            />
          </el-upload>
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}分类:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-select
            v-model="EditParams.classify_id"
            class="m-2"
            placeholder="select classify"
          >
            <el-option
              v-for="item in Classify"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}单价:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input-number
            v-model="EditParams.prices"
            controls-position="right"
            class="m-2"
            placeholder="shop prices"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}库存:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input-number
            v-model="EditParams.stock"
            controls-position="right"
            class="m-2"
            placeholder="shop stock"
          />
        </el-col>
      </el-row>
      <el-row class="mb-5 text-center">
        <el-col :span="6">
          <div class="h-full flex-row flex-center">
            <span>{{ TableProps.apiname }}描述:</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="EditParams.remark"
            placeholder="shop remark"
          />
        </el-col>
      </el-row>
      <template v-for="(item, index) in EditParams.detail" :key="index">
        <el-row class="mb-1 text-center flex-center">
          <el-col :span="6">
            <div class="h-full flex-row flex-center">
              <span>{{ TableProps.apiname }}详情:</span>
            </div>
          </el-col>
          <el-col :span="12">
            <el-upload
              ref="uploadRef"
              class="upload-demo mt-5"
              :before-upload="raw => onBeforeUpload(raw, index)"
            >
              <ImageLayout
                class="mt-5"
                :width="80"
                :height="80"
                :resource="item"
              />
            </el-upload>
          </el-col>
          <el-col :span="6">
            <el-button @click="delDetail(index)" type="danger">删除</el-button>
          </el-col>
        </el-row>
      </template>
      <div class="w-full flex-row flex-center"><el-button type="success" @click="addDetail">添加详情</el-button></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="TableProps.handleEditClose">取消</el-button>
          <el-button
            type="primary"
            :loading="EditLoading"
            @click="TableProps.handleEditConfirm"
          > {{ EditTxt }} </el-button>
        </span>
      </template>
    </el-dialog>
    <TableContent
      :loading="TableLoading" 
      :total="total" 
      :DataSource="DataSource"
      @refresh="TableProps.loadTableDatas"
      @handleSizeChange="TableProps.handleSizeChange"
      @handleCurrentChange="TableProps.handleCurrentChange"
      @handleSortChange="TableProps.handleSortChange"
    >
      <el-table-column
        fixed
        type="index"
        width="50"
      />
      <el-table-column
        prop="id"
        label="ID"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        prop="name"
        label="商品名称"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="avatar"
        label="商品图片"
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="row.avatar"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :initial-index="4"
            :preview-teleported="true"
            :preview-src-list="[row.avatar]"
            fit="cover"
            :hide-on-click-modal="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="prices"
        label="价格"
        header-align="center"
        align="center"
        width="100"
      />
      <el-table-column
        prop="stock"
        label="库存"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="classify.name"
        label="所属分类"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="detail"
        label="查看详情"
        header-align="center"
        align="center"
        width="100"
      >
        <template #default="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="getlist(row.detail)[0]"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :initial-index="4"
            :preview-teleported="true"
            :preview-src-list="getlist(row.detail)"
            fit="cover"
            :hide-on-click-modal="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="描述"
        header-align="center"
        align="center"
        width="200"
      />
      <el-table-column
        prop="status"
        label="状态"
        sortable
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <el-tag
            v-if="row.status"
            class="ml-2 select-none"
            type="success"
          >
            启用
          </el-tag>
          <el-tag
            v-else
            class="ml-2 select-none"
            type="danger"
          >
            禁用
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <showTime :date="row.create_time" />
        </template>
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="修改时间"
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <showTime :date="row.update_time" />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        header-align="center"
        align="center"
        width="300"
      >
        <template #default="{ row }">
          <el-button
            type="success"
            @click="TableProps.handleEditOpen('update', row)"
          >
            编辑
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            type="danger"
            @click="TableProps.handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </TableContent>
  </div>
</template>
<script lang="ts" setup>
import { shop, shopdata } from "@/Request/ApiModules/wx/shop";
import classify from "@/Request/ApiModules/wx/classify";
import { useTableFunction } from "@/components/TableFunction/useTableFunction";
import { onMounted, ref } from "vue";
import { ElMessage, UploadRawFile } from "element-plus";
import common from "@/Request/ApiModules/common";
//添加修改对象
const EditParams = ref({
  name: "",
  remark: "",
  avatar: "",
  prices: undefined,
  stock: undefined,
  classify_id: undefined,
  detail: []
});

const Classify = ref([]);

const loadClassify = () => {
  classify.all().then( res => {
    Classify.value = res.data.data;
  }).catch(ElMessage.error);
}

//查询对象
const QueryParams = ref({
  name: "",
  classify_id: undefined
});

const addDetail = () => {
  EditParams.value.detail.push(undefined);
}

const delDetail = (pos: number) => {
  EditParams.value.detail.splice(pos, 1);
}

const getlist = (detail: string) => {
  try {
    return JSON.parse(detail);
  } catch (error) {
    return [];
  }
}

const TableProps = useTableFunction<shop>(
  "商品",
  shop,
  QueryParams,
  EditParams,
  undefined,
  undefined,
  shopdata
);

const { isEdit, DataSource, TableLoading, total , EditTxt, EditLoading } = TableProps;

const onBeforeUpload = (rawFile: UploadRawFile, pos: number) => {
  const data = new FormData();
  data.append("file", rawFile);
  common.upload(data).then(res => {
    setTimeout(() => {
      const url = res.data.data.url;
      EditParams.value.detail[pos] = url;
      ElMessage.success("上传成功!");
    }, 500);
  }).catch(error => { ElMessage.error("上传失败!" + error); })
  return false;
}

const onBeforeUploadAvatar = (rawFile: UploadRawFile) => {
  const data = new FormData();
  data.append("file", rawFile);
  common.upload(data).then(res => {
    setTimeout(() => {
      const url = res.data.data.url;
      EditParams.value.avatar = url;
      ElMessage.success("上传成功!");
    }, 500);
  }).catch(error => { ElMessage.error("上传失败!" + error); })
  return false;
}

onMounted( async () => {
  TableProps.loadTableDatas();
  loadClassify();
})
</script>
