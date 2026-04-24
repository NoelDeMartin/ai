import { readdir, readFile } from 'node:fs/promises';

import matter from 'gray-matter';
import { z } from 'zod';

const CommandMetadataSchema = z.object({
    description: z.string(),
});

const RulesMetadataSchema = z.object({
    stack: z.string().optional(),
    priority: z.number().optional(),
});

function parseCommand(name: string, contents: string): CorpusCommand {
    const { data, content } = matter(contents);
    const metadata = CommandMetadataSchema.parse(data);

    return {
        name,
        description: metadata.description,
        prompt: content,
    };
}

function parseRule(name: string, contents: string): CorpusRules {
    const { data, content } = matter(contents);
    const metadata = RulesMetadataSchema.parse(data);

    return {
        stack: metadata.stack ? [metadata.stack] : undefined,
        priority: metadata.priority ?? 5,
        prompt: content,
    };
}

export interface CorpusCommand {
    name: string;
    description: string;
    prompt: string;
}

export interface CorpusRules {
    stack?: string[];
    priority: number;
    prompt: string;
}

export async function getCommands(): Promise<CorpusCommand[]> {
    const commandsDir = new URL('../../corpus/commands/', import.meta.url);
    const files = await readdir(commandsDir);
    const commands = files.map((file) => file.slice(0, -'.md'.length));

    return Promise.all(
        commands.map(async (command) => {
            const commandPath = new URL(`${command}.md`, commandsDir);

            return parseCommand(command, await readFile(commandPath, 'utf8'));
        }),
    );
}

export async function getRules(): Promise<CorpusRules[]> {
    const rulesDir = new URL('../../corpus/rules/', import.meta.url);
    const files = await readdir(rulesDir);
    const rules = files.map((file) => file.slice(0, -'.md'.length));

    return Promise.all(
        rules.map(async (rule) => {
            const rulePath = new URL(`${rule}.md`, rulesDir);

            return parseRule(rule, await readFile(rulePath, 'utf8'));
        }),
    );
}
