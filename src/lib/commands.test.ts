import cac from 'cac';
import { describe, it, expect } from 'vitest';

import { copyToVirtualFilesystem } from '@/testing/filesystem.ts';

import { registerCommands } from './commands.ts';

describe('commands', () => {
    it('registers commands', async () => {
        copyToVirtualFilesystem('src/commands/install-commands.ts');

        const cli = cac();

        await registerCommands(cli);

        expect(cli.commands.length).toBe(1);
    });
});
