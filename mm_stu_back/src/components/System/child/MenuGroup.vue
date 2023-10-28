<template>
  <el-sub-menu :index="Props.key">
    <template #title>
      <IconFont :icon="Props.icon" class="mr-2" />
      <div class="text-overflow hidden" style="width: 80%;" >{{ Props.name }}</div> 
    </template>
    <slot :sub="Props.subMenu" />
  </el-sub-menu>
</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { ISystemMenus } from "../AdminSystemLayout.type";
import IconFont from "@/components/display/icon/IconFont.vue";
export default defineComponent({
  props: ["data"],
  name: "MenuGroup",
  components: { IconFont },
  setup(props){
    const { data: Props } = toRefs<{data : ISystemMenus}>(props);
    return { Props }
  }
})
</script>
  
<style lang="scss" scoped>
  
</style>