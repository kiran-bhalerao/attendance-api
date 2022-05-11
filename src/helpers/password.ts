import { randomBytes, scryptSync } from 'crypto'

export function hashPassword(password: string) {
  const salt = randomBytes(8).toString('hex')
  const buffer = scryptSync(password, salt, 64)

  return `${buffer.toString('hex')}.${salt}`
}

export function comparePassword(storedPassword: string, suppliedPassword: string) {
  const [hash, salt] = storedPassword.split('.')

  const buffer = scryptSync(suppliedPassword, salt, 64)
  return buffer.toString('hex') === hash
}
