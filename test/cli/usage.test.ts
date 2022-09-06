import * as assert from 'uvu/assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'
import spawn from 'await-spawn'
import { suite } from 'uvu'

const update = process.env['SNAPSHOT_UPDATE']

// @ts-ignore
const dir = dirname(fileURLToPath(import.meta.url))
const script = resolve(dir, '../../dist/index.js')
const snapdir = resolve(dir, '../_snapshots/cli/usage')
const snapfile = (name: string) => resolve(snapdir, `${name}.txt`)

const test = suite('usage')

test('BARE', async () => {
  const stdout = await spawn(process.execPath, [script])
  if (update) await writeFile(snapfile('bare'), stdout.toString())
  const snapshot = await readFile(snapfile('bare'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  // help
  const help = await spawn(process.execPath, [script, 'help'])
  assert.snapshot(help.toString(), snapshot.toString())

  // --help
  const __help = await spawn(process.execPath, [script, '--help'])
  assert.snapshot(__help.toString(), snapshot.toString())
})

test('generate', async () => {
  // help
  // const help = await spawn(process.execPath, [script, 'help', 'generate'])

  // --help
  const __help = await spawn(process.execPath, [script, 'generate', '--help'])
  if (update) await writeFile(snapfile('generate'), __help.toString())
  const snapshot = await readFile(snapfile('generate'))
  assert.snapshot(__help.toString(), snapshot.toString())

  // --only
  const __only = await spawn(process.execPath, [script, 'generate', '--only'])
  assert.snapshot(__only.toString(), snapshot.toString())

  // --only invalid
  const __onlyInvalid = await spawn(process.execPath, [
    script,
    'generate',
    '--only invalid',
  ])
  assert.snapshot(__onlyInvalid.toString(), snapshot.toString())
})

test('originals', async () => {
  const bare = await spawn(process.execPath, [script, 'originals'])
  if (update) await writeFile(snapfile('originals'), bare.toString())
  const snapshot = await readFile(snapfile('originals'))
  assert.snapshot(bare.toString(), snapshot.toString())

  // help
  // const help = await spawn(process.execPath, [script, 'help', 'originals'])

  // --help
  const __help = await spawn(process.execPath, [script, 'originals', '--help'])
  assert.snapshot(__help.toString(), snapshot.toString())

  // --optimize --remove
  const __optimize__remove = await spawn(process.execPath, [
    script,
    'originals',
    '--optimize',
    '--remove',
  ])
  assert.snapshot(__optimize__remove.toString(), snapshot.toString())
})

test('clean', async () => {
  // help
  // const help = await spawn(process.execPath, [script, 'help', 'clean'])

  // --help
  const __help = await spawn(process.execPath, [script, 'clean', '--help'])
  if (update) await writeFile(snapfile('clean'), __help.toString())
  const snapshot = await readFile(snapfile('clean'))
  assert.snapshot(__help.toString(), snapshot.toString())
})

test.run()
