<template>
  <div>
    <div class="codemirror" ref="rootEl" key="editor"/>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'
import {
  EditorState,
  basicSetup,
} from '@codemirror/basic-setup'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import lua from '@/lua-language'

// eslint-disable-next-line no-undef
const props = defineProps<{
  doc?: string
  captureTab?: boolean
  lang?: 'js' | 'lua'
}>()

const rootEl = ref<HTMLElement>()
const view = ref<EditorView>()

onMounted(() => {
  const extensions = [basicSetup]

  if (props.captureTab) {
    extensions.push(keymap.of([indentWithTab]))
  }

  switch (props.lang) {
    case 'lua':
      extensions.push(lua())
      break
    default:
      extensions.push(javascript())
      break
  }

  const state = EditorState.create({
    doc: 'console.log("Hello world!")',
    extensions,
  })

  view.value = new EditorView({
    state: state,
    parent: rootEl.value,
  })
})
</script>
