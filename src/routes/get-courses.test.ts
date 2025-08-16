import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts';
import { randomUUID } from 'crypto';
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts';

test('should get courses', async () => {
    await server.ready();

    const titleId = randomUUID();
    const course = await makeCourse(titleId);
    const { token } = await makeAuthenticatedUser('manager');

    const response = await request(server.server)
        .get(`/courses?search=${titleId}`)
        .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
        total: 1,
        courses: [
            {
                id: expect.any(String),
                title: titleId,
                enrollments: 0,
            }
        ]
    });
})