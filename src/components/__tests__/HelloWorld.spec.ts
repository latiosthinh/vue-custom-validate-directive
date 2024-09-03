import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Form1 from '@/components/Form1.vue'

describe('Form1', () => {
  it('renders properly', () => {
    const wrapper = mount(Form1, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
