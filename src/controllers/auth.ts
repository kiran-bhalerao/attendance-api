import { Auth, Controller, CustomError, Get, Post } from '@tsxp/core'
import { Request, Response } from 'express'
import { sign } from 'src/helpers/jwt'
import { comparePassword } from 'src/helpers/password'
import { User } from 'src/models/user'
import { USER } from 'src/types/user'

@Controller('/auth')
export class Authentication {
  @Post('/register')
  async register(
    req: Request<unknown, unknown, { email: string; password: string; userType: USER['userType'] }>,
    res: Response
  ) {
    const { email, password, userType = 'USER' } = req.body

    await User.build({ email, password, userType }).save()

    const token = sign({ email, userType })

    res.send({
      data: {
        token,
        email,
        userType
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
          token,
          email,
          userType
        }
      })
    }

    throw new CustomError('Invalid Credentials')
  }

  @Get('/user')
  @Auth()
  async user(req: Request, res: Response) {
    const user = req.user

    res.send({ user })
  }
}
