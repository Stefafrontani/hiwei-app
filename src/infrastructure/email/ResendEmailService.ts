import { Resend } from 'resend'
import type { IEmailService, EmailPayload } from '@/domain/ports/IEmailService'

export class ResendEmailService implements IEmailService {
  private readonly client: Resend

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('Missing RESEND_API_KEY env var')
    this.client = new Resend(apiKey)
  }

  async send(payload: EmailPayload): Promise<void> {
    const { error } = await this.client.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Hiwei <onboarding@resend.dev>',
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    })
    if (error) throw new Error(`Email send failed: ${error.message}`)
  }
}
