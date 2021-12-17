<template>
  <div class="codemirror" ref="rootEl" key="editor"/>
</template>

<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import {
  EditorState,
  basicSetup,
} from '@codemirror/basic-setup'
import { Compartment, StateEffect, Extension } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { LanguageSupport } from '@codemirror/language'

// eslint-disable-next-line no-undef
const props = defineProps<{
  doc?: string
  captureTab?: boolean
  lang?:() => LanguageSupport
}>()

const rootEl = ref<HTMLElement>()
const view = ref<EditorView>()

const language = new Compartment()
const captureTab = new Compartment()
const extensions: Extension[] = []

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

onMounted(() => {
  const state = EditorState.create({
    doc: 'console.log("Hello world!")',
    extensions: [
      basicSetup,
      captureTab.of(props.captureTab ? keymap.of([indentWithTab]) : []),
      language.of(props.lang === undefined ? [] : props.lang()),
    ],
  })

  view.value = new EditorView({
    state: state,
    parent: rootEl.value,
  })

  for (const extension of extensions) {
    view.value.dispatch({
      effects: StateEffect.appendConfig.of(extension),
    })
  }
})

onBeforeUnmount(() => {
  if (!view.value) return
  view.value.destroy()
  view.value = undefined
})

//

function injectExtension (extension: Extension, once = false) {
  if (!once) {
    extensions.push(extension)
  }
  if (!view.value) return
  view.value.dispatch({
    effects: StateEffect.appendConfig.of(extension),
  })
}

// eslint-disable-next-line no-undef
defineExpose({
  view,
  injectExtension,
})
</script>
