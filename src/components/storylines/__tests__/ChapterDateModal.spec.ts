import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ChapterDateModal from '@/components/storylines/ChapterDateModal.vue'

describe('ChapterDateModal', () => {
  it('emits submit with start_date when showEnd is false', async () => {
    const w = mount(ChapterDateModal, {
      props: { title: 'Split chapter', showEnd: false },
    })
    await w.find('[data-test="start"]').setValue('2026-04-01')
    await w.find('[data-test="save"]').trigger('click')
    expect(w.emitted('submit')?.[0]).toEqual([{ start_date: '2026-04-01' }])
  })
  it('includes end_date when showEnd is true', async () => {
    const w = mount(ChapterDateModal, {
      props: { title: 'Edit', showEnd: true },
    })
    await w.find('[data-test="start"]').setValue('2026-04-01')
    await w.find('[data-test="end"]').setValue('2026-06-30')
    await w.find('[data-test="save"]').trigger('click')
    expect(w.emitted('submit')?.[0]).toEqual([
      { start_date: '2026-04-01', end_date: '2026-06-30' },
    ])
  })
})
