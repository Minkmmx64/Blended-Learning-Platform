<template>
  <div class="subject-content pl-10">
    <div class="describe pl-5 select-none">
      {{ Props.number }}&nbsp;&nbsp;&nbsp;&nbsp;、 {{ data.describe }} ({{ data.type }}) ({{ data.points }})分
    </div>
    <div v-if="data.type === SubjectType.Signal" class="type-signal pl-10">
      <el-radio-group v-model="result.signal" class="ml-4 flex-column">
        <el-radio v-for="(item, index) in options" :label="index + 1" size="large"  style="align-self: flex-start"> {{ item }} </el-radio>
      </el-radio-group>
    </div>
    <div v-if="data.type === SubjectType.Multiple" class="type-multiple pl-10">
      <el-checkbox-group v-model="result.multiple" class="ml-4 flex-column">
        <el-checkbox :label="index + 1" size="large" v-for="(item, index) in options" >{{ item }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-if="data.type === SubjectType.Judge" class="type-judge pl-10">
      <el-radio-group v-model="result.signal" class="ml-4 flex-column">
        <el-radio :label="1" size="large"  style="align-self: flex-start">对</el-radio>
        <el-radio :label="2" size="large"  style="align-self: flex-start">错</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ISubjectProps, SubjectType  } from "@/Request/ApiModules/subject";
import { computed, reactive, ref } from "vue";

interface IProps {
  data: ISubjectProps;
  number: number;
}

const Props = withDefaults(
    defineProps<IProps>(),
    { }
);

const options = computed(() => {
  try {
    return JSON.parse(Props.data.options);
  } catch (e) {
    return [];
  }
});

const result = reactive({
  signal: '1',
  multiple: []
});
</script>

<style lang="scss" scoped>
.describe {
  border-left: 1px solid $info;
  height: 60px;
  line-height: 60px;
}
</style>