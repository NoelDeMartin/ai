import type { Constructor } from '@noeldemartin/utils';

import type { Command } from '#/lib/Command.ts';

export async function testCommand<T extends Command>(
    CommandClass: Constructor<T>,
    args: string[] = [],
): Promise<{ output: string; exitCode: number }> {
    const command = new CommandClass();
    const originalLog = console.log;
    const originalError = console.error;
    const output: string[] = [];
    let exitCode = 0;

    console.log = (line) => output.push(String(line));
    console.error = (line) => output.push(String(line));

    try {
        exitCode = (await command.run(...args)) ?? 0;
    } finally {
        console.log = originalLog;
        console.error = originalError;
    }

    return {
        output: output.join('\n'),
        exitCode,
    };
}
