import { Controller, CustomError, Post } from '@tsxp/core'
import { Request, Response } from 'express'
import { sign } from 'src/helpers/jwt'
import { comparePassword } from 'src/helpers/password'
import { User } from 'src/models/user'
import { USER } from 'src/types/user'

@Controller('/auth')
export class Auth {
  @Post('/register')
  async register(
    req: Request<unknown, unknown, { email: string; password: string; userType: USER['userType'] }>,
    res: Response
  ) {
    const { email, password, userType } = req.body

    await User.build({ email, password, userType }).save()

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

    const user = await User.findOne({ email })
    if (user && comparePassword(user.password, password)) {
      const { userType } = user
      const token = sign({ email, userType })

      return res.send({
        data: {
          token
        }
      })
    }

    throw new CustomError('Invalid Credentials')
  }
}
