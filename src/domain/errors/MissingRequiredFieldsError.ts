export class MissingRequiredFieldsError extends Error {
  constructor(fields: string[]) {
    super(`Campos obligatorios faltantes: ${fields.join(', ')}`)
    this.name = 'MissingRequiredFieldsError'
  }
}
