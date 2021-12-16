<template>
  <div>
    <div class="codemirror" ref="rootEl" key="editor"/>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
  watch,
} from 'vue'
import {
  EditorState,
  basicSetup,
} from '@codemirror/basic-setup'
import { Compartment } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { LanguageSupport } from '@codemirror/language'

// eslint-disable-next-line no-undef
const props = defineProps<{
  doc?: string
  tabSize?: number
  captureTab?: boolean
  lang?:() => LanguageSupport
}>()

const rootEl = ref<HTMLElement>()
const view = ref<EditorView>()

const language = new Compartment()
const tabSize = new Compartment()
const captureTab = new Compartment()

watch(() => props.captureTab, () => {
  if (!view.value) return
  view.value.dispatch({
    effects: captureTab
      .reconfigure(props.captureTab ? keymap.of([indentWithTab]) : []),
  })
})

watch(() => props.lang, () => {
  if (!view.value) return
  view.value.dispatch({
    effects: language
      .reconfigure(props.lang === undefined ? [] : props.lang()),
  })
})

watch(() => props.tabSize, () => {
  if (!view.value) return
  view.value.dispatch({
    effects: tabSize.reconfigure(EditorState.tabSize.of(props.tabSize || 2)),
  })
})

onMounted(() => {
  const extensions = [
    basicSetup,
    captureTab.of(props.captureTab ? keymap.of([indentWithTab]) : []),
    language.of(props.lang === undefined ? [] : props.lang()),
    tabSize.of(EditorState.tabSize.of(props.tabSize || 2)),
  ]

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
