import * as assert from 'uvu/assert'
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import spawn from 'await-spawn'
import { suite } from 'uvu'

// @ts-ignore
const dir = dirname(fileURLToPath(import.meta.url))
const fsdir = resolve(dir, '../_fixtures/filesystem')
const script = resolve(dir, '../../dist/index.js')
const snapdir = resolve(dir, '../_snapshots/cli/clean')
const snapfile = (name: string) => resolve(snapdir, `${name}.txt`)
const update = process.env['SNAPSHOT_UPDATE']

const test = suite('clean')

test.before.each(async (context) => {
  context.cwd = await mkdtemp('./.sveltekit-imagegen-test-')
  await cp(fsdir, context.cwd, { recursive: true })
})

test.after.each(async (context) => {
  await rm(context.cwd, { recursive: true })
  delete context.cwd
})

test('BARE', async ({ cwd }) => {
  await spawn(process.execPath, [script, 'generate'], { cwd })

  const stdout = await spawn(process.execPath, [script, 'clean'], { cwd })
  if (update) await writeFile(snapfile('bare'), stdout.toString())
  const snapshot = await readFile(snapfile('bare'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('bare_tree'), tree.toString())
  const snaptree = await readFile(snapfile('bare_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--verbose', async ({ cwd }) => {
  await spawn(process.execPath, [script, 'generate'], { cwd })

  const stdout = await spawn(
    process.execPath,
    [script, 'clean', '--verbose'],
    { cwd }
  )
  if (update) await writeFile(snapfile('verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update)
    await writeFile(snapfile('verbose_tree'), tree.toString())
  const snaptree = await readFile(snapfile('verbose_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test.run()
