export type CommandArguments = {
  command?: string
}

export type GlobalArguments = {
  config?: string
  help?: boolean
  verbose?: boolean
}

export type GenerateArguments = {
  force?: boolean
  only?: string
}

export type OriginalsArguments = {
  force?: boolean
  optimize?: boolean
  remove?: boolean
}

export type CleanArguments = {
  only?: string
}

export type Options = GlobalArguments &
  (GenerateArguments | OriginalsArguments | CleanArguments)
