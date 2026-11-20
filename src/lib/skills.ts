import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { resolve } from 'node:path';

import type { CorpusCommand } from '#/lib/corpus.ts';

export interface SkillTarget {
    directory: string;
    argumentsPlaceholder: string;
}

function renderSkill(command: CorpusCommand, argumentsPlaceholder: string): string {
    return [
        '---',
        `name: ${command.name}`,
        `description: ${command.description}`,
        'disable-model-invocation: true',
        '---',
        '',
        command.prompt.replaceAll('<arguments />', argumentsPlaceholder).trim(),
        '',
    ].join('\n');
}

export async function installSkill(command: CorpusCommand, target: SkillTarget): Promise<void> {
    const commandDir = resolve(os.homedir(), target.directory, command.name);
    const commandPath = resolve(commandDir, 'SKILL.md');

    await mkdir(commandDir, { recursive: true });
    await writeFile(commandPath, renderSkill(command, target.argumentsPlaceholder), 'utf8');
}
