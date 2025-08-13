import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    server.get('/courses', {
            schema: {
                tags: ['courses'],
                summary: 'Get all courses',
                description: 'This route gets the courses list',
                response: {
                    201: z.object({
                        courses: z.array(
                            z.object({
                                id: z.uuid(),
                                title: z.string(),
                            })
                        )
                    })
                }
            }
        }, async (request, response) => {
        const result = await db.select({
            id: courses.id,
            title: courses.title
        }).from(courses);
        return response.send({courses: result})
    });
};
