import os from 'node:os';
import { resolve } from 'node:path';

import { vol } from 'memfs';
import { describe, expect, it } from 'vitest';

import { testCommand } from '@/testing/commands.ts';
import { copyToVirtualFilesystem } from '@/testing/filesystem.ts';

import InstallCommandsCommand from './install-commands.ts';

describe('install-commands command', () => {
    it('creates toml command', async () => {
        copyToVirtualFilesystem('corpus/commands/commit.md');

        await testCommand(InstallCommandsCommand);

        expect(vol.readFileSync(resolve(os.homedir(), '.gemini/commands/commit.toml'), 'utf-8'))
            .toMatchInlineSnapshot(`
        	"description = "Create a new commit"

        	prompt = """
        	Create a new commit with the changes in the current working directory. Use both the context of the conversation thus far, and looking at the changes in git.

        	Before making the commit, show the complete commit message to the user and ask for confirmation.

        	Always append a Co-Authored-By: line with the agent/model used to perform the changes.

        	User input/overrides (if any): {{args}}
        	"""
        	"
        `);
    });
});
