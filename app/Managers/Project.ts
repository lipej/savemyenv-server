import { PrismaClient } from '@prisma/client'
import { ModifiedBody } from 'App/Middleware/Auth'

export type SaveEnv = { projectName: string; env: string } & ModifiedBody

export class ProjectManager {
  constructor(private client: PrismaClient) {}

  public async upsert({ projectName, env, userId }: SaveEnv) {
    await this.client.project.upsert({
      where: { name: projectName },
      update: { env },
      create: { name: projectName, env, updatedAt: new Date(), userId: userId },
    })
  }

  public async delete(id: string) {
    await this.client.project.delete({ where: { id } })
  }
}
