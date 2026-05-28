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

const SKILL_PLACEHOLDER_PATTERN = /<skills:(\w+)\s*\/>/g;

function replacePlaceholders(content: string): Promise<string> {
    return replaceSkillPlaceholders(content);
}

async function replaceSkillPlaceholders(content: string): Promise<string> {
    const skillNames = [
        ...new Set([...content.matchAll(SKILL_PLACEHOLDER_PATTERN)].map((match) => match[1])),
    ];

    const skillsDir = new URL('../../corpus/skills/', import.meta.url);
    const skills = new Map(
        await Promise.all(
            skillNames.map(async (name) => {
                const skillPath = new URL(`${name}.md`, skillsDir);

                return [name, (await readFile(skillPath, 'utf8')).trim()] as const;
            }),
        ),
    );

    return content.replace(
        SKILL_PLACEHOLDER_PATTERN,
        (_, name) => skills.get(name) ?? `<skills:${name} />`,
    );
}

async function parseCommand(name: string, contents: string): Promise<CorpusCommand> {
    const { data, content } = matter(contents);
    const metadata = CommandMetadataSchema.parse(data);

    return {
        name,
        description: metadata.description,
        prompt: await replacePlaceholders(content),
    };
}

function parseGuidelines(_: string, contents: string): CorpusGuidelines {
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
