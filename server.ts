import fastify from 'fastify';
import crypto from 'crypto';

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
});

const courses = [
    { id: '1', title: 'Curso de Node.js'},
    { id: '2', title: 'Curso de React'},
    { id: '3', title: 'Curso de React Native'},
]

server.get('/courses', () => {
    return {courses};
});

server.get('/courses/:id', (request, response) => {
    type Params = {
        id: string
    }
    const params = request.params as Params;
    const courseId = params.id;
    const course = courses.find(course => course.id === courseId);
    if (course) {
        return {course}
    }
    return response.status(404).send();
});

server.post('/courses', (request, response) => {
    type Body = {
        title: string
    }
    const params = request.body as Body;
    const courseId = crypto.randomUUID();
    const courseTitle = params.title;
    if (!courseTitle) {
        return response.status(400).send({ message: 'Título obrigatório' });
    }
    courses.push({ id: courseId, title: courseTitle });
    return response.status(201).send({courseId});
});

server.listen({port: 3333}).then(() => {
    console.log('HTTP server running!');
});