import { Context } from './utils.js'

import * as assert from 'uvu/assert'
import { cp, readFile, rm, writeFile } from 'node:fs/promises'
import { execPath } from 'node:process'
import {
  getAfterEach,
  getBeforeEach,
  getDirTree,
  getPaths,
  isUpdate,
} from './utils.js'
import { resolve } from 'node:path'
import spawn from 'await-spawn'
import { suite } from 'uvu'

const { filesystemDir, getSnapshotFile, scriptFile } = getPaths(
  // @ts-ignore
  import.meta.url
)
const snapshotFile = getSnapshotFile('generate')

const test = suite<Context>('generate', { cwd: undefined })

test.before.each(getBeforeEach(filesystemDir))
test.after.each(getAfterEach())

test('BARE', async ({ cwd }) => {
  const stdout = await spawn(execPath, [scriptFile, 'generate'], { cwd })
  if (isUpdate) await writeFile(snapshotFile('bare'), stdout.toString())
  const snapshot = await readFile(snapshotFile('bare'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('bare_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('bare_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('BARE (config js)', async ({ cwd }) => {
  await cp(
    resolve(filesystemDir, '../config/configfile.js'),
    resolve(cwd, '.sveltekit-imagegen.js')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(execPath, [scriptFile, 'generate'], { cwd })
  if (isUpdate)
    await writeFile(snapshotFile('bare_config_js'), stdout.toString())
  const snapshot = await readFile(snapshotFile('bare_config_js'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(snapshotFile('bare_config_js_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('bare_config_js_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('BARE (config json)', async ({ cwd }) => {
  await cp(
    resolve(filesystemDir, '../config/configfile.json'),
    resolve(cwd, '.sveltekit-imagegen.json')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(execPath, [scriptFile, 'generate'], { cwd })
  if (isUpdate)
    await writeFile(snapshotFile('bare_config_json'), stdout.toString())
  const snapshot = await readFile(snapshotFile('bare_config_json'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(snapshotFile('bare_config_json_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('bare_config_json_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--config (js)', async ({ cwd }) => {
  await cp(
    resolve(filesystemDir, '../config/configfile.js'),
    resolve(cwd, 'configfile.js')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(
    `${execPath} ${scriptFile} generate --config=configfile.js`,
    [],
    { cwd, shell: true }
  )
  if (isUpdate) await writeFile(snapshotFile('config_js'), stdout.toString())
  const snapshot = await readFile(snapshotFile('config_js'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('config_js_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('config_js_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--config (json)', async ({ cwd }) => {
  await cp(
    resolve(filesystemDir, '../config/configfile.json'),
    resolve(cwd, 'configfile.json')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(
    `${execPath} ${scriptFile} generate --config=configfile.json`,
    [],
    { cwd, shell: true }
  )
  if (isUpdate) await writeFile(snapshotFile('config_json'), stdout.toString())
  const snapshot = await readFile(snapshotFile('config_json'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(snapshotFile('config_json_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('config_json_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--force', async ({ cwd }) => {
  const stdout = await spawn(execPath, [scriptFile, 'generate', '--force'], {
    cwd,
  })
  if (isUpdate) await writeFile(snapshotFile('force'), stdout.toString())
  const snapshot = await readFile(snapshotFile('force'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('force_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('force_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--verbose', async ({ cwd }) => {
  const stdout = await spawn(execPath, [scriptFile, 'generate', '--verbose'], {
    cwd,
  })
  if (isUpdate) await writeFile(snapshotFile('verbose'), stdout.toString())
  const snapshot = await readFile(snapshotFile('verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('verbose_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('verbose_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--verbose (configfile)', async ({ cwd }) => {
  await cp(
    resolve(filesystemDir, '../config/configfile.js'),
    resolve(cwd, 'configfile.js')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })
})

test('--force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--force', '--verbose'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(snapshotFile('force_verbose'), stdout.toString())
  const snapshot = await readFile(snapshotFile('force_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=images', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=images'],
    { cwd }
  )
  if (isUpdate) await writeFile(snapshotFile('only_images'), stdout.toString())
  const snapshot = await readFile(snapshotFile('only_images'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(snapshotFile('only_images_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('only_images_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=images --force', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=images', '--force'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(snapshotFile('only_images_force'), stdout.toString())
  const snapshot = await readFile(snapshotFile('only_images_force'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=images --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=images', '--verbose'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(snapshotFile('only_images_verbose'), stdout.toString())
  const snapshot = await readFile(snapshotFile('only_images_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(snapshotFile('only_images_verbose_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('only_images_verbose_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=images --force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=images', '--force', '--verbose'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(
      snapshotFile('only_images_force_verbose'),
      stdout.toString()
    )
  const snapshot = await readFile(snapshotFile('only_images_force_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=manifests', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=manifests'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(snapshotFile('only_manifests'), stdout.toString())
  const snapshot = await readFile(snapshotFile('only_manifests'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(snapshotFile('only_manifests_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('only_manifests_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=manifests --force', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=manifests', '--force'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(snapshotFile('only_manifests_force'), stdout.toString())
  const snapshot = await readFile(snapshotFile('only_manifests_force'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=manifests --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=manifests', '--verbose'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(snapshotFile('only_manifests_verbose'), stdout.toString())
  const snapshot = await readFile(snapshotFile('only_manifests_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(
      snapshotFile('only_manifests_verbose_tree'),
      tree.toString()
    )
  const snaptree = await readFile(snapshotFile('only_manifests_verbose_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=manifests --verbose (mkdir)', async ({ cwd }) => {
  await rm(resolve(cwd, 'src/lib/assets/images/_gen'), { recursive: true })

  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=manifests', '--verbose'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(
      snapshotFile('only_manifests_verbose_mkdir'),
      stdout.toString()
    )
  const snapshot = await readFile(snapshotFile('only_manifests_verbose_mkdir'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(
      snapshotFile('only_manifests_verbose_mkdir_tree'),
      tree.toString()
    )
  const snaptree = await readFile(
    snapshotFile('only_manifests_verbose_mkdir_tree')
  )
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=manifests --force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    execPath,
    [scriptFile, 'generate', '--only=manifests', '--force', '--verbose'],
    { cwd }
  )
  if (isUpdate)
    await writeFile(
      snapshotFile('only_manifests_force_verbose'),
      stdout.toString()
    )
  const snapshot = await readFile(snapshotFile('only_manifests_force_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test.run()
