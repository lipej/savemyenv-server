import 'reflect-metadata'
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname)
process.env.APP_KEY = 'test-keya13d1a&*Ÿ*!d'
process.env.PERMANENT_TOKEN_SECRET = 'test-secret'
process.env.APPLICATION_SECRET_KEY = 'test-secret'
process.env.MONGOMS_DOWNLOAD_URL =
  'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-5.0.5.tgz'

sourceMapSupport.install({ handleUncaughtExceptions: false })

async function startHttpServer() {
  const mongod = await MongoMemoryReplSet.create({
    replSet: { count: 4, storageEngine: 'wiredTiger' },
  })

  process.env.DATABASE_URL = mongod.getUri().split(',')[0] + '/db_test'
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

/**
 * Configure test runner
 */
configure({
  files: ['test/**/*.spec.ts'],
  before: [startHttpServer],
})
