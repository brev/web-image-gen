import type { ArgumentConfig } from 'ts-command-line-args'
import type {
  CommandArguments,
  GlobalArguments,
  GenerateArguments,
  OriginalsArguments,
  CleanArguments,
  Options,
} from 'web-image-gen-common'
import type { Section } from 'command-line-usage'

import { parse } from 'ts-command-line-args'
import usage from 'command-line-usage'

type CommandArgumentsPlus = CommandArguments & {
  _unknown: Array<string>
}

// context

const context = {
  name: 'web-image-gen',
  global: {
    commands: 'Available Commands',
    config:
      'Config file to use instead of the default, in `.js` or `.json` format.',
    description: [
      'Modern responsive web image generation and tooling.',
      '',
      'Default config merged with `.web-image-gen.js` or `.json`.',
    ].join('\n'),
    help: 'Show this usage help guide, or help for a specific command.',
    options: 'Global Options',
    url: 'https://github.com/brev/web-image-gen/tree/main/packages/cli',
    verbose: 'Display debugging output.',
  },
  generate: {
    description: 'Generate responsive images and importable code manifests.',
    details: [
      '',
      [
        'Images will be generated to requested sizes and formats in the `static` folder.',
        'Already existing images will be skipped, by default.',
      ].join(' '),
      '',
      [
        'Manifests will be generated as importable code in the `src/lib` folder.',
        'Manifests are created if any new images are generated, by default.',
      ].join(' '),
    ].join('\n'),
    force: 'Always write new files, even if they already exist.',
    only: 'Only create one of `images` or `manifests`, but not both.',
    options: 'Generate Options',
  },
  originals: {
    description: 'Perform helpful operations on original source images.',
    force: 'Bypass confirmation prompt when using `--remove` option.',
    optimize:
      'Minimize size of original source images while trying to maintain quality.',
    options: 'Originals Options',
    remove:
      'Remove original source images (shrink size of production release package).',
  },
  clean: {
    description: 'Remove all generated images and manifests.',
    only: 'Only remove one of `images` or `manifests`, but not both.',
    options: 'Clean Options',
  },
}
const contextUsage = (command = '<command>') => ({
  one: `{bold Usage:}`,
  two: `\`${context.name.toLowerCase()} {bold ${command}} [options ...]\``,
})

// config - aliases=cfhoprv

const commandConfig: ArgumentConfig<CommandArguments> = {
  command: {
    defaultOption: true,
    optional: true,
    type: String,
  },
}

const globalConfig: ArgumentConfig<GlobalArguments> = {
  config: {
    alias: 'c',
    description: context.global.config,
    optional: true,
    type: String,
  },
  help: {
    alias: 'h',
    description: context.global.help,
    optional: true,
    type: Boolean,
  },
  verbose: {
    alias: 'v',
    description: context.global.verbose,
    optional: true,
    type: Boolean,
  },
}

const generateConfig: ArgumentConfig<GenerateArguments> = {
  force: {
    alias: 'f',
    description: context.generate.force,
    optional: true,
    type: Boolean,
  },
  only: {
    alias: 'o',
    description: context.generate.only,
    optional: true,
    type: String,
  },
}

const originalsConfig: ArgumentConfig<OriginalsArguments> = {
  optimize: {
    alias: 'p',
    description: context.originals.optimize,
    optional: true,
    type: Boolean,
  },
  remove: {
    alias: 'r',
    description: context.originals.remove,
    optional: true,
    type: Boolean,
  },
  force: {
    alias: 'f',
    description: context.originals.force,
    optional: true,
    type: Boolean,
  },
}

const cleanConfig: ArgumentConfig<CleanArguments> = {
  only: {
    alias: 'o',
    description: context.clean.only,
    optional: true,
    type: String,
  },
}

const optionsConfig = { ...globalConfig } as ArgumentConfig<Options>

// help

const guides: Record<string, Record<string, Section>> = {
  global: {
    header: {
      header: context.name,
      content: [context.global.description, '', context.global.url],
    },
    usage: {
      content: [contextUsage()],
    },
    commands: {
      header: context.global.commands,
      content: [
        {
          one: `{bold generate}`,
          two: context.generate.description,
        },
        {
          one: `{bold originals}`,
          two: context.originals.description,
        },
        {
          one: `{bold clean}`,
          two: context.clean.description,
        },
        {
          one: `{bold help}`,
          two: globalConfig.help.description,
        },
      ],
    },
    options: {
      header: 'Global Options',
      optionList: Object.keys(globalConfig).map((name) => ({
        name,
        ...globalConfig[name as keyof ArgumentConfig<GlobalArguments>],
      })),
    },
  },
  generate: {
    header: {
      header: 'Generate',
      content: [
        context.generate.description,
        context.generate.details,
        '',
        context.global.url,
      ],
    },
    usage: {
      content: [contextUsage('generate')],
    },
    options: {
      header: context.generate.options,
      optionList: Object.keys(generateConfig).map((name) => ({
        name,
        ...generateConfig[name as keyof ArgumentConfig<GenerateArguments>],
      })),
    },
  },
  originals: {
    header: {
      header: 'Originals',
      content: [context.originals.description, '', context.global.url],
    },
    usage: {
      content: [contextUsage('originals')],
    },
    options: {
      header: context.originals.options,
      optionList: Object.keys(originalsConfig).map((name) => ({
        name,
        ...originalsConfig[name as keyof ArgumentConfig<OriginalsArguments>],
      })),
    },
  },
  clean: {
    header: {
      header: 'Clean',
      content: [context.clean.description, '', context.global.url],
    },
    usage: {
      content: [contextUsage('clean')],
    },
    options: {
      header: context.clean.options,
      optionList: Object.keys(cleanConfig).map((name) => ({
        name,
        ...cleanConfig[name as keyof ArgumentConfig<CleanArguments>],
      })),
    },
  },
}

// arguments

export const getArguments = () => {
  let help: Array<Section> = []

  // commands
  const getCommands = (commands?: CommandArgumentsPlus) =>
    parse<CommandArguments>(commandConfig, {
      argv: commands && commands._unknown,
      stopAtFirstUnknown: true,
    }) as CommandArgumentsPlus
  let commands = getCommands()
  let command = commands.command

  // prepare
  if (command === 'help') {
    commands = getCommands(commands)
    command = commands.command
    if (!commands._unknown) commands._unknown = []
    commands._unknown.push('--help')
  }
  if (command === 'generate') {
    Object.assign(optionsConfig, generateConfig)
    help = Object.values(guides.generate)
  }
  if (command === 'originals') {
    Object.assign(optionsConfig, originalsConfig)
    help = Object.values(guides.originals)
  }
  if (command === 'clean') {
    Object.assign(optionsConfig, cleanConfig)
    help = Object.values(guides.clean)
  }

  // options
  const options = parse<Options>(optionsConfig, {
    argv: commands._unknown || [],
  })

  // validate
  if (command === 'generate') {
    if (
      'only' in options &&
      !['images', 'manifests'].includes(options.only as string)
    )
      options.help = true
  }
  if (command === 'originals') {
    if (
      ('optimize' in options && 'remove' in options) ||
      !('optimize' in options || 'remove' in options)
    )
      options.help = true
  }
  if (command === 'clean') {
    if (
      'only' in options &&
      !['images', 'manifests'].includes(options.only as string)
    )
      options.help = true
  }

  // help
  if (!command || options.help) {
    if (help.length) help.push(guides.global.options)
    else help = Object.values(guides.global)

    console.log(usage(help))
    process.exit()
  }

  return { command, options }
}
