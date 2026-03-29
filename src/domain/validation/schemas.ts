import { z } from 'zod'

const NAME_MAX = 60
const EMAIL_MAX = 100
const PHONE_MAX = 25

export const nameSchema = z
  .string()
  .min(1, 'El nombre es obligatorio')
  .max(NAME_MAX, `Máximo ${NAME_MAX} caracteres`)
  .regex(
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
    'Solo se permiten letras y espacios'
  )

export const emailSchema = z
  .string()
  .min(1, 'El email es obligatorio')
  .max(EMAIL_MAX, `Máximo ${EMAIL_MAX} caracteres`)
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Ingresá un email válido')

export const phoneSchema = z
  .string()
  .max(PHONE_MAX, `Máximo ${PHONE_MAX} caracteres`)
  .regex(/^[0-9+\-\s]*$/, 'Solo números, + y -')
  .optional()
  .or(z.literal(''))

export const leadFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
})

const QUERY_MAX = 500

export const contactFormSchema = leadFormSchema.extend({
  query: z
    .string()
    .min(1, 'La consulta es obligatoria')
    .max(QUERY_MAX, `Máximo ${QUERY_MAX} caracteres`),
  optInMarketing: z.boolean(),
})

export const sendRecommendationFormSchema = leadFormSchema.extend({
  optInMarketing: z.boolean(),
})

export type LeadFormValues = z.infer<typeof leadFormSchema>
export type ContactFormValues = z.infer<typeof contactFormSchema>
export type SendRecommendationFormValues = z.infer<
  typeof sendRecommendationFormSchema
>
