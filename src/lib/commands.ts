import { readdir } from 'node:fs/promises';

import type { Constructor } from '@noeldemartin/utils';
import type { CAC } from 'cac';

import type { Command } from '@/lib/Command.ts';

export async function registerCommands(cli: CAC): Promise<void> {
    const commandsDir = new URL('../commands/', import.meta.url);
    const files = await readdir(commandsDir);
    const commands = files
        .filter((file) => !file.endsWith('.test.ts'))
        .map((file) => file.slice(0, -'.ts'.length));

    for (const command of commands) {
        const commandPath = new URL(`${command}.ts`, commandsDir);
        const { default: CommandClass } = (await import(commandPath.href)) as {
            default: Constructor<Command>;
        };

        new CommandClass().register(cli, command);
    }
}
