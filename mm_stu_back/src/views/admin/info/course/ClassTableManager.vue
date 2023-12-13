<template>
  <div class="w-full h-full mb-40">
    <div class="TableHead">
      <el-row class="mb-10 mt-10" :gutter="20">

      </el-row>
    </div>
    <el-dialog v-model="isEdit" title="安排课程" width="30%">
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isEdit = false">取消</el-button>
          <el-button type="primary"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="course-table-container scroll">
      <table class="course-table-container-table flex-column w-full">
        <tr align="center" class="course-table-container-tr flex-row w-full">
          <td class="course-table-container-td border-info h-full" v-for="(item, index) in day" :key="index"> {{ item }}
          </td>
        </tr>
        <template v-for="(item, index) in time" :key="index">
          <tr align="center" class="course-table-container-item-tr flex-row w-full">
            <template v-if="(typeof item === 'number')">
              <td v-for="(d, dindex) in day" :key="dindex"
                :class="'course-table-container-item-td select-none h-full ' + (dindex !== 0 ? 'course-table-container-item-td-hover point' : '')"
                @click="SelectClassTablePosition(index, dindex)">
                <span v-if="dindex === 0">{{ item }} </span>
                <span v-else>({{ index }}, {{ dindex }})</span>
              </td>
            </template>
            <template v-else>
              <td class="course-table-container-blank-td select-none" :colspan="day.length">{{ item }}</td>
            </template>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
const day = ["    ", "一", "二", "三", "四", "五", "六", "日"];
const time = [1, 2, 3, 4, 5, "中午", 6, 7, 8, 9, "晚上", 10, 11, 12];
const isEdit = ref(false);
const SelectClassTablePosition = (x: number, y: number) => {
  if (y == 0) return;
  isEdit.value = true;
}

</script>
  
<style lang="scss" scoped>
.course-table-container {
  width: 60%;
  height: 700px;
  margin: 0 auto;
  .course-table-container-table {
    .course-table-container-item-tr {
      .course-table-container-item-td {
        width: calc(100% / 8);
        height: 80px;
        line-height: 80px;
        border: 1px solid $info;
        transition: 500ms all ease;

        +.course-table-container-item-td-hover {
          &:hover {
            border-color: $primary;
          }
        }
      }

      .course-table-container-blank-td {
        width: 100%;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}

.course-table-container-tr {
  height: 40px;
  .course-table-container-td {
    width: calc(100% / 8);
    line-height: 40px;
  }
}
</style>