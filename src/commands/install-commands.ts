import { Command } from '#/lib/Command.ts';
import { getCommands } from '#/lib/corpus.ts';
import { installSkill } from '#/lib/skills.ts';
import type { SkillTarget } from '#/lib/skills.ts';

const SKILL_TARGETS: SkillTarget[] = [
    { directory: '.gemini/skills', argumentsPlaceholder: '{{args}}' },
    { directory: '.claude/skills', argumentsPlaceholder: '$ARGUMENTS' },
];

export default class InstallCommandsCommand extends Command {
    public override description = 'Install Agent commands';

    public override async run(): Promise<void> {
        await this.loading(
            {
                loading: 'Installing commands...',
                done: 'Commands installed!',
            },
            () => this.installCommands(),
        );
    }

    private async installCommands(): Promise<void> {
        const commands = await getCommands();

        for (const command of commands) {
            await Promise.all(SKILL_TARGETS.map((target) => installSkill(command, target)));
        }
    }
}
