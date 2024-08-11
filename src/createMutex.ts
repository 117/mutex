/** @module createMutex */

/**
 * Represents a mutex object with methods to acquire and release the lock.
 *
 * @property {() => Promise<void>} acquire - Acquires the mutex.
 * @property {() => void} release - Releases the mutex.
 */
type Mutex = {
    /** acquires the mutex */
    acquire: () => Promise<void>;
    /** releases the mutex */
    release: () => void;
};

/**
 * Creates a mutex object with acquire and release methods.
 *
 * @returns {Mutex} A mutex object with acquire and release methods.
 */
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
