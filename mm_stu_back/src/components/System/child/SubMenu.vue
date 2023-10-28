<template>
  <el-menu-item :index="Props.key">
    <IconFont :icon="Props.icon" class="mr-2" />
    <div class="text-overflow hidden" style="width: 80%;" >{{ Props.name }}</div> 
  </el-menu-item>
</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { MenuItem } from "../AdminSystemLayout.type";
import IconFont from "@/components/display/icon/IconFont.vue";
export default defineComponent({
  props:["data"],
  components: { IconFont },
  setup(props){
    const { data:Props } = toRefs<{data : MenuItem}>(props);
    return { Props }
  }
})
</script>
  
<style lang="scss" scoped>

</style>