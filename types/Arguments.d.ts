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

export type IndividualArguments = GlobalArguments &
  (GenerateArguments | OriginalsArguments)
