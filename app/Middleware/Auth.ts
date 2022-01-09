import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { PrismaClient } from '@prisma/client'
import * as jwt from 'jsonwebtoken'

export type ModifiedBody = { userId: string }

export default class Auth {
  private client: PrismaClient

  constructor() {
    this.client = new PrismaClient()
  }

  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const token = <string>request.header('Authorization')?.replace('Bearer ', '')
    const decodedToken = jwt.verify(token, Env.get('APPLICATION_SECRET_KEY')) as { id: string }
    const user = await this.client.user.findUnique({ where: { id: decodedToken.id } })

    if (user?.id) {
      request.updateBody({ userId: user?.id, ...request.body() })
      await next()
    } else {
      response.unauthorized({ message: 'Error: Invalid token' })
    }
  }
}
