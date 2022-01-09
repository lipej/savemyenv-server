import Route from '@ioc:Adonis/Core/Route'
import './routes/project'
import './routes/user'
import './routes/auth'

Route.get('/', async () => {
  return { hello: 'world' }
})
