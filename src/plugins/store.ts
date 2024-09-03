import { ref, type VNode } from 'vue'

type ErrorObject = {
  scopeID: string
  fields: string[]
} 

const errors = ref<Set<string>>(new Set())
const currentErrorsScope = ref<ErrorObject | null>(null)
const ConditionSplitChar = ':'

export const useErrors = () => {
  const addError = (vnode: VNode, rule: string = '') => {
    const errorValue = rule ? `${vnode.props?.name}${ConditionSplitChar}${rule}` : `${vnode.props?.name}`
    errors.value.add(errorValue)
    currentErrorsScope.value = {
      scopeID: vnode.scopeId || '',
      fields: [...currentErrorsScope.value?.fields || [], vnode.props?.name || '']
    }
  }

  const delError = (vnode: VNode, rule: string = '') => {
    const errorValue = rule ? `${vnode.props?.name}${ConditionSplitChar}${rule}` : `${vnode.props?.name}`
    errors.value.delete(errorValue)
    if (!currentErrorsScope.value?.fields.length) {
      currentErrorsScope.value = null
      return;
    }

    currentErrorsScope.value?.fields.splice(currentErrorsScope.value.fields.indexOf(vnode.props?.name || ''), 1)
  }

  const cleanupErrors = (vnode: VNode) => {
    currentErrorsScope.value = null
    errors.value.forEach(() => {
      delError(vnode)
    })
  }

  return { errors, currentErrorsScope, addError, delError, cleanupErrors }
}
