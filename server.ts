import fastify from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import scalarAPIReference from '@scalar/fastify-api-reference';
import {
    jsonSchemaTransform,
    validatorCompiler,
    serializerCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod';
import { getCoursesRoute } from './src/routes/get-courses.ts';
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts';
import { createCourseRoute } from './src/routes/create-course.ts';

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
});
server.register(scalarAPIReference, {
    routePrefix: '/docs-scalar'
});

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(getCoursesRoute)
server.register(getCourseByIdRoute)
server.register(createCourseRoute)

server.listen({port: 3333}).then(() => {
    console.log('HTTP server running!');
});