import type { Constructor } from '@noeldemartin/utils';

import type { Command } from '@/lib/Command.ts';

export async function testCommand<T extends Command>(CommandClass: Constructor<T>): Promise<void> {
    const command = new CommandClass();

    await command.run();
}
