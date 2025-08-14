import { expect, test } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts'

test('should create course successfully', async () => {
    const response = await request(server.server)
        .post('/courses')
        .set('Content-Type', 'application/json')
        .send({ title: 'Curso de Vue' });

    console.log(response.body);
})