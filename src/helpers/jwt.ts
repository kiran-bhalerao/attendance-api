import jwt from 'jsonwebtoken'
import { User } from 'src/types/user'

const secretKey = 'jwt-super-secret'

export const parse = (token: string) => {
  try {
    return jwt.verify(token, secretKey) as Omit<User, 'password'>
  } catch {
    return undefined
  }
}

export const sign = (user: Omit<User, 'password'>) => {
  return jwt.sign(user, secretKey)
}
