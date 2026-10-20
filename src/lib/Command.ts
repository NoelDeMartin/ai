import { spinner } from '@clack/prompts';
import { isTesting } from '@noeldemartin/utils';
import type { CAC } from 'cac';

export abstract class Command {
    public description?: string;
    public arguments: string[] = [];

    public abstract run(...args: string[]): Promise<void>;

    public register(cli: CAC, name: string) {
        const signature = [name, ...this.arguments.map((argument) => `<${argument}>`)].join(' ');

        cli.command(signature, this.description).action((...args: string[]) =>
            this.run(...args.slice(0, this.arguments.length)),
        );
    }

    protected print(text: string): void {
        console.log(text);
    }

    protected fail(text: string): void {
        console.error(text);
        process.exitCode = 1;
    }

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
