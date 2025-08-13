import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/courses', {
        schema: {
            tags: ['courses'],
            summary: 'Create a Course',
            description: 'This route receives a title and create a course',
            body: z.object({
                title: z.string().min(5, 'Title must have at least 5 characters.'),
            }),
            response: {
                201: z.object({ courseId: z.uuid() }).describe('Course created successfully')
            }
        }
    }, async (request, response) => {
        const courseTitle = request.body.title;
        const result = await db
            .insert(courses)
            .values({ title: courseTitle })
            .returning()
        return response.status(201).send({courseId: result[0].id});
    });
};
