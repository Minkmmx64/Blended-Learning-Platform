<template>
  <div
    ref="inp"
    class="input hidden mg-5 w-full border-info border-small flex-row flex-center"
  >
    <div
      class="flex-row flex-center text-center"
      style="width: 40px; height: 40px;line-height: 40px;"
    >
      <IconFont
        class="mg-2"
        style="width: 40px;"
        :icon="Props.icon"
      />
    </div>
    <form class="w-full h-full border-none transparent">
      <input
        v-model="value"
        autocomplete="off"
        maxlength="20" 
        :type="Props.type ?? 'text'" 
        :placeholder="Props.placeholder" 
        class="w-full h-full border-none transparent" 
        @blur="blur" 
        @focus="focus"
      >
    </form>
    <slot />
  </div>
</template>
  
<script setup lang="ts">
import { ref,  watch, onMounted } from "vue";
import IconFont from "../icon/IconFont.vue";
import { ElMessage } from "element-plus";
import { CustomRegex } from "@/components/User/LoginLayout.type";

interface IProps {
  placeholder ?: string;
  icon?: string;
  modelValue : any;
  type?: string;
  regex?: CustomRegex;
}
interface IEmits { (event: "update:modelValue", value: any) : void; }

const Props = withDefaults(
  defineProps<IProps>(),
  {
    placeholder: "Please username",
    icon: "user-filling",
  }
)
const inp = ref<HTMLDivElement | null>(null);
const emit = defineEmits<IEmits>();
const value = ref();
const focus = () => {
  inp!.value!.style.borderColor = "#2563EB";
}
const blur = () => {
  inp!.value!.style.borderColor = "rgb(175 187 204 / 15%)";
  if(Props.regex){
    if(!Props.regex.rule.test(value.value)) {
      inp!.value!.style.borderColor = "#f56c6c";
      inp!.value!.querySelector("input")!.value = "";
      inp!.value!.querySelector("input")!.placeholder = Props.regex.msg;
      inp!.value!.querySelector("input")!.classList.add("regex_err");
    } else {
      inp!.value!.style.borderColor = "#34D399";
      inp!.value!.querySelector("input")!.classList.remove("regex_err");
    }
  }
}

watch(
  () => [value.value],
  () => {
    emit("update:modelValue",value.value)
  }
);

onMounted(() =>  value.value = Props.modelValue );

</script>
  
<style lang="scss" scoped>
  .input{
    height: $height-base;
    transition: 200ms all ease;
  }
  .regex_err::-webkit-input-placeholder {
    color: $danger;
  }
</style>