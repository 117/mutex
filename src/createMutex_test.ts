import { assert } from "assert";

import { createMutex } from "@/src/createMutex.ts";

Deno.test("should be acquired and released correctly", async () => {
    const mutex = createMutex();
    const results: string[] = [];

    const fn = async (name: string, delay: number) => {
        await mutex.acquire();

        results.push(`aquired ${name}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        results.push(`released ${name}`);

        mutex.release();
    };

    await fn("a", 100);
    await fn("b", 50);
    await fn("c", 75);

    const expected = [
        "aquired a",
        "released a",
        "aquired b",
        "released b",
        "aquired c",
        "released c",
    ];

    assert(
        results.length === expected.length,
        `results length mismatch: expected ${expected.length}, got ${results.length}`,
    );

    for (let i = 0; i < expected.length; i++) {
        assert(
            results[i] === expected[i],
            `expected '${expected[i]}', but got '${results[i]}' at index ${i}`,
        );
    }
});

Deno.test("should allow sequential execution", async () => {
    const mutex = createMutex();
    const results: string[] = [];

    await mutex.acquire();
    results.push("acquired a");
    await new Promise((resolve) => setTimeout(resolve, 100));
    results.push("released a");

    mutex.release();

    await mutex.acquire();
    results.push("acquired b");
    await new Promise((resolve) => setTimeout(resolve, 100));
    results.push("released b");

    mutex.release();

    const expected = [
        "acquired a",
        "released a",
        "acquired b",
        "released b",
    ];

    assert(
        results.length === expected.length,
        `results length mismatch: expected ${expected.length}, got ${results.length}`,
    );

    for (let i = 0; i < expected.length; i++) {
        assert(
            results[i] === expected[i],
            `expected '${expected[i]}', but got '${results[i]}' at index ${i}`,
        );
    }
});
