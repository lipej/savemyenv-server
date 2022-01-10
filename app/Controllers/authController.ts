import { PrismaClient } from '@prisma/client'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import * as jwt from 'jsonwebtoken'
import { ModifiedBody } from 'App/Middleware/Auth'
import { UserLoader } from 'App/Loaders/User'

export type User = {
  usr: string
  pass: string
  mail: string
}

export type UserLogin = Omit<User, 'mail'>

type AuthCtx = {
  request: RequestContract
  response: ResponseContract
}

export default class AuthController {
  private loader: UserLoader

  constructor(private client: PrismaClient) {
    this.loader = new UserLoader(this.client)
  }

  public async login(data: UserLogin, response: ResponseContract) {
    const user = await this.loader.load(data.usr)

    if (!user || !(await Hash.verify(user?.password, data.pass))) {
      response.unauthorized({ message: 'Error: Invalid username or password' })
    } else {
      const token = jwt.sign({ id: user.id }, Env.get('APPLICATION_SECRET_KEY'), {
        expiresIn: '30d',
      })

      response.send({ authToken: token })
    }
  }

  public async verifyToken({ response, request }: AuthCtx) {
    const body = request.body() as ModifiedBody

    const user = await this.loader.loadById(body.userId)

    if (!user) response.unauthorized({ message: 'Error: Invalid token' })

    response.json({ subscription: user?.subscription, dbSecret: user?.authToken })
  }
}
