import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';
import { eq } from 'drizzle-orm';

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.get('/courses/:id', {
        schema: {
            params: z.object({
                id: z.uuid(),
            })
        }
    }, async (request, response) => {
        const courseId = request.params.id;
        const result = await db
            .select()
            .from(courses)
            .where(eq(courses.id, courseId));
        if (result.length > 0) {
            return {course: result[0]}
        }
        return response.status(404).send();
    });
};
