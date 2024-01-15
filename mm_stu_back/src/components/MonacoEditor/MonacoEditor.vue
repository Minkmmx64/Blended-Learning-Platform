<template>
  <div
    ref="editorContainer"
    class="MonacoEditor"
  />
</template>
  
<script setup lang="ts">
import { ref, toRaw, onMounted } from "vue";
import * as monaco from "monaco-editor";
interface IEmit {
  (event: "update:modelValue", v: string) : void;
}
const emit = defineEmits<IEmit>();
const editorContainer = ref<HTMLElement | null>(null);
const editor = ref<monaco.editor.IStandaloneCodeEditor>();
const editorTheme = ref<string>("vs-dark");
const code = ref<string>("");


onMounted(() => {
  editor.value = monaco.editor.create(editorContainer.value!, {
    value: "",
    theme: editorTheme.value,         // 主题
    language: "json",
    folding: true,                    // 是否折叠
    foldingHighlight: true,           // 折叠等高线
    foldingStrategy: "indentation",   // 折叠方式  auto | indentation
    showFoldingControls: "always",    // 是否一直显示折叠 always | mouseover
    disableLayerHinting: true,        // 等宽优化
    emptySelectionClipboard: false,   // 空选择剪切板
    selectionClipboard: false,        // 选择剪切板
    automaticLayout: true,            // 自动布局
    codeLens: false,                  // 代码镜头
    scrollBeyondLastLine: false,      // 滚动完最后一行后再滚动一屏幕
    colorDecorators: true,            // 颜色装饰器
    accessibilitySupport: "off",      // 辅助功能支持  "auto" | "off" | "on"
    lineNumbers: "off",                // 行号 取值： "on" | "off" | "relative" | "interval" | function
    lineNumbersMinChars: 5,           // 行号最小字符   number
    readOnly: false,                  //是否只读  取值 true | false
    lineDecorationsWidth: 1
  });
  // 监听内容变化
  editor.value.onDidChangeModelContent((e : monaco.editor.IModelContentChangedEvent) => {
    code.value = toRaw(editor.value!).getValue();
    emit('update:modelValue', code.value);
  });
});

</script>

<style lang="scss" scoped>
.MonacoEditor{
    height: 600px;
    border: 1px dashed rgba(124, 124, 124,.8);
    padding: 2px;
  }
</style>