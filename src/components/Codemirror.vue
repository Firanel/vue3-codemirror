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
import {
  Compartment,
  StateEffect,
  Extension,
  ChangeSet,
} from '@codemirror/state'
import { EditorView, keymap, ViewUpdate } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { LanguageSupport } from '@codemirror/language'

// eslint-disable-next-line no-undef
const props = defineProps<{
  doc?: string
  captureTab?: boolean
  lang?:() => LanguageSupport
  omitBasicSetup?: boolean
}>()

// eslint-disable-next-line
const emit = defineEmits<{
  (e: 'input', view: EditorView, from: number, to: number, text: string): void
  (e: 'update', update: ViewUpdate): void
  (e: 'update:doc', value: string): void
  (e: 'change', update: ViewUpdate): void
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

watch(() => props.doc, () => {
  if (!view.value) return
  const len = view.value.state.doc.length
  view.value.dispatch({
    changes: ChangeSet.of({
      from: 0,
      to: len,
      insert: props.doc,
    }, len),
  })
})

onMounted(() => {
  const state = EditorState.create({
    doc: props.doc,
    extensions: [
      ...(props.omitBasicSetup ? [] : [basicSetup]),
      captureTab.of(props.captureTab ? keymap.of([indentWithTab]) : []),
      language.of(props.lang === undefined ? [] : props.lang()),
      EditorView.inputHandler.of((view, from, to, text) => {
        emit('input', view, from, to, text)
        return false
      }),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          if (view.value) {
            emit('update:doc', view.value.state.sliceDoc())
          }
          emit('change', update)
        }
        emit('update', update)
      }),
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

function getString (from?: number, to?: number) {
  if (view.value) {
    const len = view.value.state.doc.length
    if (from && from < 0) {
      from = len - from
    }
    if (to && to < 0) {
      to = len - to
    }
    return view.value.state.sliceDoc(from, to)
  }
  return ''
}

// eslint-disable-next-line no-undef
defineExpose({
  view,
  injectExtension,
  getString,
})
</script>
