import { afterEach, describe, expect, it } from 'vitest';

import { testCommand } from '@/testing/commands.ts';
import { copyToVirtualFilesystem } from '@/testing/filesystem.ts';

import SkillsCommand from './skills.ts';

describe('skills command', () => {
    afterEach(() => {
        process.exitCode = 0;
    });

    it('shows skill instructions', async () => {
        copyToVirtualFilesystem('corpus/skills/playwriter.md');

        const output = await testCommand(SkillsCommand, ['playwriter']);

        expect(output).toContain(
            `Playwriter controls the user's Chrome browser via Playwright snippets`,
        );
    });

    it('fails with unknown skills', async () => {
        copyToVirtualFilesystem('corpus/skills/playwriter.md');

        const output = await testCommand(SkillsCommand, ['unknown']);

        expect(output).toContain('Skill "unknown" not found. Available skills: playwriter');
        expect(process.exitCode).toBe(1);
    });
});
