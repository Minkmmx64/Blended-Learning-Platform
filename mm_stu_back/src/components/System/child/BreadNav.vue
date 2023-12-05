<template>
  <div class="Bread-Nav relative font-14 pl-2 flex-column flex-alg">
    <div class="Bread-Nav-Top w-full flex-row select-none">
      <IconFont
        class="mr-4 point"
        icon="back1"
        @click="emit('togglecollapse')"
      />
      <div
        v-for="(item,index) in Props.path"
        :key="index"
        class="Bread-Nav-List"
      >
        <span
          v-if="index === 0"
          class="text-primary"
        >{{ item.name }}</span>
        <template v-else>
          <span style="font-size: 12px;">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
          <span>{{ item.name }}</span>
        </template>
      </div>
      <UserAvatar />
    </div>
    <div class="Bread-Nav-history font-12 h-full hidden w-full flex-row flex-alg">
      <template
        v-for="(item,index) in HistoryPath"
        :key="index"
      >
        <div 
          :class="`flex-row relative flex-alg border-box Bread-Nav-item point pl-3 pr-3 ml-4 ${active === BreadMenu(item).key ? 'Bread-Nav-Menu-Select' : ''}`" 
          @click="MenuClick(BreadMenu(item))"
        >
          <div
            v-if="active === BreadMenu(item).key"
            class="Bread-Nav-close border-round mr-5 bg-fff"
          />
          <span>{{ BreadMenu(item).name }}</span>
          <div 
            class="Bread-Nav-close-btn border-round flex-row flex-center ml-4" 
            :style="{ color: `${active === BreadMenu(item).key ? '#fff' : '#000' }`}" 
            @click.stop="CloseMenu(item)"
          >
            x
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import IconFont from "@/components/display/icon/IconFont.vue";
import { ref, watch, onMounted } from "vue";
import { ISystemMenus } from "../AdminSystemLayout.type";
import UserAvatar from "@/components/Layouts/UserAvatar.vue";
interface IProps{
  path : ISystemMenus[];
  active : string;
}
interface IEmit {
  (event: 'togglecollapse'): void;
  (event: 'togglemenu', key:string): void;
}
const Props = withDefaults(
  defineProps<IProps>(),
  { active: "" }
);
watch(
  () => [Props.path],
  () =>  HistoryPath.value.add(JSON.stringify(Props.path.at(-1)))
);
watch(
  () => [Props.active],
  () => active.value = Props.active
)
const active = ref<string>("");
const emit = defineEmits<IEmit>();
const BreadMenu = (MenuEle: string): ISystemMenus =>  JSON.parse(MenuEle);
const HistoryPath = ref<Set<string>>(new Set());
const MenuClick = (item: ISystemMenus) =>  emit('togglemenu', item.key);
const CloseMenu = (item: string) =>  {
  const MenuItem : ISystemMenus = JSON.parse(item);
  const SetArr = [...HistoryPath.value];
  if(HistoryPath.value.size === 1) return;
  const Index = SetArr.findIndex( e =>  BreadMenu(e).key === MenuItem.key );
  const Key = BreadMenu(SetArr[Index]).key
  SetArr.splice(Index,1);
  if(Index >= SetArr.length) {
    active.value = BreadMenu(SetArr[Index - 1]).key;
  }else {
    if(active.value === Key){
      active.value = BreadMenu(SetArr[Index]).key;
    }
  }
  HistoryPath.value = new Set(SetArr);
  emit('togglemenu', active.value);
};

onMounted(() => {
  HistoryPath.value.add(JSON.stringify(Props.path.at(-1)));
  active.value = Props.active;
})
</script>
  
<style lang="scss" scoped>
  .Bread-Nav{ height: 80px; color: #97a8be; }
  .Bread-Nav-Top{ height: 40px; border-bottom: 1px solid $info; line-height: 40px; }
  .Bread-Nav-history{
    box-shadow: 
    0 0 0 #fff ,
    0 0 0 #fff ,
    0 0 0 #fff ,
    2px 2px 4px rgb(161, 161, 161,.5);
    transition: 500ms all ease;
  }
  .Bread-Nav-item{
    border: 1px solid #d8dce5;
    color: #495060;
    transition: 500ms all ease;
    height: 27px;
    line-height: 27px;
  }
  .Bread-Nav-Menu-Select{ background-color: rgb(64,158,255); color: #fff; }
  .Bread-Nav-close { width: 8px; height: 8px; }
  .Bread-Nav-close-btn{
    width: 14px;
    transition: 500ms all ease;
    height: 14px;
    background-color: transparent;
    color: #000;
  }
  .Bread-Nav-close-btn:hover{ background-color: rgba(148, 148, 148, 0.8); color: #fff; }
  @keyframes list {
    0% {
      transform: translateX(-20px);
      opacity: 0;
    }
    100%{
      transform: translateX(0px);
      opacity: 1;
    }
  }
  .Bread-Nav-List{
    animation: list 300ms ease;
    animation-fill-mode: keywords;
  }
</style>