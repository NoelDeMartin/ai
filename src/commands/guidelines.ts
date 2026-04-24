import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { arraySorted } from '@noeldemartin/utils';

import { Command } from '@/lib/Command.ts';
import { getRules } from '@/lib/corpus.ts';

export default class GuidelinesCommand extends Command {
    public override description = 'Show coding guidelines for the current project';

    public override async run(): Promise<void> {
        const stack = await this.detectProjectStack();
        const allRules = await getRules();
        const rules = allRules.filter(
            (rule) => !rule.stack || !rule.stack.some((ruleStack) => !stack.includes(ruleStack)),
        );

        for (const rule of arraySorted(rules, 'priority', 'desc')) {
            this.print(rule.prompt.trim());
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
