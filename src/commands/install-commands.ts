import { Command } from '@/lib/Command.ts';
import { getCommands } from '@/lib/corpus.ts';
import { installGeminiCommand } from '@/lib/gemini.ts';

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
            await installGeminiCommand(command);
        }
    }
}
