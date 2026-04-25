import os from 'node:os';
import { resolve } from 'node:path';

import { vol } from 'memfs';
import { describe, expect, it } from 'vitest';

import { testCommand } from '@/testing/commands.ts';
import { createVirtualFile } from '@/testing/filesystem.ts';

import InstallCommandsCommand from './install-commands.ts';

describe('install-commands command', () => {
    it('creates toml command', async () => {
        createVirtualFile(
            'corpus/commands/commit.md',
            `
                ---
                description: Create a new commit
                ---

                Create a new commit with the changes in the git staging area, following these instructions: {{args}}
            `,
        );

        await testCommand(InstallCommandsCommand);

        expect(vol.readFileSync(resolve(os.homedir(), '.gemini/commands/commit.toml'), 'utf-8'))
            .toMatchInlineSnapshot(`
                "description = "Create a new commit"

                prompt = """
                Create a new commit with the changes in the git staging area, following these instructions: {{args}}
                """
                "
            `);
    });
});
