<template>
  <div class="input hidden mg-5 w-full border-info border-small flex-row flex-center">
    <div class="flex-row flex-center text-center" style="width: 40px; height: 40px;line-height: 40px;">
      <IconFont :icon="Props.icon" />
    </div>
    <input autocomplete="off" maxlength="20" :type="Props.type ?? 'text'" v-model="value" :placeholder="Props.placeholder" class="w-full h-full border-none transparent" />
    <template v-if="Props.showSms">
      <ShowSMSCode />
    </template>
  </div>
</template>
  
<script setup lang="ts">
import { ref,  watch, onMounted } from "vue";
import IconFont from "../icon/IconFont.vue";
import ShowSMSCode from "./ShowSMSCode.vue";
interface IProps {
  placeholder ?: string;
  icon?: string;
  modelValue : any;
  type?: string;
  showSms?: boolean
}
interface IEmits { (event: "update:modelValue", value: any) : void; }

const Props = withDefaults(
  defineProps<IProps>(),
  {
    placeholder: "Please username",
    icon: "user-filling",
    showSms: false
  }
)

const emit = defineEmits<IEmits>();
const value = ref();

watch(
  () => [value.value],
  () => emit("update:modelValue",value.value)
);

onMounted(() =>  value.value = Props.modelValue );

</script>
  
<style lang="scss" scoped>
  .input{
    height: $height-base;
    transition: 200ms all ease;
  }
  .input:has(> input:focus ) {
    border-color: $primary;
  }
</style>