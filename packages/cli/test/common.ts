import { cp, mkdtemp, readFile as readFileAsync, rm } from 'node:fs/promises'
import { cwd } from 'node:process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import rrd from 'recursive-readDir-files'
import spawnAsync from 'await-spawn'
import strip from 'strip-ansi'

export type Context = {
  cwd: string
}

export const getBeforeEach =
  (filesystemDir: string) => async (context: Context) => {
    context.cwd = await mkdtemp('./.web-image-gen-test-')
    await cp(filesystemDir, context.cwd, { recursive: true })
  }

export const getAfterEach = () => async (context: Context) => {
  if (context.cwd) {
    await rm(context.cwd, { recursive: true })
    context.cwd = ''
  }
}

export const getDirTree = async (path: string) => {
  const fullPath = resolve(cwd(), path)
  const tree = (await rrd(fullPath))
    .map((file) => file.path)
    .sort()
    .join('\n')
    .replace(new RegExp(`${fullPath}/`, 'g'), '')
  return tree
}

export const getPaths = (meta: string) => {
  const rootDir = dirname(fileURLToPath(meta))
  return {
    filesystemDir: resolve(rootDir, 'fixtures/filesystem'),
    getSnapshotFile: (path: string) => (name: string) =>
      resolve(rootDir, `snapshots/cli/${path}`, `${name}.txt`),
    scriptFile: resolve(rootDir, `../dist/cli.js`),
  }
}

export const isUpdate = !!process.env['SNAPSHOT_UPDATE']

export const readFile = async (path: string) =>
  (await readFileAsync(path)).toString()

export const spawn = async (
  command: string,
  options: Array<string>,
  config?: Record<string, unknown>
) => strip((await spawnAsync(command, options, config)).toString())

if (isUpdate) console.warn('*** Updating Snapshots!!! ***')
