import * as assert from 'uvu/assert'
import { execPath } from 'node:process'
import { getPaths, isUpdate } from './common.js'
import { readFile, writeFile } from 'node:fs/promises'
import spawn from 'await-spawn'
import { suite } from 'uvu'

// @ts-ignore
const { getSnapshotFile, scriptFile } = getPaths(import.meta.url)
const snapshotFile = getSnapshotFile('usage')

const test = suite('usage')

test('BARE', async () => {
  const stdout = await spawn(execPath, [scriptFile])
  if (isUpdate) await writeFile(snapshotFile('bare'), stdout.toString())
  const snapshot = await readFile(snapshotFile('bare'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  // help
  const help = await spawn(execPath, [scriptFile, 'help'])
  assert.snapshot(help.toString(), snapshot.toString())

  // --help
  const __help = await spawn(execPath, [scriptFile, '--help'])
  assert.snapshot(__help.toString(), snapshot.toString())
})

test('generate', async () => {
  // help
  const help = await spawn(execPath, [scriptFile, 'help', 'generate'])
  if (isUpdate) await writeFile(snapshotFile('generate'), help.toString())
  const snapshot = await readFile(snapshotFile('generate'))
  assert.snapshot(help.toString(), snapshot.toString())

  // --help
  const __help = await spawn(execPath, [scriptFile, 'generate', '--help'])
  assert.snapshot(__help.toString(), snapshot.toString())

  // --only
  const __only = await spawn(execPath, [scriptFile, 'generate', '--only'])
  assert.snapshot(__only.toString(), snapshot.toString())

  // --only invalid
  const __onlyInvalid = await spawn(execPath, [
    scriptFile,
    'generate',
    '--only invalid',
  ])
  assert.snapshot(__onlyInvalid.toString(), snapshot.toString())
})

test('originals', async () => {
  const bare = await spawn(execPath, [scriptFile, 'originals'])
  if (isUpdate) await writeFile(snapshotFile('originals'), bare.toString())
  const snapshot = await readFile(snapshotFile('originals'))
  assert.snapshot(bare.toString(), snapshot.toString())

  // help
  const help = await spawn(execPath, [scriptFile, 'help', 'originals'])
  assert.snapshot(help.toString(), snapshot.toString())

  // --help
  const __help = await spawn(execPath, [scriptFile, 'originals', '--help'])
  assert.snapshot(__help.toString(), snapshot.toString())

  // --optimize --remove
  const __optimize__remove = await spawn(execPath, [
    scriptFile,
    'originals',
    '--optimize',
    '--remove',
  ])
  assert.snapshot(__optimize__remove.toString(), snapshot.toString())
})

test('clean', async () => {
  // help
  const help = await spawn(execPath, [scriptFile, 'help', 'clean'])
  if (isUpdate) await writeFile(snapshotFile('clean'), help.toString())
  const snapshot = await readFile(snapshotFile('clean'))
  assert.snapshot(help.toString(), snapshot.toString())

  // --help
  const __help = await spawn(execPath, [scriptFile, 'clean', '--help'])
  assert.snapshot(__help.toString(), snapshot.toString())

  // --only
  const __only = await spawn(execPath, [scriptFile, 'clean', '--only'])
  assert.snapshot(__only.toString(), snapshot.toString())

  // --only invalid
  const __onlyInvalid = await spawn(execPath, [
    scriptFile,
    'clean',
    '--only invalid',
  ])
  assert.snapshot(__onlyInvalid.toString(), snapshot.toString())
})

test.run()
