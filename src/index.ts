import config from './config.js'
import generate from './generate.js'

export { generate }

// CLI: verbose, help

await generate(config)
