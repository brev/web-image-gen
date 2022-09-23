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
import { writeFile } from 'node:fs/promises'
import { suite } from 'uvu'

const { filesystemDir, getSnapshotFile, scriptFile } = getPaths(import.meta.url)
const snapshotFile = getSnapshotFile('clean')

const test = suite<Context>('clean', { cwd: '' })

test.before.each(getBeforeEach(filesystemDir))
test.after.each(getAfterEach())

test('BARE', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(execPath, [scriptFile, 'clean'], { cwd })
  if (isUpdate) await writeFile(snapshotFile('bare'), stdout)
  const snapshot = await readFile(snapshotFile('bare'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('bare_tree'), tree)
  const snaptree = await readFile(snapshotFile('bare_tree'))
  assert.snapshot(tree, snaptree)
})

test('--verbose', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(execPath, [scriptFile, 'clean', '--verbose'], {
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

test('--only=images', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(execPath, [scriptFile, 'clean', '--only=images'], {
    cwd,
  })
  if (isUpdate) await writeFile(snapshotFile('only_images'), stdout)
  const snapshot = await readFile(snapshotFile('only_images'))
  assert.snapshot(stdout, snapshot)

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('only_images_tree'), tree)
  const snaptree = await readFile(snapshotFile('only_images_tree'))
  assert.snapshot(tree, snaptree)
})

test('--only=images --verbose', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(
    execPath,
    [scriptFile, 'clean', '--only=images', '--verbose'],
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

test('--only=manifests', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(
    execPath,
    [scriptFile, 'clean', '--only=manifests'],
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

test('--only=manifests --verbose', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(
    execPath,
    [scriptFile, 'clean', '--only=manifests', '--verbose'],
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

test.run()
