import type { ArgumentConfig } from 'ts-command-line-args'
import type {
  CommandArguments,
  GlobalArguments,
  GenerateArguments,
  OriginalsArguments,
  CleanArguments,
  Options,
} from '../types/Arguments'
import type { Section } from 'command-line-usage'

import { parse } from 'ts-command-line-args'
import usage from 'command-line-usage'

// meta

const meta = {
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
const metaUsage = (command = '<command>') => ({
  one: `{bold Usage:}`,
  two: `\`${meta.name.toLowerCase()} {bold ${command}} [options ...]\``,
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
    description: meta.global.config,
    optional: true,
    type: String,
  },
  help: {
    alias: 'h',
    description: meta.global.help,
    optional: true,
    type: Boolean,
  },
  verbose: {
    alias: 'v',
    description: meta.global.verbose,
    optional: true,
    type: Boolean,
  },
}

const generateConfig: ArgumentConfig<GenerateArguments> = {
  force: {
    alias: 'f',
    description: meta.generate.force,
    optional: true,
    type: Boolean,
  },
  only: {
    alias: 'o',
    description: meta.generate.only,
    optional: true,
    type: String,
  },
}

const originalsConfig: ArgumentConfig<OriginalsArguments> = {
  optimize: {
    alias: 'p',
    description: meta.originals.optimize,
    optional: true,
    type: Boolean,
  },
  remove: {
    alias: 'r',
    description: meta.originals.remove,
    optional: true,
    type: Boolean,
  },
  force: {
    alias: 'f',
    description: meta.originals.force,
    optional: true,
    type: Boolean,
  },
}

const cleanConfig: ArgumentConfig<CleanArguments> = {
  only: {
    alias: 'o',
    description: meta.clean.only,
    optional: true,
    type: String,
  },
}

const optionsConfig = { ...globalConfig } as ArgumentConfig<Options>

// help

const guides: Record<string, Record<string, Section>> = {
  global: {
    header: {
      header: meta.name,
      content: [meta.global.description, '', meta.global.url],
    },
    usage: {
      content: [metaUsage()],
    },
    commands: {
      header: meta.global.commands,
      content: [
        {
          one: `{bold generate}`,
          two: meta.generate.description,
        },
        {
          one: `{bold originals}`,
          two: meta.originals.description,
        },
        {
          one: `{bold clean}`,
          two: meta.clean.description,
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
        // @ts-ignore
        ...globalConfig[name],
      })),
    },
  },
  generate: {
    header: {
      header: 'Generate',
      content: [
        meta.generate.description,
        meta.generate.details,
        '',
        meta.global.url,
      ],
    },
    usage: {
      content: [metaUsage('generate')],
    },
    options: {
      header: meta.generate.options,
      optionList: Object.keys(generateConfig).map((name) => ({
        name,
        // @ts-ignore
        ...generateConfig[name],
      })),
    },
  },
  originals: {
    header: {
      header: 'Originals',
      content: [meta.originals.description, '', meta.global.url],
    },
    usage: {
      content: [metaUsage('originals')],
    },
    options: {
      header: meta.originals.options,
      optionList: Object.keys(originalsConfig).map((name) => ({
        name,
        // @ts-ignore
        ...originalsConfig[name],
      })),
    },
  },
  clean: {
    header: {
      header: 'Clean',
      content: [meta.clean.description, '', meta.global.url],
    },
    usage: {
      content: [metaUsage('clean')],
    },
    options: {
      header: meta.clean.options,
      optionList: Object.keys(cleanConfig).map((name) => ({
        name,
        // @ts-ignore
        ...cleanConfig[name],
      })),
    },
  },
}

// CLI

export default () => {
  let help: Array<Section> = []

  // commands
  const getCommands = (commands?: CommandArguments) =>
    parse<CommandArguments>(commandConfig, {
      // @ts-ignore
      argv: commands && commands._unknown,
      stopAtFirstUnknown: true,
    })
  let commands = getCommands()
  let command = commands.command

  // prepare
  if (command === 'help') {
    commands = getCommands(commands)
    command = commands.command
    // @ts-ignore
    if (!commands._unknown) commands._unknown = []
    // @ts-ignore
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
    // @ts-ignore
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
