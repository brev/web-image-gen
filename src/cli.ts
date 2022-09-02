import type { ArgumentConfig } from 'ts-command-line-args'
import type {
  CommandArguments,
  GenerateArguments,
  GlobalArguments,
  IndividualArguments,
  OriginalsArguments,
} from '../types/Arguments'
import type { Section } from 'command-line-usage'

import { parse } from 'ts-command-line-args'
import usage from 'command-line-usage'

// meta

const meta = {
  name: 'SvelteKit-ImageGen',
  global: {
    commands: 'Available Commands',
    config:
      'Config file to use instead of the default, in `.js` or `.json` format.',
    description: `Modern responsive image generation tooling for SvelteKit.\n
                  https://github.com/brev/sveltekit-imagegen`,
    help: 'Show this usage help guide, or help for a specific command.',
    options: 'Global Options',
    verbose: 'Display debugging output.',
  },
  generate: {
    description: 'Generate responsive images and importable code manifests.',
    force: 'Always write new files, even if they already exist.',
    only: 'Only create one of `images` or `manifests`, but not both.',
    options: 'Generate Options',
  },
  originals: {
    description: 'Perform helpful operations on original source images.',
    force: 'Bypass confirmation prompt when using `--remove` option.',
    optimize:
      'Minimize size of original source images without reducing quality.',
    options: 'Originals Options',
    remove:
      'Remove original source images (shrink size of production release package).',
  },
}
const metaUsage = (command = '<command>') => ({
  one: `{bold Usage:}`,
  two: `\`${meta.name.toLowerCase()} {bold ${command}} [options ...]\``,
})

// config

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
    description: meta.generate.force,
    optional: true,
    type: Boolean,
  },
  only: {
    description: meta.generate.only,
    optional: true,
    type: String,
  },
}

const originalsConfig: ArgumentConfig<OriginalsArguments> = {
  force: {
    description: meta.originals.force,
    optional: true,
    type: Boolean,
  },
  optimize: {
    description: meta.originals.optimize,
    optional: true,
    type: Boolean,
  },
  remove: {
    description: meta.originals.remove,
    optional: true,
    type: Boolean,
  },
}

const optionsConfig = { ...globalConfig } as ArgumentConfig<IndividualArguments>

// help

const guides: Record<string, Record<string, Section>> = {
  global: {
    header: {
      header: meta.name,
      content: meta.global.description,
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
      content: meta.generate.description,
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
      content: meta.originals.description,
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
}

// cli

export default () => {
  let help: Array<Section> = []

  // commands
  const commands = parse<CommandArguments>(commandConfig, {
    stopAtFirstUnknown: true,
  })
  const { command } = commands

  // prepare
  if (command === 'generate') {
    Object.assign(optionsConfig, generateConfig)
    help = Object.values(guides.generate)
  }
  if (command === 'originals') {
    Object.assign(optionsConfig, originalsConfig)
    help = Object.values(guides.originals)
  }

  // options
  const options = parse<IndividualArguments>(optionsConfig, {
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

  // help
  if (!command || command === 'help' || options.help) {
    if (help.length) help.push(guides.global.options)
    else help = Object.values(guides.global)

    console.log(usage(help))
    process.exit()
  }

  return { command, options }
}
