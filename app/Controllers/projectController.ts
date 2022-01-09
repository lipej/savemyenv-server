import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { PrismaClient } from '@prisma/client'
import { GetDelEnv, ProjectLoader } from 'App/Loaders/Project'
import { ProjectManager, SaveEnv } from 'App/Managers/Project'

type PartialCtx = { response: ResponseContract }

export default class ProjectController {
  private loader: ProjectLoader
  private manager: ProjectManager

  constructor(private client: PrismaClient) {
    this.loader = new ProjectLoader(this.client)
    this.manager = new ProjectManager(this.client)
  }

  public async get(data: GetDelEnv, { response }: PartialCtx) {
    const project = await this.loader.load(data)

    if (!project.length) response.notFound({ message: 'Project not found' })

    response.json({ envData: project[0]?.env })
  }

  public async save(data: SaveEnv, { response }: PartialCtx) {
    await this.manager.upsert(data)

    response.json({ success: true })
  }

  public async remove(data: GetDelEnv, { response }: PartialCtx) {
    const project = await this.loader.load(data)

    if (!project.length) response.notFound({ message: 'Project not found' })

    await this.manager.delete(project[0].id)

    response.json({ success: true })
  }
}
