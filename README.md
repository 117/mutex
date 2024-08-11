# mutex

A simple, lightweight mutex implementation for Deno that supports async/await.

## Contents

- [Features](#features)
- [Install](#install)
- [Example](#example)
- [Contributing](#contributing)

## Features

- [x] Simple and lightweight.
- [x] Controls access to code that should run synchronously.

## Install

todo

## Example

```ts
import { createMutex } from "jsr:@117/mutex";

const mutex = createMutex();

const work = async () => {
    await mutex.acquire();

    try {
        console.log("mutex acquired, doing work");
    } finally {
        mutex.release();
    }
};

// they will not run concurrently
await Promise.all([work(), work()]);
```

## Contributing

Feel free to contribute and PR to your 💖's content.
