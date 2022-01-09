import { PrismaClient } from '@prisma/client'
import { ModifiedBody } from 'App/Middleware/Auth'

export type GetDelEnv = { projectName: string } & ModifiedBody

export class ProjectLoader {
  constructor(private client: PrismaClient) {}

  public async load({ projectName, userId }: GetDelEnv) {
    return await this.client.user
      .findUnique({ where: { id: userId } })
      .projects({ where: { name: projectName } })
  }
}
