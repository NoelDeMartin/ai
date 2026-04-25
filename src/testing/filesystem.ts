import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { formatCodeBlock } from '@noeldemartin/utils';
import { vol } from 'memfs';

export function copyToVirtualFilesystem(path: string): void {
    const filePath = new URL(`../../${path}`, import.meta.url);

    vol.fromJSON({ [fileURLToPath(filePath)]: readFileSync(filePath, 'utf-8') });
}

export function createVirtualFile(path: string, contents: string): void {
    const filePath = new URL(`../../${path}`, import.meta.url);

    vol.fromJSON({ [fileURLToPath(filePath)]: formatCodeBlock(contents) });
}
