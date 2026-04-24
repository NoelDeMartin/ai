import { spinner } from '@clack/prompts';
import { isTesting } from '@noeldemartin/utils';
import type { CAC } from 'cac';

export abstract class Command {
    register(cli: CAC, name: string) {
        cli.command(name).action(() => this.run());
    }

    public abstract run(): Promise<void>;

    protected async loading(
        messages: { loading: string; done: string },
        operation: () => Promise<unknown>,
    ): Promise<void> {
        if (isTesting()) {
            await operation();
            return;
        }

        const spin = spinner();

        spin.start(messages.loading);
        await operation();
        spin.stop(messages.done);
    }
}
