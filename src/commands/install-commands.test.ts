import os from 'node:os';
import { resolve } from 'node:path';

import { vol } from 'memfs';
import { describe, expect, it } from 'vitest';

import { testCommand } from '@/testing/commands.ts';
import { copyToVirtualFilesystem, createVirtualFile } from '@/testing/filesystem.ts';

import InstallCommandsCommand from './install-commands.ts';

describe('install-commands command', () => {
    it('creates antigravity skill', async () => {
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

        expect(vol.readFileSync(resolve(os.homedir(), '.gemini/skills/commit/SKILL.md'), 'utf-8'))
            .toMatchInlineSnapshot(`
                "---
                name: commit
                description: Create a new commit
                ---

                Create a new commit with the changes in the git staging area, following these instructions: {{args}}
                "
            `);
    });

    it('replaces skill placeholders', async () => {
        copyToVirtualFilesystem('corpus/skills/playwriter.md');
        createVirtualFile(
            'corpus/commands/debug.md',
            `
                ---
                description: Investigate a problem.
                ---

                <skills:playwriter />
            `,
        );

        await testCommand(InstallCommandsCommand);

        expect(
            vol.readFileSync(resolve(os.homedir(), '.gemini/skills/debug/SKILL.md'), 'utf-8'),
        ).toContain(`Playwriter controls the user's Chrome browser via Playwright snippets`);
    });
});
