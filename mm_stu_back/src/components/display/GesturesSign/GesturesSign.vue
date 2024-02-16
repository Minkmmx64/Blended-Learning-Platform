<template>
  <!-- 手势密码 -->
  <div class="gesture border-info">
    <div class="gesture-title select-none w-full flex-row flex-center">
      <span v-if="error" style="color: #f56c6c;">请重置,至少4个点!!</span>
      <span v-else>请滑动</span> 
    </div>
    <div class="gesture-content relative w-full flex-row select-none" ref="Gesture">
      <canvas ref="GestureCanvas" width="300" height="300" v-show="showCanvas" class="absolute" style="background-color: transparent; z-index: 9999;" />
      <div 
        class="gesture-cell relative flex-row flex-center" 
        v-for="(item, index) in 9" 
        :key="index"
        :data-name="item" 
        @mousedown="e => mousedown(e, item)"
      >
        <div class="gesture-cell-ch absolute"></div>
      </div>
    </div>
    <div class="flex-row flex-center mt-20">
      <ElButton @click="reset">重置</ElButton>
      <ElButton :type="'success'" @click="submit">确定</ElButton>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { Point, IcanvasEngine, canvasEngine } from "./canvas";

interface Emit {
  (event: "ok", value: number[]) : void;
}

const emit = defineEmits<Emit>();

const Gesture = ref<HTMLDivElement | null>(null);
const GestureCanvas = ref<HTMLCanvasElement | null>(null);
const showCanvas = ref(false);
const LocationsMap = new Map<number, { node: HTMLDivElement, Point: Point}>();
const LineHashMap = new Map<number, boolean>();
let useCanvasEngine: IcanvasEngine = null;
let ctx: CanvasRenderingContext2D = null;
let start: Point = null;
const result = ref([]);
const error = ref(false);

const reset = () => {
  showCanvas.value = false;
  [...LocationsMap].map( ([ key ]) => { if(LineHashMap.get(key)) {
    changeStyle(key, ["gesture-cell-ch-error", "gesture-cell-ch-active"], true);
  } })
  LineHashMap.clear();
  useCanvasEngine.clear();
  useCanvasEngine.initConfig();
  result.value = [];
  error.value = false;
}

//曼哈顿距离
const ManhattanDIst = (start: Point, end: Point) => {
  return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

const submit = () => {
  if(result.value.length < 4) return;
  emit("ok", result.value);
}

/**
 * 鼠标移开手势设置完成
 * @param e 鼠标事件
 */
const mouseup = (e: MouseEvent) => {
  useCanvasEngine.loop();
  if(result.value.length < 4) {
    useCanvasEngine.setConfig("#f56c6c");
    useCanvasEngine.loop();
    LineHashMap.forEach( (_, key) => {
      changeStyle(key, ["gesture-cell-ch-error"])
    });
    error.value = true;
  }
  window.removeEventListener("mouseup", mouseup);
  Gesture.value.removeEventListener("mousemove", mousemove);
}

// 直线映射
const Kmap = new Map<number, number[]>(
  [
    [1, [ 3,7,9 ]],
    [2, [ 8 ]],
    [3, [ 9, 7 ]],
    [4, [6]],
    [7, [ 9 ]],
  ]
)

const changeStyle = (index: number, style: string[], remove?: boolean) => {
  const u = [...LocationsMap].find( ([ id ]) => id === index)[1].node;
  if(remove) 
    style.map(s => u.querySelector(".gesture-cell-ch").classList.remove(s));
  else
    style.map(s => u.querySelector(".gesture-cell-ch").classList.add(s));
}

/**
 * 鼠标移动展示线条
 * @param e 鼠标事件
 */
const mousemove = (e: MouseEvent) => {
  //console.log(e);
  
  const nextLocation: Point = {
    x: e.offsetX,
    y: e.offsetY
  }
  
  useCanvasEngine.loop();

  useCanvasEngine.drawLine(start, nextLocation);

  // 判断当前坐标离某个按钮是否接近
  LocationsMap.forEach(({ Point, node }, key) => {
    if(ManhattanDIst(Point, nextLocation) <= 20 && !LineHashMap.get(key)) {
      /**
       * 判断上一条线和当前按钮中间是否有未接触的按钮
       */
      let id = [...LocationsMap].find( ([, { Point }]) => Point.x == start.x && Point.y == start.y)[0];
      //如果2点是一条线
      if(Kmap.get(Math.min(id, key)) && Kmap.get(Math.min(id, key)).includes(Math.max(id, key))) {
        // 中间的按钮
        const center = Math.abs(id - key) / 2 + Math.min(id, key);
        if(!LineHashMap.get(center)) {
          result.value.push(center);
          LineHashMap.set(center, true);
          changeStyle(center, ["gesture-cell-ch-active"]);
        }
      }
      result.value.push(key)
      let location = start;
      useCanvasEngine.setTast(() => { useCanvasEngine.drawLine(location, Point) });
      start = Point;
      LineHashMap.set(key, true);
      changeStyle(key, ["gesture-cell-ch-active"]);
    }
  });
}
/**
 * 按下第一个按钮开始记录手势
 * @param e 鼠标事件
 */
const mousedown = (e: MouseEvent, elementIndex: number) => {

  changeStyle(elementIndex, ["gesture-cell-ch-active"]);

  result.value.push(elementIndex);

  LineHashMap.set(elementIndex, true);

  showCanvas.value = true;

  start = LocationsMap.get(elementIndex).Point;

  ctx = GestureCanvas.value.getContext("2d");

  useCanvasEngine = canvasEngine(ctx);

  window.addEventListener("mouseup", mouseup);
  Gesture.value.addEventListener("mousemove", mousemove);
}

/**
 * 获取每个按钮中心坐标
 */
const getLocation = () => {
  if(!Gesture.value) return;
  const cells = Gesture.value.querySelectorAll(".gesture-cell");
  [...cells].forEach( (element : HTMLDivElement) => {
    /**
    * 将按钮中心映射成canvas坐标
    */
    //console.log({ x: element.offsetLeft + 35, y: element.offsetTop + 35});
    LocationsMap.set(parseInt(element.dataset.name), { node: element, Point: { x: element.offsetLeft + 35, y: element.offsetTop + 35}});
  });
}

nextTick(() => {
  getLocation();
})

onMounted(() => {
  getLocation();
});
</script>
  
<style lang="scss" scoped>
  .gesture {
    width: 350px;
    height: 475px;
    .gesture-title {
      height: 60px;
      border-bottom: 1px solid #007aff
    }
    .gesture-content{
      margin: 0 auto;
      margin-top: 25px;
      width: 300px;
      height: 300px;
      justify-content: space-around;
      align-content: space-around;
      flex-wrap: wrap;
      gap: 45px;
    }
    .gesture-cell{
      color: $danger;
      box-sizing: border-box;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      border: 4px solid #007aff;
      font-weight: bolder;
      font-size: 18px;
      z-index: 100;
      cursor: pointer;
      .gesture-cell-ch {
        z-index: 10;
        width: 0px;
        height: 0px;
        border-radius: 50%;
        background-color: $success;
        transform-origin: center;
        transition: 200ms;
      }
      .gesture-cell-ch-success {
        background-color: $success;
      }
      .gesture-cell-ch-active {
        width: 66px;
        height: 66px;
        opacity: 0.1;
      }
      &:active .gesture-cell-ch{
        width: 66px;
        height: 66px;
        opacity: 0.1;
      }
      .gesture-cell-ch-error {
        background-color: $danger;
        opacity: 0.2;
      }
    }
  }
</style>