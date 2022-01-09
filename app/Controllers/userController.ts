import { PrismaClient } from '@prisma/client'
import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import * as jwt from 'jsonwebtoken'
import { User, UserManager } from 'App/Managers/User'

export default class UserController {
  private manager: UserManager
  constructor(private client: PrismaClient) {
    this.manager = new UserManager(this.client)
  }

  public async register({ usr, pass, mail }: Omit<User, 'authToken'>) {
    const hashedPassword = await Hash.make(pass)

    const authToken = jwt.sign(
      { username: mail, type: 'permanent-token' },
      Env.get('PERMANENT_TOKEN_SECRET'),
      {
        expiresIn: '100y',
      }
    )

    await this.manager.create({ usr, pass: hashedPassword, mail, authToken })
  }
}
