<template>
  <div> {{ moment(Props.date).format("YYYY-MM-DD") }} </div>
</template>
  
<script setup lang="ts">

import moment from "moment";
interface IProps {
  date: string;
}

const Props = withDefaults(
  defineProps<IProps>(),
  {
    date: "2023-12-01T05:55:56.744Z"
  }
)
</script>
  
<style lang="scss" scoped>
  
</style>