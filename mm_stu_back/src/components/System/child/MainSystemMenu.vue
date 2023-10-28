<template>
  <template v-for="(group, index) in Props" :key="index">
    <template v-if="group.subMenu">
      <MenuGroup :data="group" >
        <template #default="{ sub }">
          <MainSystemMenu :data="sub" />
        </template>
      </MenuGroup>
    </template>
    <template v-else>
      <SubMenu :data="group" />
    </template>
  </template>
</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import SubMenu from "./SubMenu.vue";
import MenuGroup from "./MenuGroup.vue";
import { ISystemMenus } from "../AdminSystemLayout.type";
export default defineComponent({
  props: ["data"],
  name: "MainSystemMenu",
  components: {
    MenuGroup,
    SubMenu
  },
  setup(props){
    const { data: Props } = toRefs<{data:ISystemMenus[]}>(props);
    return { Props }
  }
})
</script>
  
<style lang="scss" scoped>
  
</style>