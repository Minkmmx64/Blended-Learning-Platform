<template>
  <el-menu-item :index="Props.key">
    <IconFont
      :icon="Props.icon"
      class="mr-2"
    />
    <div
      v-if="!is"
      class="text-overflow hidden"
      style="width: 80%;"
    >
      {{ Props.name }}
    </div> 
  </el-menu-item>
</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { MenuItem } from "../AdminSystemLayout.type";
import IconFont from "@/components/display/icon/IconFont.vue";
export default defineComponent({
  components: { IconFont },
  props:["data" , "iscollapse"],
  setup(props){
    const { data:Props, iscollapse: is } = toRefs<{data : MenuItem, iscollapse: boolean}>(props);
    return { Props, is }
  }
})
</script>
  
<style lang="scss" scoped>
.menu {
  width: 300px;
}
</style>