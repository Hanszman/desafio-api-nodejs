import fastify from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import {
    jsonSchemaTransform,
    validatorCompiler,
    serializerCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from './src/database/client.ts'
import { eq } from 'drizzle-orm'
import { courses } from './src/database/schema.ts';

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    }
}).withTypeProvider<ZodTypeProvider>();

server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Desafio Node.js',
            version: '1.0.0',
        }
    },
    transform: jsonSchemaTransform,
});
server.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.get('/courses', async (request, response) => {
    const result = await db.select({
        id: courses.id,
        title: courses.title
    }).from(courses);
    return response.send({courses: result})
});

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

server.post('/courses', {
    schema: {
        body: z.object({
            title: z.string().min(5, 'Title must have at least 5 characters.'),
        }),
    }
}, async (request, response) => {
    const courseTitle = request.body.title;
    const result = await db
        .insert(courses)
        .values({ title: courseTitle })
        .returning()
    return response.status(201).send({courseId: result[0].id});
});

server.listen({port: 3333}).then(() => {
    console.log('HTTP server running!');
});