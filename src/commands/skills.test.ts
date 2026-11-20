import { describe, expect, it } from 'vitest';

import { testCommand } from '#/testing/commands.ts';
import { copyToVirtualFilesystem } from '#/testing/filesystem.ts';

import SkillsCommand from './skills.ts';

describe('skills command', () => {
    it('shows skill instructions', async () => {
        // Arrange
        copyToVirtualFilesystem('corpus/skills/playwriter.md');

        // Act
        const { output } = await testCommand(SkillsCommand, ['playwriter']);

        // Assert
        expect(output).toContain(
            `Playwriter controls the user's Chrome browser via Playwright snippets`,
        );
    });

    it('fails with unknown skills', async () => {
        // Arrange
        copyToVirtualFilesystem('corpus/skills/playwriter.md');

        // Act
        const { output, exitCode } = await testCommand(SkillsCommand, ['unknown']);

        // Assert
        expect(output).toContain('Skill "unknown" not found. Available skills: playwriter');
        expect(exitCode).toBe(1);
    });
});
