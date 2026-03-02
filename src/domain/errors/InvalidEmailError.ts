export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`El email no es válido: ${email}`)
    this.name = 'InvalidEmailError'
  }
}
