import Route from '@ioc:Adonis/Core/Route'
import { PrismaClient } from '@prisma/client'
import UserController from 'App/Controllers/userController'

const client = new PrismaClient()
const controller = new UserController(client)

export type User = {
  usr: string
  pass: string
  mail: string
}

export type UserLogin = Omit<User, 'mail'>

Route.post('/api/v1/register', async ({ response, request }) => {
  const body = request.body() as User
  try {
    await controller.register({ usr: body.usr, pass: body.pass, mail: body.mail })

    response.created({ success: true })
  } catch (e) {
    console.error(e)
    response.internalServerError()
  }
})
