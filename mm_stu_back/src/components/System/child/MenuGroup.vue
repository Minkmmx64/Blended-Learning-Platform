<template>
  <el-sub-menu
    :index="Props.key"
    style="width: 180px;"
  >
    <template #title>
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
    </template>
    <slot :sub="Props.subMenu" />
  </el-sub-menu>
</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { ISystemMenus } from "../AdminSystemLayout.type";
import IconFont from "@/components/display/icon/IconFont.vue";
export default defineComponent({
  name: "MenuGroup",
  components: { IconFont },
  props: ["data", "iscollapse"],
  setup(props){
    const { data: Props, iscollapse: is } = toRefs<{data : ISystemMenus, iscollapse: boolean}>(props);
    return { Props, is }
  }
})
</script>
  
<style lang="scss" scoped>
  
</style>