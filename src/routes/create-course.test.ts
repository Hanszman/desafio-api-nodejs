import { expect, test } from 'vitest';

function soma(a: number, b: number) {
    return a - b;
}

test('should create course successfully', () => {
    const sum = soma(1, 2);
    expect(sum).toEqual(3);
})