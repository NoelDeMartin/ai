import type { Constructor } from '@noeldemartin/utils';

import type { Command } from '@/lib/Command.ts';

export async function testCommand<T extends Command>(
    CommandClass: Constructor<T>,
): Promise<string> {
    const command = new CommandClass();
    const originalLog = console.log;
    const output: string[] = [];

    console.log = (line) => output.push(String(line));

    await command.run();

    console.log = originalLog;

    return output.join('\n');
}
