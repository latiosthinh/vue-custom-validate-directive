import { describe, it, expect } from 'vitest'
import fs from 'fs';

const files = [
  'src/App.vue',
  'src/router/index.ts',
  'src/main.ts'
]

const regexConditions = [
  {
    regex: /\w+ventBus/,
    message: "script not contains eventBus/globalEventBus"
  },
  {
    regex: /\$emit/,
    message: "script not contains Vue2 \"$emit\""
  },
  {
    regex: /\$refs/,
    message: "script not contains \"$refs\""
  },
  {
    regex: /this\.\w+?/,
    message: "script not contains this.(some_function)"
  },
  {
    regex: /self\.(?!resource)/,
    message: "script not contains self.(some_function)"
  },
  {
    match: "and",
    regex: "self\.",
    regex2: /globalProperties/,
    message: "script contains define \"self\" with \"globalProperties\""
  },
  {
    regex: /self(\s?)\=(\s?)this/,
    message: "script not contains \"self = this\""
  },
  {
    regex: /v\-bind/,
    message: "template not contains \"v-bind\""
  },
  {
    regex: /v\-on/,
    message: "template not contains \"v-on\""
  }
]

files.forEach(file => {
  const fileContent = fs.readFileSync(file, 'utf8');
  describe(file, () => {
    regexConditions.map(condition => {
      if (condition.match === "and" && fileContent.includes(condition.regex)) {
        it(condition.message, () => {
          expect(fileContent).toMatch(condition.regex2);
        })
        return
      };
  
      it(condition.message, () => {
        expect(fileContent).not.toMatch(condition.regex);
      })
    })
  })
});