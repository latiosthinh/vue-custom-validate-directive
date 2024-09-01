import { type App } from 'vue'
import { useErrors } from './store'
import { validEmail, validLength, validRegex, validRequired } from './utils'
import ValidateTypes from './validate-type'

export const PhoneNumberRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]*$/g
const SplitChar = '|'
const UniquePropertyID = '__vuelidateHandler__'

declare global {
  interface Window {
    vuelidateErrors: Set<string>
  }

  interface HTMLInputElement {
    __vuelidateHandler__: (el: HTMLInputElement) => void
  }
}

export default {
  install: (app: App) => {
    const { addError, delError, cleanupErrors } = useErrors()

    app.config.globalProperties.$formMaxLength = {
      email: 64,
      firstName: 64,
      lastName: 64,
      line1: 80,
      line2: 80,
      city: 64,
      company: 50,
      postalCode: 20,
      paymentAddress: 60,
      paymentCity: 40,
      password: 128
    }

    app.directive('validate', {
      deep: true,
      mounted: (el: HTMLInputElement, binding) => {
        const isStringSchema = binding.value instanceof String
        const schema = isStringSchema
          ? binding.value.split(SplitChar).map((rule: string) => {
              rule.includes(':') ? rule.split(':') : [rule, true]
            })
          : Object.entries(binding.value)

        binding.value.split(SplitChar).map((rule: string) => {
          rule.includes(':') ? console.log(rule.split(':')) : console.log([rule, true])
        })

        console.log(schema)

        const actions = el.dataset.vvValidateOn?.split(SplitChar)
        const bubble = binding.modifiers?.bubble

        // prevent immediate submission
        schema.map(([rule, value]: [string, unknown]) => {
          if (rule !== ValidateTypes.required) return
          value && addError(el, ValidateTypes.firstMountedRequired)
        })

        const handler = (el: HTMLInputElement) => {
          delError(el, ValidateTypes.firstMountedRequired)
          const rules = schema.map((rule: [string, unknown]) => rule[0])

          bubble && binding.value(el)

          schema.map(([, value]: [string, unknown]) => {
            const satisfyRequired = validRequired(rules, el, !!value)
            satisfyRequired && delError(el, ValidateTypes.required)
            !satisfyRequired && addError(el, ValidateTypes.required)

            const satisfyEmail = validEmail(rules, el, value as boolean)
            satisfyEmail && delError(el, ValidateTypes.email)
            !satisfyEmail && addError(el, ValidateTypes.email)

            const satisfyRegex = validRegex(rules, el, value as RegExp)
            satisfyRegex && delError(el, ValidateTypes.regex)
            !satisfyRegex && addError(el, ValidateTypes.regex)

            const satisfyLength = validLength(rules, el, value)
            console.log(value)
            satisfyLength && delError(el, ValidateTypes.length)
            !satisfyLength && addError(el, ValidateTypes.length)

            if (!satisfyRequired || !satisfyEmail || !satisfyRegex || !satisfyLength) {
              addError(el)
            } else {
              delError(el)
            }
          })
        }

        el[UniquePropertyID] = handler

        actions?.forEach((action) => {
          el.addEventListener(action, () => handler(el))
        })

        const form = el.closest('form') as HTMLFormElement
        if (![...form.elements].includes(el)) return

        form?.addEventListener('submit', (e) => {
          e.preventDefault()
          handler(el)
        })
      },
      unmounted: (el: HTMLInputElement) => {
        const actions = el.dataset.vvValidateOn?.split(SplitChar)
        actions?.forEach((action) => {
          el.removeEventListener(action, () => el[UniquePropertyID])
        })

        // clear cache handler
        el[UniquePropertyID] = () => {}
        cleanupErrors()
      }
    })
  }
}
