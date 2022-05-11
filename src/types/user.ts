export type User = {
  email: string
  password?: string
  userType: 'ADMIN' | 'USER'
}
