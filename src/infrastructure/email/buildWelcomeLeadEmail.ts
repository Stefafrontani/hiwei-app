interface WelcomeLeadEmailData {
  recipientName: string
}

export function buildWelcomeLeadEmail(data: WelcomeLeadEmailData): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Bienvenido a Hiwei!</title>
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
              <p style="margin: 8px 0 0; color: #DBD6D1; font-size: 14px;">¡Bienvenido al mundo dashcam!</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 24px 16px;">
              <p style="margin: 0; color: #24211B; font-size: 16px;">¡Hola <strong>${data.recipientName}</strong>!</p>
              <p style="margin: 12px 0 0; color: #24211B; font-size: 15px; line-height: 1.6;">
                Gracias por registrarte en Hiwei. Ya sos parte de nuestra comunidad y queremos darte la bienvenida con algo especial.
              </p>
            </td>
          </tr>

          <!-- Discount Code -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #394493 0%, #2d3670 100%); border-radius: 12px;">
                <tr>
                  <td style="padding: 32px 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #DBD6D1; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px;">Tu código de descuento</p>
                    <div style="display: inline-block; background-color: #FFFFFF; border-radius: 8px; padding: 16px 32px; margin: 8px 0;">
                      <span style="color: #394493; font-size: 28px; font-weight: 800; letter-spacing: 3px;">{nombre_descuento}</span>
                    </div>
                    <p style="margin: 12px 0 0; color: #E5C761; font-size: 14px; font-weight: 600;">Usalo en tu próxima compra</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Benefits reminder -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <p style="margin: 0 0 12px; color: #24211B; font-size: 15px; font-weight: 600;">Como parte de Hiwei tenés acceso a:</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0; color: #24211B; font-size: 14px;">✓ Ofertas exclusivas</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #24211B; font-size: 14px;">✓ Asesoramiento personalizado</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #24211B; font-size: 14px;">✓ Prioridad en nuevos lanzamientos</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; border-top: 1px solid #DBD6D1; text-align: center;">
              <p style="margin: 0; color: #888; font-size: 12px;">Este email fue enviado por Hiwei porque te registraste en nuestra plataforma.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
