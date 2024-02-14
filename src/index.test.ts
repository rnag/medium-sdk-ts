// index.test.ts

import { add } from './index';

describe('add function', () => {
    test('add works', () => {
        expect(add(1, 2)).toBeGreaterThanOrEqual(3);
    });

    test('add works pt 2', () => {
        expect(add(10, 1)).toBeLessThanOrEqual(12);
    });

    // Add more test cases as needed
});