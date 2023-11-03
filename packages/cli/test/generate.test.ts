import type { Context } from './testing.ts'

import * as assert from 'uvu/assert'
import { cp, rm, writeFile } from 'node:fs/promises'
import { execPath } from 'node:process'
import {
  getAfterEach,
  getBeforeEach,
  getDirTree,
  getPaths,
  isUpdate,
  readFile,
  spawn,
} from './testing.js'
import { resolve } from 'node:path'
import { suite } from 'uvu'

const { filesystemDir, getSnapshotFile, scriptFile } = getPaths(import.meta.url)
const snapshotFile = getSnapshotFile('generate')

const test = suite<Context>('generate', { cwd: '' })

test.before.each(getBeforeEach(filesystemDir))
test.after.each(getAfterEach())

test('BARE', async ({ cwd }) => {
  const stdout = await spawn(execPath, [scriptFile, 'generate'], { cwd })
  if (isUpdate) await writeFile(snapshotFile('bare'), stdout)
  const snapshot = await readFile(snapshotFile('bare'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('bare_tree'), tree)
  const snaptree = await readFile(snapshotFile('bare_tree'))
  assert.snapshot(tree, snaptree)

  const manifest = JSON.parse(
    await readFile(resolve(cwd, 'src/lib/assets/images/_gen/countries.json'))
  )
  assert.ok(manifest.france)
  assert.ok(manifest.france.meta)
  assert.ok(manifest.france.meta.author)
  assert.ok(manifest.france.meta.authorLink)
  assert.ok(manifest.france.meta.license)
  assert.ok(manifest.france.meta.licenseLink)
  assert.ok(manifest.france.meta.link)
  assert.ok(manifest.france.meta.title)
  assert.ok(manifest.france.default)
  assert.ok(manifest.france.formats)
  assert.ok(manifest.france.formats.avif)
  assert.ok(manifest.france.formats.avif['400'])
  assert.ok(manifest.france.formats.avif['800'])
  assert.ok(manifest.france.formats.webp)
  assert.ok(manifest.france.formats.webp['400'])
  assert.ok(manifest.france.formats.webp['800'])
  assert.ok(manifest.france.formats.jpg)
  assert.ok(manifest.france.formats.jpg['400'])
  assert.ok(manifest.france.formats.jpg['800'])
  assert.ok(manifest.france.placeholder)
  assert.ok(manifest.france.sizes)
  assert.ok(manifest.france.sizes['400'])
  assert.ok(manifest.france.sizes['400'].avif)
  assert.ok(manifest.france.sizes['400'].webp)
  assert.ok(manifest.france.sizes['400'].jpg)
  assert.ok(manifest.france.sizes['800'])
  assert.ok(manifest.france.sizes['800'].avif)
  assert.ok(manifest.france.sizes['800'].webp)
  assert.ok(manifest.france.sizes['800'].jpg)
})

test('BARE (no metadata)', async ({ cwd }) => {
  await rm(resolve(cwd, 'static/images/countries/france.json'))

  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const manifest = JSON.parse(
    await readFile(resolve(cwd, 'src/lib/assets/images/_gen/countries.json'))
  )
  assert.ok(manifest.france)
  assert.not.ok(manifest.france.meta)
  assert.ok(manifest.france.default)
  assert.ok(manifest.france.formats)
  assert.ok(manifest.france.formats.avif)
  assert.ok(manifest.france.formats.avif['400'])
  assert.ok(manifest.france.formats.avif['800'])
  assert.ok(manifest.france.formats.webp)
  assert.ok(manifest.france.formats.webp['400'])
  assert.ok(manifest.france.formats.webp['800'])
  assert.ok(manifest.france.formats.jpg)
  assert.ok(manifest.france.formats.jpg['400'])
  assert.ok(manifest.france.formats.jpg['800'])
  assert.ok(manifest.france.placeholder)
  assert.ok(manifest.france.sizes)
  assert.ok(manifest.france.sizes['400'])
  assert.ok(manifest.france.sizes['400'].avif)
  assert.ok(manifest.france.sizes['400'].webp)
  assert.ok(manifest.france.sizes['400'].jpg)
  assert.ok(manifest.france.sizes['800'])
  assert.ok(manifest.france.sizes['800'].avif)
  assert.ok(manifest.france.sizes['800'].webp)
  assert.ok(manifest.france.sizes['800'].jpg)
})

test('--force', async ({ cwd }) => {
  const stdout = await spawn(execPath, [scriptFile, 'generate', '--force'], {
    cwd,
  })
  if (isUpdate) await writeFile(snapshotFile('force'), stdout)
  const snapshot = await readFile(snapshotFile('force'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('force_tree'), tree)
  const snaptree = await readFile(snapshotFile('force_tree'))
  assert.snapshot(tree, snaptree)
})

test('--force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--force', '--verbose'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('force_verbose'), stdout)
  const snapshot = await readFile(snapshotFile('force_verbose'))
  assert.snapshot(stdout, snapshot)
})

test('--verbose', async ({ cwd }) => {
  const stdout = await spawn(execPath, [scriptFile, 'generate', '--verbose'], {
    cwd,
  })
  if (isUpdate) await writeFile(snapshotFile('verbose'), stdout)
  const snapshot = await readFile(snapshotFile('verbose'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('verbose_tree'), tree)
  const snaptree = await readFile(snapshotFile('verbose_tree'))
  assert.snapshot(tree, snaptree)
})

test('--verbose (config js)', async ({ cwd }) => {
  await cp(
    resolve(filesystemDir, '../config/configfile.js'),
    resolve(cwd, '.web-image-gen.js')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(execPath, [scriptFile, 'generate', '--verbose'], {
    cwd,
  })
  if (isUpdate) await writeFile(snapshotFile('verbose_js'), stdout)
  const snapshot = await readFile(snapshotFile('verbose_js'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('verbose_js_tree'), tree)
  const snaptree = await readFile(snapshotFile('verbose_js_tree'))
  assert.snapshot(tree, snaptree)

  const manifest = (
    await import(resolve(cwd, 'src/lib/assets/images/NEG/countries.ts'))
  ).default
  assert.ok(manifest.france)
  assert.ok(manifest.france.default)
  assert.ok(manifest.france.formats)
  assert.ok(manifest.france.formats.webp)
  assert.ok(manifest.france.formats.webp['480'])
  assert.ok(manifest.france.formats.webp['640'])
  assert.ok(manifest.france.formats.webp['720'])
  assert.ok(manifest.france.formats.png)
  assert.ok(manifest.france.formats.png['480'])
  assert.ok(manifest.france.formats.png['640'])
  assert.ok(manifest.france.formats.png['720'])
  assert.ok(manifest.france.meta)
  assert.ok(manifest.france.meta.author)
  assert.ok(manifest.france.meta.authorLink)
  assert.ok(manifest.france.meta.license)
  assert.ok(manifest.france.meta.licenseLink)
  assert.ok(manifest.france.meta.link)
  assert.ok(manifest.france.meta.title)
  assert.ok(manifest.france.placeholder)
  assert.ok(manifest.france.sizes)
  assert.ok(manifest.france.sizes['480'])
  assert.ok(manifest.france.sizes['480'].webp)
  assert.ok(manifest.france.sizes['480'].png)
  assert.ok(manifest.france.sizes['640'])
  assert.ok(manifest.france.sizes['640'].webp)
  assert.ok(manifest.france.sizes['640'].png)
  assert.ok(manifest.france.sizes['720'])
  assert.ok(manifest.france.sizes['720'].webp)
  assert.ok(manifest.france.sizes['720'].png)
})

test('--verbose (config json)', async ({ cwd }) => {
  await cp(
    resolve(filesystemDir, '../config/configfile.json'),
    resolve(cwd, '.web-image-gen.json')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(execPath, [scriptFile, 'generate', '--verbose'], {
    cwd,
  })
  if (isUpdate) await writeFile(snapshotFile('verbose_json'), stdout)
  const snapshot = await readFile(snapshotFile('verbose_json'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('verbose_json_tree'), tree)
  const snaptree = await readFile(snapshotFile('verbose_json_tree'))
  assert.snapshot(tree, snaptree)
})

test('--verbose --config (js)', async ({ cwd }) => {
  await cp(
    resolve(filesystemDir, '../config/configfile.js'),
    resolve(cwd, 'configfile.js')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(
    `${execPath} ${scriptFile} generate --config=configfile.js --verbose`,
    [],
    { cwd, shell: true }
  )
  if (isUpdate) await writeFile(snapshotFile('verbose_config_js'), stdout)
  const snapshot = await readFile(snapshotFile('verbose_config_js'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('verbose_config_js_tree'), tree)
  const snaptree = await readFile(snapshotFile('verbose_config_js_tree'))
  assert.snapshot(tree, snaptree)
})

test('--verbose --config (json)', async ({ cwd }) => {
  await cp(
    resolve(filesystemDir, '../config/configfile.json'),
    resolve(cwd, 'configfile.json')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(
    `${execPath} ${scriptFile} generate --config=configfile.json --verbose`,
    [],
    { cwd, shell: true }
  )
  if (isUpdate) await writeFile(snapshotFile('verbose_config_json'), stdout)
  const snapshot = await readFile(snapshotFile('verbose_config_json'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('verbose_config_json_tree'), tree)
  const snaptree = await readFile(snapshotFile('verbose_config_json_tree'))
  assert.snapshot(tree, snaptree)
})

test('--only=images', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=images'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('only_images'), stdout)
  const snapshot = await readFile(snapshotFile('only_images'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('only_images_tree'), tree)
  const snaptree = await readFile(snapshotFile('only_images_tree'))
  assert.snapshot(tree, snaptree)
})

test('--only=images --force', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=images', '--force'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('only_images_force'), stdout)
  const snapshot = await readFile(snapshotFile('only_images_force'))
  assert.snapshot(stdout, snapshot)
})

test('--only=images --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=images', '--verbose'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('only_images_verbose'), stdout)
  const snapshot = await readFile(snapshotFile('only_images_verbose'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('only_images_verbose_tree'), tree)
  const snaptree = await readFile(snapshotFile('only_images_verbose_tree'))
  assert.snapshot(tree, snaptree)
})

test('--only=images --force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=images', '--force', '--verbose'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(snapshotFile('only_images_force_verbose'), stdout)
  const snapshot = await readFile(snapshotFile('only_images_force_verbose'))
  assert.snapshot(stdout, snapshot)
})

test('--only=manifests', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=manifests'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('only_manifests'), stdout)
  const snapshot = await readFile(snapshotFile('only_manifests'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('only_manifests_tree'), tree)
  const snaptree = await readFile(snapshotFile('only_manifests_tree'))
  assert.snapshot(tree, snaptree)
})

test('--only=manifests --force', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=manifests', '--force'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('only_manifests_force'), stdout)
  const snapshot = await readFile(snapshotFile('only_manifests_force'))
  assert.snapshot(stdout, snapshot)
})

test('--only=manifests --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=manifests', '--verbose'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('only_manifests_verbose'), stdout)
  const snapshot = await readFile(snapshotFile('only_manifests_verbose'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(snapshotFile('only_manifests_verbose_tree'), tree)
  const snaptree = await readFile(snapshotFile('only_manifests_verbose_tree'))
  assert.snapshot(tree, snaptree)
})

test('--only=manifests --verbose (mkdir)', async ({ cwd }) => {
  await rm(resolve(cwd, 'src/lib/assets/images/_gen'), { recursive: true })

  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=manifests', '--verbose'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(snapshotFile('only_manifests_verbose_mkdir'), stdout)
  const snapshot = await readFile(snapshotFile('only_manifests_verbose_mkdir'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(snapshotFile('only_manifests_verbose_mkdir_tree'), tree)
  const snaptree = await readFile(
    snapshotFile('only_manifests_verbose_mkdir_tree')
  )
  assert.snapshot(tree, snaptree)
})

test('--only=manifests --force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=manifests', '--force', '--verbose'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(snapshotFile('only_manifests_force_verbose'), stdout)
  const snapshot = await readFile(snapshotFile('only_manifests_force_verbose'))
  assert.snapshot(stdout, snapshot)
})

test.run()
