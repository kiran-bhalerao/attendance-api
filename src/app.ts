import { App } from '@tsxp/core'
import { json, urlencoded } from 'express'
import { Admin } from 'src/controllers/admin'
import { Auth } from 'src/controllers/auth'
import { parse } from 'src/helpers/jwt'

export const { app, listen } = new App({
  prefix: '/api',
  middlewares: [json(), urlencoded({ extended: true })],
  controllers: [Auth, Admin],
  async context(req) {
    const jwtToken = req.headers['authorization'] as string
    const user = parse(jwtToken)
    return { user }
  }
})
