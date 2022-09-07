import { cp, mkdtemp, rm } from 'node:fs/promises'
import { cwd } from 'node:process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import rrd from 'recursive-readDir-files'

export type Context = {
  cwd?: string
}

export const getBeforeEach =
  (filesystemDir: string) => async (context: Context) => {
    context.cwd = await mkdtemp('./.sveltekit-imagegen-test-')
    await cp(filesystemDir, context.cwd, { recursive: true })
  }

export const getAfterEach = () => async (context: Context) => {
  await rm(context.cwd, { recursive: true })
  delete context.cwd
}

export const getDirTree = async (path: string) => {
  const fullPath = resolve(cwd(), path)
  const tree = (await rrd(fullPath))
    .map((file) => file.path)
    .sort()
    .join('\n')
    .replace(new RegExp(`${fullPath}/`, 'g'), '')
  return { toString: () => tree }
}

export const getPaths = (meta: string) => {
  const rootDir = dirname(fileURLToPath(meta))
  return {
    filesystemDir: resolve(rootDir, '../_fixtures/filesystem'),
    getSnapshotFile: (path: string) => (name: string) =>
      resolve(rootDir, `../_snapshots/cli/${path}`, `${name}.txt`),
    scriptFile: resolve(rootDir, '../../dist/index.js'),
  }
}

export const isUpdate = !!process.env['SNAPSHOT_UPDATE']

if (isUpdate) console.warn('*** Updating Snapshots!!! ***')
