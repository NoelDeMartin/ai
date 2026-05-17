import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { arraySorted } from '@noeldemartin/utils';

import { Command } from '@/lib/Command.ts';
import { getGuidelines } from '@/lib/corpus.ts';

export default class GuidelinesCommand extends Command {
    public override description = 'Show coding guidelines for the current project';

    public override async run(): Promise<void> {
        const stack = await this.detectProjectStack();
        const allGuidelines = await getGuidelines();
        const guidelines = allGuidelines.filter(
            (guidelinesDocument) =>
                !guidelinesDocument.stack ||
                !guidelinesDocument.stack.some(
                    (guidelinesStack) => !stack.includes(guidelinesStack),
                ),
        );

        for (const guidelinesDocument of arraySorted(guidelines, 'priority', 'desc')) {
            this.print(guidelinesDocument.prompt.trim());
            this.print('');
        }
    }

    private async detectProjectStack(): Promise<string[]> {
        const stack: string[] = [];

        if (await this.usesLaravel()) {
            stack.push('laravel');

            if (await this.usesPest()) {
                stack.push('pest');
            }
        }

        if (await this.usesVue()) {
            stack.push('vue');
        }

        return stack;
    }

    private async usesLaravel(): Promise<boolean> {
        try {
            const composerJson = await readFile(resolve(process.cwd(), './composer.json'), 'utf-8');

            return composerJson.includes('laravel/framework');
        } catch {
            return false;
        }
    }

    private async usesPest(): Promise<boolean> {
        try {
            const composerJson = await readFile(resolve(process.cwd(), './composer.json'), 'utf-8');

            return composerJson.includes('pestphp/pest');
        } catch {
            return false;
        }
    }

    private async usesVue(): Promise<boolean> {
        try {
            const packageJson = await readFile(resolve(process.cwd(), './package.json'), 'utf-8');

            return packageJson.includes('vue');
        } catch {
            return false;
        }
    }
}
