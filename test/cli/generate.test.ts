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
const snapdir = resolve(dir, './snapshots/generate')
const snapfile = (name: string) => resolve(snapdir, `${name}.txt`)

const test = suite('generate')

// TODO: build all, some, none

test('BARE', async () => {
  const stdout = await spawn(process.execPath, [script, 'generate'])
  if (update) await writeFile(snapfile('bare'), stdout.toString())
  const snapshot = await readFile(snapfile('bare'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--force', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--force']
  )
  if (update) await writeFile(snapfile('force'), stdout.toString())
  const snapshot = await readFile(snapfile('force'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--verbose', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--verbose']
  )
  if (update) await writeFile(snapfile('verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--force --verbose', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--force', '--verbose']
  )
  if (update) await writeFile(snapfile('force_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('force_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=images', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=images']
  )
  if (update) await writeFile(snapfile('only_images'), stdout.toString())
  const snapshot = await readFile(snapfile('only_images'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=images --force', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=images', '--force']
  )
  if (update) await writeFile(snapfile('only_images_force'), stdout.toString())
  const snapshot = await readFile(snapfile('only_images_force'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=images --verbose', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=images', '--verbose']
  )
  if (update) await writeFile(snapfile('only_images_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('only_images_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=images --force --verbose', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=images', '--force', '--verbose']
  )
  if (update) await writeFile(snapfile('only_images_force_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('only_images_force_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=manifests', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=manifests']
  )
  if (update) await writeFile(snapfile('only_manifests'), stdout.toString())
  const snapshot = await readFile(snapfile('only_manifests'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=manifests --force', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=manifests', '--force']
  )
  if (update) await writeFile(snapfile('only_manifests_force'), stdout.toString())
  const snapshot = await readFile(snapfile('only_manifests_force'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=manifests --verbose', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=manifests', '--verbose']
  )
  if (update) await writeFile(snapfile('only_manifests_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('only_manifests_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=manifests --force --verbose', async () => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=manifests', '--force', '--verbose']
  )
  if (update) await writeFile(snapfile('only_manifests_force_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('only_manifests_force_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test.run()
