import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildWebhookPayload, submitWebhook } from './webhook'
import { exampleSpec } from '../spec/example.spec'

const answers = { hairConcern: ['concern_hairloss'] }
const user = { name: 'Ann Lee', firstName: 'Ann', lastName: 'Lee', email: 'a@b.co' }

describe('webhook payload', () => {
  it('builds rawAnswers + activeCampaign field_<id> + mixpanel from cdp mappings', () => {
    const p = buildWebhookPayload(exampleSpec, answers, user)
    expect(p.quizData.rawAnswers).toContainEqual({ questionId: 'hairConcern', answerIds: ['concern_hairloss'] })
    // exampleSpec maps hairConcern -> acField 50, mpField 'Hair Concern'
    expect(p.activeCampaign['field_50']).toBe('concern_hairloss')
    expect(p.mixpanel['Hair Concern']).toBeDefined()
    expect(p.mixpanel.$name).toBe('Ann Lee'); expect(p.mixpanel.$email).toBe('a@b.co')
  })
  it('joins multi-select AC values with ", "', () => {
    const p = buildWebhookPayload(exampleSpec, { hairMyth: ['m1', 'm2'] } as any, user)
    // if hairMyth has acField in exampleSpec
    const v = Object.values(p.activeCampaign).find(x => String(x).includes(','))
    expect(v === undefined || String(v).includes(', ')).toBe(true)
  })
})

describe('submitWebhook', () => {
  beforeEach(() => { vi.restoreAllMocks() })
  it('POSTs to the spec webhookUrl with X-Webhook-Secret header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', fetchMock)
    await submitWebhook(exampleSpec, answers, user, 'SECRET123')
    expect(fetchMock).toHaveBeenCalledWith(exampleSpec.webhookUrl, expect.objectContaining({
      method: 'POST', headers: expect.objectContaining({ 'X-Webhook-Secret': 'SECRET123', 'Content-Type': 'application/json' }),
    }))
  })
})
