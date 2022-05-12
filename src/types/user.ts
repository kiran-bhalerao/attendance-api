export interface USER {
  name?: string
  email: string
  password: string
  userType: 'ADMIN' | 'USER'
}

declare global {
  namespace Express {
    interface Request {
      user: USER
    }
  }
}
