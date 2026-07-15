import type { QuizSpec } from '../spec/types'
import type { AnswerState } from '../engine/answers'

export interface WebhookUser { name: string; firstName: string; lastName: string; email: string }
export interface WebhookPayload {
  name: string; firstName: string; lastName: string; email: string
  quizData: { rawAnswers: Array<{ questionId: string; answerIds: string[] }> }
  activeCampaign: Record<string, string>
  mixpanel: Record<string, unknown>
}

export function buildWebhookPayload(spec: QuizSpec, answers: AnswerState, user: WebhookUser): WebhookPayload {
  const rawAnswers = Object.entries(answers).map(([questionId, answerIds]) => ({ questionId, answerIds }))
  const activeCampaign: Record<string, string> = {}
  const mixpanel: Record<string, unknown> = { $name: user.name, $email: user.email }
  for (const s of spec.screens) {
    if (s.kind !== 'question' || !s.cdp) continue
    const picked = answers[s.questionId]; if (!picked) continue
    if (s.cdp.acField) activeCampaign[`field_${s.cdp.acField}`] = picked.join(', ')
    if (s.cdp.mpField) mixpanel[s.cdp.mpField] = picked.length > 1 ? picked : picked[0]
  }
  return { name: user.name, firstName: user.firstName, lastName: user.lastName, email: user.email, quizData: { rawAnswers }, activeCampaign, mixpanel }
}

export async function submitWebhook(spec: QuizSpec, answers: AnswerState, user: WebhookUser, secret: string): Promise<boolean> {
  try {
    const res = await fetch(spec.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': secret },
      body: JSON.stringify(buildWebhookPayload(spec, answers, user)),
    })
    return (res as Response).ok
  } catch { return false }
}
