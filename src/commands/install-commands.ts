import { readdir, readFile } from 'node:fs/promises';

import { Command } from '@/lib/Command.ts';
import { parseCommand } from '@/lib/corpus.ts';
import { installGeminiCommand } from '@/lib/gemini.ts';

export default class InstallCommandsCommand extends Command {
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
        const commandsDir = new URL('../../corpus/commands/', import.meta.url);
        const files = await readdir(commandsDir);
        const commands = files.map((file) => file.slice(0, -'.md'.length));

        for (const command of commands) {
            const commandPath = new URL(`${command}.md`, commandsDir);
            const corpusCommand = parseCommand(command, await readFile(commandPath, 'utf8'));

            await installGeminiCommand(corpusCommand);
        }
    }
}
