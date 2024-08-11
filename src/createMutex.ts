type Mutex = {
    acquire: () => Promise<void>;
    release: () => void;
};

const createMutex = (): Mutex => {
    let locked = false;
    const waiting: (() => void)[] = [];

    const acquire = async (): Promise<void> => {
        while (locked) {
            await new Promise<void>((resolve) => waiting.push(resolve));
        }

        locked = true;
    };

    const release = (): void => {
        locked = false;
        const next = waiting.shift();

        if (next) {
            next();
        }
    };

    return { acquire, release };
};

export { createMutex, type Mutex };
