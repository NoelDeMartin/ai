import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { resolve } from 'node:path';

import type { CorpusCommand } from '@/lib/corpus.ts';

function renderSkill(command: CorpusCommand): string {
    return [
        '---',
        `name: ${command.name}`,
        `description: ${command.description}`,
        `disable-model-invocation: true`,
        '---',
        '',
        command.prompt.trim(),
        '',
    ].join('\n');
}

export async function installAntigravityCommand(command: CorpusCommand): Promise<void> {
    const commandDir = resolve(os.homedir(), `.gemini/skills/${command.name}`);
    const commandPath = `${commandDir}/SKILL.md`;

    await mkdir(commandDir, { recursive: true });
    await writeFile(commandPath, renderSkill(command), 'utf8');
}
