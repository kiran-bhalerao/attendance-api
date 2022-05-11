import { Controller, Post } from '@tsxp/core'
import { Request, Response } from 'express'
import { sign } from 'src/helpers/jwt'
import { User } from 'src/types/user'

@Controller('/auth')
export class Auth {
  @Post('/register')
  async register(
    req: Request<unknown, unknown, { email: string; password: string; userType: User['userType'] }>,
    res: Response
  ) {
    const { email, password, userType } = req.body

    // create user in db

    const token = sign({ email, userType })

    res.send({
      data: {
        token
      }
    })
  }

  @Post('/login')
  async login(req: Request<unknown, unknown, { email: string; password: string }>, res: Response) {
    const { email, password } = req.body

    // verify user from db
    // get userType
    const userType = 'ADMIN'
    const token = sign({ email, userType })

    res.send({
      data: {
        token
      }
    })
  }
}
