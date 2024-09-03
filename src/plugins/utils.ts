import { email, minLength, maxLength, required } from '@vuelidate/validators'
import ValidateTypes from './validate-type'

export const validRequired = (rules: string[], el: HTMLInputElement, shouldValidate: boolean) => {
  if (!rules.includes(ValidateTypes.required)) return true
  if (rules.includes(ValidateTypes.required) && !shouldValidate) return true
  return rules.includes(ValidateTypes.required) && required.$validator(el.value, null, null)
}

export const validEmail = (rules: string[], el: HTMLInputElement, shouldValidate: boolean) => {
  if (!rules.includes(ValidateTypes.email)) return true
  if (rules.includes(ValidateTypes.email) && !shouldValidate) return true
  return rules.includes(ValidateTypes.email) && email.$validator(el.value, null, null)
}

export const validRegex = (rules: string[], el: HTMLInputElement, regex: RegExp) => {
  if (!rules.includes(ValidateTypes.regex)) return true
  if (rules.includes(ValidateTypes.regex) && !regex) return true
  return rules.includes(ValidateTypes.regex) && el.value.match(regex)
}

export const validLength = (rules: string[], el: HTMLInputElement, value: unknown) => {
  if (!rules.includes(ValidateTypes.length)) return true
  if (rules.includes(ValidateTypes.length) && !value) return true
  return rules.includes(ValidateTypes.length) && el.value.length === parseInt(value as string)
}

export const validMinLength = (rules: string[], el: HTMLInputElement, value: unknown) => {
  if (!rules.includes(ValidateTypes.minLength)) return true
  if (rules.includes(ValidateTypes.minLength) && !value) return true
  return (
    rules.includes(ValidateTypes.minLength) &&
    minLength(value as number).$validator(el.value, null, null)
  )
}

export const validMaxLength = (rules: string[], el: HTMLInputElement, value: unknown) => {
  if (!rules.includes(ValidateTypes.maxLength)) return true
  if (rules.includes(ValidateTypes.maxLength) && !value) return true
  return (
    rules.includes(ValidateTypes.maxLength) &&
    maxLength(value as number).$validator(el.value, null, null)
  )
}
