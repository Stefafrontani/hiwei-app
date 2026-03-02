import { InvalidEmailError } from './InvalidEmailError'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): void {
  if (!EMAIL_REGEX.test(email)) {
    throw new InvalidEmailError(email)
  }
}
