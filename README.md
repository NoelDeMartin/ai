# AI

This repository contains my tooling to work with AI.

## Setup

This is mostly intended for my workflow, but if you're curious to try it out add the following line to ~/.bashrc:

```sh
export PATH=[projects-path]/ai/bin:$PATH
```

Then reload your terminal session, and you'll be able to use `ai` cli:

```sh
$ ai

ai/0.0.0

Usage:
  $ ai <command> [options]

Commands:
  install-commands  Install Agent commands
  guidelines        Show coding guidelines for the current project

For more info, run any command with the `--help` flag:
  $ ai install-commands --help
  $ ai guidelines --help

Options:
  -v, --version  Display version number
  -h, --help     Display this message
```
