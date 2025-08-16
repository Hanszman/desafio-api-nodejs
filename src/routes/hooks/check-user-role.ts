import type { FastifyRequest, FastifyReply } from "fastify";
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts";

export async function checkUserRole(request: FastifyRequest, response: FastifyReply) {
    const user = getAuthenticatedUserFromRequest(request);
    if (user.role !== 'manager') {
        return response.status(401).send()
    }
}