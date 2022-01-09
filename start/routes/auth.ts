import Route from '@ioc:Adonis/Core/Route'
import { PrismaClient } from '@prisma/client'
import AuthController from 'App/Controllers/authController'

const client = new PrismaClient()
const controller = new AuthController(client)

export type User = {
  usr: string
  pass: string
  mail: string
}

export type UserLogin = Omit<User, 'mail'>

Route.post('/api/v1/auth', async ({ request, response }) => {
  const body = request.body() as UserLogin
  try {
    await controller.login({ usr: body.usr, pass: body.pass }, response)
  } catch (e) {
    console.error(e)
    response.internalServerError(e)
  }
})

Route.post('/api/v1/verify', async ({ response, request }) => {
  try {
    await controller.verifyToken({ request, response })
  } catch (e) {
    console.error(e)
    response.internalServerError()
  }
}).middleware('auth')
