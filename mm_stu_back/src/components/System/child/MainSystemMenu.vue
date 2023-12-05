<template>
  <template
    v-for="(group, index) in Props"
    :key="index"
  >
    <template v-if="group.subMenu">
      <MenuGroup
        :data="group"
        :iscollapse="iscollapse"
      >
        <template #default="{ sub }">
          <MainSystemMenu :data="sub" />
        </template>
      </MenuGroup>
    </template>
    <template v-else>
      <SubMenu
        :data="group"
        :iscollapse="iscollapse"
      />
    </template>
  </template>
</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import SubMenu from "./SubMenu.vue";
import MenuGroup from "./MenuGroup.vue";
import { ISystemMenus } from "../AdminSystemLayout.type";
export default defineComponent({
  name: "MainSystemMenu",
  components: {
    MenuGroup,
    SubMenu
  },
  props: ["data", "collapse"],
  setup(props){
    const { data: Props, collapse: iscollapse } = toRefs<{data:ISystemMenus[], collapse: boolean}>(props);
    return { Props, iscollapse }
  }
})
</script>
  
<style lang="scss" scoped>
  
</style>