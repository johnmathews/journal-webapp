import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStorylinesStore } from '@/stores/storylines'
import * as api from '@/api/storylines'

vi.mock('@/api/storylines', () => ({
  fetchStorylines: vi.fn(),
  fetchStoryline: vi.fn(),
  createStoryline: vi.fn(),
  regenerateStoryline: vi.fn(),
  deleteStoryline: vi.fn(),
  setStorylineAnchors: vi.fn(),
  updateStoryline: vi.fn(),
  fetchStorylineChapter: vi.fn(),
  regenerateStorylineChapter: vi.fn(),
  renameStorylineChapter: vi.fn(),
  addChapter: vi.fn(),
  splitChapter: vi.fn(),
  mergeChapters: vi.fn(),
  updateChapterWindow: vi.fn(),
  deleteChapter: vi.fn(),
}))

describe('storylines store — chapter editing', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('addChapter calls api and reloads the storyline', async () => {
    vi.mocked(api.addChapter).mockResolvedValue({
      chapter: { id: 9 } as never,
      job_ids: ['j1'],
    })
    vi.mocked(api.fetchStoryline).mockResolvedValue({
      id: 1,
      chapters: [],
    } as never)
    const store = useStorylinesStore()
    const resp = await store.addChapter(1, { start_date: '2026-04-01' })
    expect(api.addChapter).toHaveBeenCalledWith(1, { start_date: '2026-04-01' })
    expect(api.fetchStoryline).toHaveBeenCalledWith(1)
    expect(resp.job_ids).toEqual(['j1'])
  })

  it('splitChapter calls api with {date} and reloads', async () => {
    vi.mocked(api.splitChapter).mockResolvedValue({
      chapters: [],
      job_ids: ['a', 'b'],
    } as never)
    vi.mocked(api.fetchStoryline).mockResolvedValue({
      id: 1,
      chapters: [],
    } as never)
    const store = useStorylinesStore()
    await store.splitChapter(1, 5, '2026-04-01')
    expect(api.splitChapter).toHaveBeenCalledWith(1, 5, { date: '2026-04-01' })
    expect(api.fetchStoryline).toHaveBeenCalledWith(1)
  })

  it('mergeChapters calls api with chapter_ids and reloads', async () => {
    vi.mocked(api.mergeChapters).mockResolvedValue({
      chapter: { id: 1 } as never,
      job_ids: [],
    })
    vi.mocked(api.fetchStoryline).mockResolvedValue({
      id: 1,
      chapters: [],
    } as never)
    const store = useStorylinesStore()
    await store.mergeChapters(1, [2, 3])
    expect(api.mergeChapters).toHaveBeenCalledWith(1, { chapter_ids: [2, 3] })
    expect(api.fetchStoryline).toHaveBeenCalledWith(1)
  })

  it('updateChapterDates calls api and reloads', async () => {
    vi.mocked(api.updateChapterWindow).mockResolvedValue({
      chapters: [],
      job_ids: [],
    } as never)
    vi.mocked(api.fetchStoryline).mockResolvedValue({
      id: 1,
      chapters: [],
    } as never)
    const store = useStorylinesStore()
    await store.updateChapterDates(1, 5, { start_date: '2026-05-01' })
    expect(api.updateChapterWindow).toHaveBeenCalledWith(1, 5, {
      start_date: '2026-05-01',
    })
    expect(api.fetchStoryline).toHaveBeenCalledWith(1)
  })

  it('deleteChapter calls api with allow_gap and reloads', async () => {
    vi.mocked(api.deleteChapter).mockResolvedValue({
      deleted: true,
      job_ids: [],
    })
    vi.mocked(api.fetchStoryline).mockResolvedValue({
      id: 1,
      chapters: [],
    } as never)
    const store = useStorylinesStore()
    await store.deleteChapter(1, 5, true)
    expect(api.deleteChapter).toHaveBeenCalledWith(1, 5, { allow_gap: true })
    expect(api.fetchStoryline).toHaveBeenCalledWith(1)
  })
})
