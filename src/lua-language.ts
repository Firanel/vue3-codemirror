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
        Comment: t.comment,
        // Chunk: t.comment,
        // Block: t.comment,
        Label: t.labelName,
        Name: t.variableName,
        Number: t.number,
        LiteralString: t.string,
        // FunctionCall: t.name,
        // TableConstructor: t.comment,
        // BinaryExpression: t.comment,
        // CompareOp: t.comment,
        // UnaryExpression: t.comment,
        // FuncBody: t.comment,
        // IfStatement: t.comment,
        // ForStatement: t.comment,
        // ForNumeric: t.comment,
        // ForGeneric: t.comment,
        // NameList: t.comment,
        // ExpList: t.comment,
        FuncName: t.name,
        // VarList: t.comment,
        // AttNameList: t.comment,
        // Attrib: t.comment,
        // ReturnStatement: t.comment,
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
