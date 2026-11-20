import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { arraySorted } from '@noeldemartin/utils';

import { Command } from '#/lib/Command.ts';
import { getGuidelines } from '#/lib/corpus.ts';

export default class GuidelinesCommand extends Command {
    public override description = 'Show coding guidelines for the current project';

    public override async run(): Promise<void> {
        const stack = await this.detectProjectStack();
        const allGuidelines = await getGuidelines();
        const guidelines = allGuidelines.filter(
            (guidelinesDocument) =>
                !guidelinesDocument.stack ||
                guidelinesDocument.stack.every((requiredStack) => stack.includes(requiredStack)),
        );

        for (const guidelinesDocument of arraySorted(guidelines, 'priority', 'desc')) {
            this.print(guidelinesDocument.prompt.trim());
            this.print('');
        }
    }

    private async detectProjectStack(): Promise<string[]> {
        const [composerJson, packageJson] = await Promise.all([
            this.readProjectFile('composer.json'),
            this.readProjectFile('package.json'),
        ]);
        const stack: string[] = [];

        if (composerJson?.includes('laravel/framework')) {
            stack.push('laravel');

            if (composerJson.includes('pestphp/pest')) {
                stack.push('pest');
            }
        }

        if (packageJson?.includes('vue')) {
            stack.push('vue');
        }

        if (packageJson && (packageJson.includes('vitest') || packageJson.includes('vite-plus'))) {
            stack.push('vitest');
        }

        return stack;
    }

    private async readProjectFile(filename: string): Promise<string | null> {
        try {
            return await readFile(resolve(process.cwd(), filename), 'utf-8');
        } catch {
            return null;
        }
    }
}
