import { vol } from 'memfs';
import { beforeEach, vi } from 'vitest';

vi.mock('node:fs/promises', async () => {
    const { promises } = require('memfs');

    return promises;
});

beforeEach(() => {
    vol.reset();
    vi.resetAllMocks();
});
