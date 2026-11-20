import { Command } from '#/lib/Command.ts';
import { getSkill, getSkills } from '#/lib/corpus.ts';

export default class SkillsCommand extends Command {
    public override description = 'Show instructions for a skill';
    public override arguments = ['name'];

    public override async run(name: string): Promise<number | void> {
        const skills = await getSkills();

        if (!skills.includes(name)) {
            return this.fail(`Skill "${name}" not found. Available skills: ${skills.join(', ')}`);
        }

        this.print(await getSkill(name));
    }
}
