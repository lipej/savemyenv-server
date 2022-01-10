import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('auth', (group) => {
  group.beforeEach(async () => {
    await supertest(BASE_URL).post('/api/v1/register').send({
      usr: 'test',
      pass: 'test',
      mail: 'test',
    })
  })
  test('/auth', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/api/v1/auth')
      .send({
        usr: 'test',
        pass: 'test',
      })
      .expect(200)

    assert.containsAllDeepKeys(body, { authToken: 'string' })
  })

  test('/auth error 500', async (assert) => {
    const { statusCode } = await supertest(BASE_URL).post('/api/v1/verify').send({
      usr: 'test2',
      pass: 'test1',
    })

    assert.equal(statusCode, 500)
  })

  test('/verify', async (assert) => {
    const response = await supertest(BASE_URL).post('/api/v1/auth').send({
      usr: 'test',
      pass: 'test',
    })

    const { body } = await supertest(BASE_URL)
      .post('/api/v1/verify')
      .set('Authorization', `Bearer ${response.body.authToken}`)
      .expect(200)

    assert.containsAllDeepKeys(body, { subscription: 'string', dbSecret: 'string' })
  })

  test('/verify error 401', async (assert) => {
    const { statusCode } = await supertest(BASE_URL)
      .post('/api/v1/verify')
      .set(
        'Authorization',
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZGNiMDNmYzQxNzlkOTgwZDcxMDljZiIsImlhdCI6MTY0MTg1Mjk5MSwiZXhwIjoxNjQ0NDQ0OTkxfQ.QQdPTvp6h8KLwrve56Fkrf9oob4b3hik0gxP4s2w49I`
      )

    assert.equal(statusCode, 401)
  })

  test('/verify error 500', async (assert) => {
    const { statusCode } = await supertest(BASE_URL)
      .post('/api/v1/verify')
      .set('Authorization', `Bearer QQdPTvp6h8KLwrve56Fkrf9oob4b3hik0gxP4s2w49I`)

    assert.equal(statusCode, 500)
  })
})
