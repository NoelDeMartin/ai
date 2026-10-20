import type { Constructor } from '@noeldemartin/utils';

import type { Command } from '@/lib/Command.ts';

export async function testCommand<T extends Command>(
    CommandClass: Constructor<T>,
    args: string[] = [],
): Promise<string> {
    const command = new CommandClass();
    const originalLog = console.log;
    const originalError = console.error;
    const output: string[] = [];

    console.log = (line) => output.push(String(line));
    console.error = (line) => output.push(String(line));

    await command.run(...args);

    console.log = originalLog;
    console.error = originalError;

    return output.join('\n');
}
