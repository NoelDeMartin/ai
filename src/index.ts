import cac from 'cac';

import { registerCommands } from './lib/commands.ts';

const cli = cac('ai');

cli.version('0.0.0');
cli.help();

await registerCommands(cli);

if (process.argv.slice(2).length === 0) {
    cli.outputHelp();
    process.exit(0);
}

cli.parse();
