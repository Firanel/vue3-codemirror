import { parser } from '@/assets/lezer-lua'

import {
  LanguageSupport,
  LRLanguage,
  indentNodeProp,
  foldNodeProp,
  foldInside,
} from '@codemirror/language'
import { completeFromList } from '@codemirror/autocomplete'
import { styleTags, tags as t } from '@codemirror/highlight'

export const luaLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        Number: t.number,
        LiteralString: t.string,
      }),
      indentNodeProp.add({
        Block: context => context.column(context.node.from) + context.unit,
      }),
      foldNodeProp.add({
        Block: foldInside,
      }),
    ],
  }),
  languageData: {
    commentTokens: {
      line: '--',
    },
  },
})

export const luaAutocomplete = luaLanguage.data.of({
  autocomplete: completeFromList([
    { label: 'local', type: 'keyword' },
  ]),
})

export default function () : LanguageSupport {
  return new LanguageSupport(luaLanguage, [luaAutocomplete])
}
