import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
const ENV_DATA = 'TESTENV'
test.group('project', (group) => {
  let token

  group.beforeEach(async () => {
    await supertest(BASE_URL).post('/api/v1/register').send({
      usr: 'test',
      pass: 'test',
      mail: 'test',
    })

    token = await supertest(BASE_URL)
      .post('/api/v1/auth')
      .send({
        usr: 'test',
        pass: 'test',
      })
      .then((response) => response.body.authToken)
  })

  test('send env', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/api/v1/app/test')
      .set('Authorization', `Bearer ${token}`)
      .send({
        envData: ENV_DATA,
      })
      .expect(200)

    assert.deepEqual(body, { success: true })
  })

  test('receive env', async (assert) => {
    await supertest(BASE_URL)
      .post('/api/v1/app/test')
      .set('Authorization', `Bearer ${token}`)
      .send({
        envData: ENV_DATA,
      })
      .expect(200)

    const { body } = await supertest(BASE_URL)
      .get('/api/v1/app/test')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    assert.containsAllDeepKeys(body, { envData: 'string' })
    assert.equal(body.envData, ENV_DATA)
  })

  test('receive env 404', async (assert) => {
    const { statusCode } = await supertest(BASE_URL)
      .get('/api/v1/app/test2')
      .set('Authorization', `Bearer ${token}`)

    assert.equal(statusCode, 404)
  })

  test('delete env', async (assert) => {
    const { statusCode } = await supertest(BASE_URL)
      .delete('/api/v1/app/test')
      .set('Authorization', `Bearer ${token}`)

    assert.equal(statusCode, 200)
  })
})
