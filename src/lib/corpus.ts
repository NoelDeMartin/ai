import { readdir, readFile } from 'node:fs/promises';

import matter from 'gray-matter';
import { z } from 'zod';

const CommandMetadataSchema = z.object({
    description: z.string(),
});

const GuidelinesMetadataSchema = z.object({
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

function parseGuidelines(name: string, contents: string): CorpusGuidelines {
    const { data, content } = matter(contents);
    const metadata = GuidelinesMetadataSchema.parse(data);

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

export interface CorpusGuidelines {
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

export async function getGuidelines(): Promise<CorpusGuidelines[]> {
    const guidelinesDir = new URL('../../corpus/guidelines/', import.meta.url);
    const files = await readdir(guidelinesDir);
    const guidelines = files.map((file) => file.slice(0, -'.md'.length));

    return Promise.all(
        guidelines.map(async (guidelinesDocument) => {
            const guidelinesPath = new URL(`${guidelinesDocument}.md`, guidelinesDir);

            return parseGuidelines(guidelinesDocument, await readFile(guidelinesPath, 'utf8'));
        }),
    );
}
