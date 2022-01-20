import request from 'supertest'
import app from '../config/app'

describe('Initial Presentation', () => {
    test('Should return a presentation on success', async () => {
        await request(app)
            .get('/api/presentation')
            .expect(200)
    })
})
