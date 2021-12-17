<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <label><input type="checkbox" v-model="captureTab">Capture tab</label>
  <codemirror
    ref="editor"
    doc=""
    :capture-tab="captureTab"
    :lang="javascript"
  />
</template>

<script setup lang="ts">
import Codemirror from './components/Codemirror.vue'
import { javascript } from '@codemirror/lang-javascript'
import { onMounted, ref } from 'vue'

const captureTab = ref(true)
const editor = ref<Codemirror>()

onMounted(async () => {
  // await nextTick()
  // editor.value.injectExtension(EditorState.tabSize.of(4))
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.codemirror {
  border: 1px solid grey;
}
</style>
