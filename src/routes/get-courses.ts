import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    server.get('/courses', async (request, response) => {
        const result = await db.select({
            id: courses.id,
            title: courses.title
        }).from(courses);
        return response.send({courses: result})
    });
};
