import jwt from 'jsonwebtoken'
import { USER } from 'src/types/user'

const secretKey = 'jwt-super-secret'

export const parse = (token: string) => {
  try {
    return jwt.verify(token, secretKey) as Omit<Omit<USER, 'password'>, 'name'>
  } catch {
    return undefined
  }
}

export const sign = (user: Omit<Omit<USER, 'password'>, 'name'>) => {
  return jwt.sign(user, secretKey)
}
