import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('register', () => {
  test('should register an user', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/api/v1/register')
      .send({
        usr: 'test',
        pass: 'test',
        mail: 'test',
      })
      .expect(201)

    assert.deepStrictEqual(body, { success: true })
  }).timeout(50000)
})
