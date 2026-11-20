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

const CORPUS_DIR = new URL('../../corpus/', import.meta.url);
const SKILL_PLACEHOLDER_PATTERN = /<skills:(\w+)\s*\/>/g;

async function readCorpusFiles<T>(
    subdirectory: string,
    parse: (name: string, contents: string) => T | Promise<T>,
): Promise<T[]> {
    const dir = new URL(`${subdirectory}/`, CORPUS_DIR);
    const files = await readdir(dir);

    return Promise.all(
        files.map(async (file) => {
            const name = file.slice(0, -'.md'.length);
            const contents = await readFile(new URL(file, dir), 'utf8');

            return parse(name, contents);
        }),
    );
}

async function replaceSkillPlaceholders(content: string): Promise<string> {
    const skillNames = [
        ...new Set([...content.matchAll(SKILL_PLACEHOLDER_PATTERN)].map((match) => match[1])),
    ];

    const skills = new Map(
        await Promise.all(skillNames.map(async (name) => [name, await getSkill(name)] as const)),
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
        prompt: await replaceSkillPlaceholders(content),
    };
}

function parseGuidelines(contents: string): CorpusGuidelines {
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

export function getCommands(): Promise<CorpusCommand[]> {
    return readCorpusFiles('commands', parseCommand);
}

export async function getSkills(): Promise<string[]> {
    const files = await readdir(new URL('skills/', CORPUS_DIR));

    return files.map((file) => file.slice(0, -'.md'.length));
}

export async function getSkill(name: string): Promise<string> {
    const skillPath = new URL(`skills/${name}.md`, CORPUS_DIR);

    return (await readFile(skillPath, 'utf8')).trim();
}

export function getGuidelines(): Promise<CorpusGuidelines[]> {
    return readCorpusFiles('guidelines', (_, contents) => parseGuidelines(contents));
}
