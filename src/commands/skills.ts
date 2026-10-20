import { Command } from '@/lib/Command.ts';
import { getSkill, getSkills } from '@/lib/corpus.ts';

export default class SkillsCommand extends Command {
    public override description = 'Show instructions for a skill';
    public override arguments = ['name'];

    public override async run(name: string): Promise<void> {
        const skills = await getSkills();

        if (!skills.includes(name)) {
            this.fail(`Skill "${name}" not found. Available skills: ${skills.join(', ')}`);

            return;
        }

        this.print(await getSkill(name));
    }
}
