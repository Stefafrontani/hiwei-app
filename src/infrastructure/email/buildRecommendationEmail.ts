interface RecommendationEmailData {
  recipientName: string
  productName: string
  matchScore: number
  budgetItems: { label: string; price: number }[]
  budgetTotal: number
  expiresAt: string
}

export function buildRecommendationEmail(data: RecommendationEmailData): string {
  const budgetRows = data.budgetItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #DBD6D1; color: #24211B;">${item.label}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #DBD6D1; color: #24211B; text-align: right;">$${item.price.toLocaleString('es-AR')}</td>
        </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu recomendación Hiwei</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f4; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="background-color: #394493; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700;">Hiwei</h1>
              <p style="margin: 8px 0 0; color: #DBD6D1; font-size: 14px;">Tu recomendación personalizada de dashcam</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 24px 16px;">
              <p style="margin: 0; color: #24211B; font-size: 16px;">¡Hola <strong>${data.recipientName}</strong>!</p>
              <p style="margin: 12px 0 0; color: #24211B; font-size: 15px;">Basándonos en tus respuestas, esta es la dashcam que mejor se adapta a tus necesidades:</p>
            </td>
          </tr>

          <!-- Product Card -->
          <tr>
            <td style="padding: 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f7f6; border-radius: 8px; border: 1px solid #DBD6D1;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <h2 style="margin: 0; color: #394493; font-size: 22px; font-weight: 700;">${data.productName}</h2>
                    <div style="margin: 16px auto; width: 80px; height: 80px; border-radius: 50%; background-color: #394493; display: inline-block; line-height: 80px; text-align: center;">
                      <span style="color: #E5C761; font-size: 24px; font-weight: 700;">${data.matchScore}%</span>
                    </div>
                    <p style="margin: 0; color: #24211B; font-size: 14px;">Coincidencia con tu perfil</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Budget Breakdown -->
          <tr>
            <td style="padding: 24px;">
              <h3 style="margin: 0 0 12px; color: #24211B; font-size: 16px; font-weight: 600;">Presupuesto estimado</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                ${budgetRows}
                <tr>
                  <td style="padding: 12px; color: #394493; font-weight: 700; font-size: 16px;">Total</td>
                  <td style="padding: 12px; color: #394493; font-weight: 700; font-size: 16px; text-align: right;">$${data.budgetTotal.toLocaleString('es-AR')}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Expiration Notice -->
          <tr>
            <td style="padding: 16px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF9E7; border-radius: 8px; border: 1px solid #E5C761;">
                <tr>
                  <td style="padding: 16px; text-align: center;">
                    <p style="margin: 0; color: #92400E; font-size: 13px; font-weight: 600;">⏳ Esta oferta es válida hasta el ${new Date(data.expiresAt).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; border-top: 1px solid #DBD6D1; text-align: center;">
              <p style="margin: 0; color: #888; font-size: 12px;">Este email fue enviado por Hiwei porque solicitaste recibir tu recomendación.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
