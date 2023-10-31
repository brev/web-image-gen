import { Context } from './common.js'

import * as assert from 'uvu/assert'
import { execPath } from 'node:process'
import {
  getAfterEach,
  getBeforeEach,
  getDirTree,
  getPaths,
  isUpdate,
  readFile,
  spawn,
} from './common.js'
import { stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { suite } from 'uvu'

const { filesystemDir, getSnapshotFile, scriptFile } = getPaths(import.meta.url)
const snapshotFile = getSnapshotFile('originals')
const originals = [
  'static/images/countries/france.jpg',
  'static/images/countries/italy.jpg',
  'static/images/fruits/apple.jpg',
  'static/images/fruits/pear.jpg',
]

const test = suite<Context>('originals', { cwd: '' })

test.before.each(getBeforeEach(filesystemDir))
test.after.each(getAfterEach())

test('--optimize', async ({ cwd }) => {
  const sizeBefore = (
    await Promise.all(originals.map((original) => stat(resolve(cwd, original))))
  )
    .map((context) => context.size)
    .reduce((prev, curr) => prev + curr, 0)

  const stdout = await spawn(
    execPath,
    [scriptFile, 'originals', '--optimize'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('optimize'), stdout)
  const snapshot = await readFile(snapshotFile('optimize'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('optimize_tree'), tree)
  const snaptree = await readFile(snapshotFile('optimize_tree'))
  assert.snapshot(tree, snaptree)

  const sizeAfter = (
    await Promise.all(originals.map((original) => stat(resolve(cwd, original))))
  )
    .map((context) => context.size)
    .reduce((prev, curr) => prev + curr, 0)
  assert.ok(
    sizeAfter < sizeBefore,
    'optimized images should be smaller than unoptimized'
  )

  // run twice to make sure not getting any smaller after 5% min
  await spawn(execPath, [scriptFile, 'originals', '--optimize'], { cwd })

  const sizeAgain = (
    await Promise.all(originals.map((original) => stat(resolve(cwd, original))))
  )
    .map((context) => context.size)
    .reduce((prev, curr) => prev + curr, 0)
  assert.ok(
    sizeAgain === sizeAfter,
    'twice-optimized images should not be smaller than single-optimized'
  )
})

test('--optimize --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'originals', '--optimize', '--verbose'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('optimize_verbose'), stdout)
  const snapshot = await readFile(snapshotFile('optimize_verbose'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('optimize_verbose_tree'), tree)
  const snaptree = await readFile(snapshotFile('optimize_verbose_tree'))
  assert.snapshot(tree, snaptree)
})

test('--remove', async ({ cwd }) => {
  const stdout = await spawn(
    `echo 'y' | ${execPath} ${scriptFile} originals --remove`,
    [],
    { cwd, shell: true }
  )
  if (isUpdate) await writeFile(snapshotFile('remove'), stdout)
  const snapshot = await readFile(snapshotFile('remove'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('remove_tree'), tree)
  const snaptree = await readFile(snapshotFile('remove_tree'))
  assert.snapshot(tree, snaptree)
})

test('--remove --force', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'originals', '--remove', '--force'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('remove_force'), stdout)
  const snapshot = await readFile(snapshotFile('remove_force'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('remove_force_tree'), tree)
  const snaptree = await readFile(snapshotFile('remove_force_tree'))
  assert.snapshot(tree, snaptree)
})

test('--remove --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    `echo 'y' | ${execPath} ${scriptFile} originals --remove --verbose`,
    [],
    { cwd, shell: true }
  )
  if (isUpdate) await writeFile(snapshotFile('remove_verbose'), stdout)
  const snapshot = await readFile(snapshotFile('remove_verbose'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('remove_verbose_tree'), tree)
  const snaptree = await readFile(snapshotFile('remove_verbose_tree'))
  assert.snapshot(tree, snaptree)

  // answer no to prompt
  const nope = await spawn(
    `echo 'n' | ${execPath} ${scriptFile} originals --remove --verbose`,
    [],
    { cwd, shell: true }
  )
  assert.equal(
    nope,
    'Using default config...\nRemove original source images? Are you sure? [y/N]: '
  )
})

test('--remove --force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'originals', '--remove', '--force', '--verbose'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('remove_force_verbose'), stdout)
  const snapshot = await readFile(snapshotFile('remove_force_verbose'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('remove_force_verbose_tree'), tree)
  const snaptree = await readFile(snapshotFile('remove_force_verbose_tree'))
  assert.snapshot(tree, snaptree)
})

test.run()
