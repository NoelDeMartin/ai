import matter from 'gray-matter';
import { z } from 'zod';

const CommandMetadataSchema = z.object({
    description: z.string(),
});

export interface CorpusCommand {
    name: string;
    description: string;
    prompt: string;
}

export function parseCommand(name: string, contents: string): CorpusCommand {
    const { data, content } = matter(contents);
    const metadata = CommandMetadataSchema.parse(data);

    return {
        name,
        description: metadata.description,
        prompt: content,
    };
}
