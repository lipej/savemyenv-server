import Route from '@ioc:Adonis/Core/Route'
import { PrismaClient } from '@prisma/client'
import ProjectController from 'App/Controllers/projectController'
import { ModifiedBody } from 'App/Middleware/Auth'

const client = new PrismaClient()
const controller = new ProjectController(client)

type SaveRequest = { envData: string } & ModifiedBody

Route.get('/api/v1/app/:project', async ({ params, response, request }) => {
  const body = request.body() as ModifiedBody
  try {
    await controller.get({ projectName: <string>params.project, userId: body.userId }, { response })
  } catch (e) {
    console.error(e)
    response.internalServerError()
  }
}).middleware('auth')

Route.post('/api/v1/app/:project', async ({ params, response, request }) => {
  const body = request.body() as SaveRequest
  try {
    await controller.save(
      {
        projectName: <string>params.project,
        env: body.envData,
        userId: body.userId,
      },
      { response }
    )
  } catch (e) {
    console.error(e)
    response.internalServerError()
  }
}).middleware('auth')

Route.delete('/api/v1/app/:project', async ({ params, response, request }) => {
  const body = request.body() as SaveRequest
  try {
    await controller.remove(
      {
        projectName: <string>params.project,
        userId: body.userId,
      },
      { response }
    )
  } catch (e) {
    console.error(e)
    response.internalServerError()
  }
}).middleware('auth')
