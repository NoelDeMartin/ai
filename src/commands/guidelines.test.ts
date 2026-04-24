import { vol } from 'memfs';
import { describe, expect, it } from 'vitest';

import { testCommand } from '@/testing/commands.ts';
import { copyToVirtualFilesystem } from '@/testing/filesystem.ts';

import GuidelinesCommand from './guidelines.ts';

describe('guidelines command', () => {
    it('Detects stack', async () => {
        copyToVirtualFilesystem('corpus/rules/laravel.md');
        copyToVirtualFilesystem('corpus/rules/vue.md');

        vol.fromJSON({
            'composer.json': JSON.stringify({
                dependencies: {
                    'laravel/framework': '^10.0',
                },
            }),
        });

        const output = await testCommand(GuidelinesCommand);

        expect(output).toContain('Laravel Best Practices');
        expect(output).not.toContain('Vue Best Practices');
    });
});
