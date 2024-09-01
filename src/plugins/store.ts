import { ref } from 'vue'

const errors = ref<Set<string>>(new Set())
const ConditionSplitChar = ':'

export const useErrors = () => {
  const addError = (el: HTMLInputElement, rule: string = '') => {
    const errorValue = rule ? `${el.name}${ConditionSplitChar}${rule}` : `${el.name}`
    errors.value.add(errorValue)
  }

  const delError = (el: HTMLInputElement, rule: string = '') => {
    const errorValue = rule ? `${el.name}${ConditionSplitChar}${rule}` : `${el.name}`
    errors.value.delete(errorValue)
  }

  const cleanupErrors = () => {
    errors.value.clear()
  }

  return { errors, addError, delError, cleanupErrors }
}
