import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";
import { faker } from "@faker-js/faker";

export async function makeCourse(title?: string) {
    const result = await db.insert(courses).values({
        title: title ?? faker.lorem.word(4)
    }).returning();

    return result[0];
}