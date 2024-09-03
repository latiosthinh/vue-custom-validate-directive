import { getCurrentInstance, type App, type VNode } from 'vue'
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
    const { errors, currentErrorsScope, addError, delError, cleanupErrors } = useErrors()

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

    app.config.globalProperties.$validator = {
      validateAll: () => {
        return new Promise((resolve, reject) => {
          const result = !!currentErrorsScope.value
          resolve({
            isValid: !result
          })
        })
      },
    }

    app.directive('validate', {
      deep: true,
      mounted: (el: HTMLInputElement, binding, vnode: VNode) => {
        const isStringSchema = typeof binding.value === 'string'
        const stringRules = isStringSchema ? binding.value.split(SplitChar) : []
        const schema = isStringSchema
          ? stringRules.map((rule: string) =>
              rule.includes(':') ? rule.split(':') : [rule, true]
            )
          : Object.entries(binding.value)

        // prevent immediate submission
        schema.map(([rule, value]: [string, unknown]) => {
          if (rule !== ValidateTypes.required) return
          value && addError(vnode, ValidateTypes.onMountedRequired)
        })

        const handler = () => {
          delError(vnode, ValidateTypes.onMountedRequired)
          const rules = schema.map((rule: [string, unknown]) => rule[0])

          schema.map(([, value]: [string, unknown]) => {
            const satisfyRequired = validRequired(rules, el, !!value)
            satisfyRequired && delError(vnode, ValidateTypes.required)
            !satisfyRequired && addError(vnode, ValidateTypes.required)

            const satisfyEmail = validEmail(rules, el, value as boolean)
            satisfyEmail && delError(vnode, ValidateTypes.email)
            !satisfyEmail && addError(vnode, ValidateTypes.email)

            const satisfyRegex = validRegex(rules, el, value as RegExp)
            satisfyRegex && delError(vnode, ValidateTypes.regex)
            !satisfyRegex && addError(vnode, ValidateTypes.regex)

            const satisfyLength = validLength(rules, el, value)
            satisfyLength && delError(vnode, ValidateTypes.length)
            !satisfyLength && addError(vnode, ValidateTypes.length)

            if (!satisfyRequired || !satisfyEmail || !satisfyRegex || !satisfyLength) {
              addError(vnode)
            } else {
              delError(vnode)
            }
          })
        }

        el[UniquePropertyID] = handler

        const actions = el.dataset.vvValidateOn?.split(SplitChar)
        actions?.forEach((action) => {
          el.addEventListener(action, () => handler())
        })

        const form = el.closest(`form[${vnode.scopeId}]`) as HTMLFormElement
        form?.addEventListener('submit', (e) => {
          e.preventDefault()
          handler()
        })
      },
      unmounted: (el: HTMLInputElement, _binding, vnode: VNode) => {
        const actions = el.dataset.vvValidateOn?.split(SplitChar)
        actions?.forEach((action) => {
          el.removeEventListener(action, () => el[UniquePropertyID])
        })

        // clear cache handler
        el[UniquePropertyID] = () => {}
        cleanupErrors(vnode)
      },
    })
  }
}
