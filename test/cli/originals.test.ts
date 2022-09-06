import * as assert from 'uvu/assert'
import { cp, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import spawn from 'await-spawn'
import { suite } from 'uvu'

// @ts-ignore
const dir = dirname(fileURLToPath(import.meta.url))
const fsdir = resolve(dir, '../_fixtures/filesystem')
const script = resolve(dir, '../../dist/index.js')
const snapdir = resolve(dir, '../_snapshots/cli/originals')
const snapfile = (name: string) => resolve(snapdir, `${name}.txt`)
const update = process.env['SNAPSHOT_UPDATE']
const originals = [
  'static/images/countries/france.jpg',
  'static/images/countries/italy.jpg',
  'static/images/fruits/apple.jpg',
  'static/images/fruits/pear.jpg',
]

const test = suite('originals')

test.before.each(async (context) => {
  context.cwd = await mkdtemp('./.sveltekit-imagegen-test-')
  await cp(fsdir, context.cwd, { recursive: true })
})

test.after.each(async (context) => {
  await rm(context.cwd, { recursive: true })
  delete context.cwd
})

test('--optimize', async ({ cwd }) => {
  const sizeBefore = (await Promise.all(
    originals.map((original) => stat(resolve(cwd, original)))
  )).map((meta) => meta.size)
    .reduce((prev, curr) => (prev + curr), 0)

  const stdout = await spawn(
    process.execPath,
    [script, 'originals', '--optimize'],
    { cwd }
  )
  if (update) await writeFile(snapfile('optimize'), stdout.toString())
  const snapshot = await readFile(snapfile('optimize'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('optimize_tree'), tree.toString())
  const snaptree = await readFile(snapfile('optimize_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())

  const sizeAfter = (await Promise.all(
    originals.map((original) => stat(resolve(cwd, original)))
  )).map((meta) => meta.size)
    .reduce((prev, curr) => (prev + curr), 0)
  assert.ok(
    sizeAfter < sizeBefore,
    'optimized images should be smaller than unoptimized'
  )

  // run twice to make sure not getting any smaller after 5% min
  await spawn(
    process.execPath,
    [script, 'originals', '--optimize'],
    { cwd }
  )

  const sizeAgain = (await Promise.all(
    originals.map((original) => stat(resolve(cwd, original)))
  )).map((meta) => meta.size)
    .reduce((prev, curr) => (prev + curr), 0)
  assert.ok(
    sizeAgain === sizeAfter,
    'twice-optimized images should not be smaller than single-optimized'
  )
})

test('--optimize --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'originals', '--optimize', '--verbose'],
    { cwd }
  )
  if (update) await writeFile(snapfile('optimize_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('optimize_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update)
    await writeFile(snapfile('optimize_verbose_tree'), tree.toString())
  const snaptree = await readFile(snapfile('optimize_verbose_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--remove', async ({ cwd }) => {
  const stdout = await spawn(
    `echo 'y' | ${process.execPath} ${script} originals --remove`,
    { cwd, shell: true }
  )
  if (update) await writeFile(snapfile('remove'), stdout.toString())
  const snapshot = await readFile(snapfile('remove'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('remove_tree'), tree.toString())
  const snaptree = await readFile(snapfile('remove_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--remove --force', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'originals', '--remove', '--force'],
    { cwd }
  )
  if (update) await writeFile(snapfile('remove_force'), stdout.toString())
  const snapshot = await readFile(snapfile('remove_force'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('remove_force_tree'), tree.toString())
  const snaptree = await readFile(snapfile('remove_force_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--remove --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    `echo 'y' | ${process.execPath} ${script} originals --remove --verbose`,
    { cwd, shell: true }
  )
  if (update) await writeFile(snapfile('remove_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('remove_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('remove_verbose_tree'), tree.toString())
  const snaptree = await readFile(snapfile('remove_verbose_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())

  // answer no to prompt
  const nope = await spawn(
    `echo 'n' | ${process.execPath} ${script} originals --remove --verbose`,
    { cwd, shell: true }
  )
  assert.equal(
    nope.toString(),
    'Using default config...\nRemove original source images? Are you sure? [y/N]: '
  )
})

test('--remove --force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'originals', '--remove', '--force', '--verbose'],
    { cwd }
  )
  if (update)
    await writeFile(snapfile('remove_force_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('remove_force_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update)
    await writeFile(snapfile('remove_force_verbose_tree'), tree.toString())
  const snaptree = await readFile(snapfile('remove_force_verbose_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test.run()
