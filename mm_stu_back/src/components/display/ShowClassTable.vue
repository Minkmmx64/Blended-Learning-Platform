<template>
  <div class="c-table-main">
    <table style="width: 100%;border-collapse: collapse">
      <thead>
        <th class="c-table-main-th-content"></th>
        <template v-for="(weak, w_index) in weaks" :key="w_index">
          <th class="c-table-main-th-content">{{ weak ? '周' + weak : '' }}</th>
        </template>
      </thead>
      <tbody>
        <tr style="width: 100%;" v-for="(time, t_index) in times" :key="t_index">
          <td class="c-table-main-th-content">{{ time }}</td>
          <template v-for="(_, w_index) in weaks" :key="w_index">
            <td class="c-table-main-th-content" :style="{
              display: st.has(JSON.stringify({ x: w_index, y: t_index })) ? 'none' : ''
            }"
              :rowspan="findCourses(w_index, t_index) === -1 ? 1 : Props.courses[findCourses(w_index, t_index)].rowspan">
              <div class="c-table-main-th-render" :style="{ backgroundColor: randomColors() }"
                v-if="findCourses(w_index, t_index) !== -1">
                <p>{{ Props.courses[findCourses(w_index, t_index)].course }}</p>
                <p>{{ Props.courses[findCourses(w_index, t_index)].class }}</p>
                <p>{{ Props.courses[findCourses(w_index, t_index)].teacher }}</p>
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { randomColors } from "@/utils/common";
import { weaks, times, IProps } from './ShowClassTable';

const Props = withDefaults(
  defineProps<IProps>(),
  {

  }
);

const st = ref(new Set<string>());


watch(() => [ Props.courses ],
  () => {
    ///初始化，获取合并的课的子课列表
    Props.courses.map(({ time, weak, rowspan }) => {
      const w = weaks.findIndex(w => w === weak);
      for (let nxTime = time + 1, row = 1; row <= rowspan - 1; nxTime++, row++) {
        st.value.add(JSON.stringify({ x: w, y: nxTime }));
      }
    });
  },
  { deep: true }
)
 
onMounted(() => {

});

//查找星期weak第time节课有没有课
const findCourses = (weak: number, time: number) => {
  return Props.courses.findIndex(c => (weaks.findIndex(w => w === c.weak) === weak) && c.time === time);
}
//查找星期weak第time节课是不是子课
// weak = 1, time = 3 ,rowspan = 4 说明 weak = 1, time = 4,5,6 都是子课

</script>

<style lang="scss" scoped>
.c-table-main {
  font-size: 12px;
  width: 90%;
  margin: 0 auto;
  height: calc(100% - 50px);
  user-select: none;
}
.c-table-main-th-content {
  width: calc(100% / 8);
  height: 50px;
  border: 2px solid rgba(27, 100, 240, 0.1);
  text-align: center;
}
.c-table-main-th-render {
  width: 100%;
  font-size: 15px;
  height: 100%;
  padding: 10px 10px 10px 10px;
  box-sizing: border-box;
  background-clip: content-box;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  color: #ffffff;
}
.c-table-main-th-render > p {
  font-size: 13px;
}
</style>