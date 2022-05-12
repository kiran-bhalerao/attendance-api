import { App } from '@tsxp/core'
import cors from 'cors'
import { json, urlencoded } from 'express'
import { Admin } from 'src/controllers/admin'
import { Authentication } from 'src/controllers/auth'
import { parse } from 'src/helpers/jwt'

export const { app, listen } = new App({
  prefix: '/api',
  middlewares: [json(), urlencoded({ extended: true }), cors()],
  controllers: [Authentication, Admin],
  async context(req) {
    const jwtToken = req.headers['authorization'] as string
    const user = parse(jwtToken)
    return { user }
  }
})
