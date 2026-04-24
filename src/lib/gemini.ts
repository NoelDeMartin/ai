import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { resolve } from 'node:path';

import type { CorpusCommand } from '@/lib/corpus.ts';

function renderToml(command: CorpusCommand): string {
    return [
        `description = "${command.description.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`,
        '',
        'prompt = """',
        command.prompt.trim(),
        '"""',
        '',
    ].join('\n');
}

export async function installGeminiCommand(command: CorpusCommand): Promise<void> {
    const commandsDir = resolve(os.homedir(), '.gemini/commands');
    const commandPath = `${commandsDir}/${command.name}.toml`;

    await mkdir(commandsDir, { recursive: true });
    await writeFile(commandPath, renderToml(command), 'utf8');
}
