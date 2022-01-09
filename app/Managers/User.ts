import { PrismaClient } from '@prisma/client'

export type User = {
  usr: string
  pass: string
  mail: string
  authToken: string
}

export class UserManager {
  constructor(private client: PrismaClient) {}

  public async create(data: User) {
    await this.client.user.create({
      data: {
        username: data.usr,
        password: data.pass,
        email: data.mail,
        authToken: data.authToken,
      },
    })
  }
}
