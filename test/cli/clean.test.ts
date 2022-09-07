import { Context } from './utils.js'

import * as assert from 'uvu/assert'
import { execPath } from 'node:process'
import {
  getAfterEach,
  getBeforeEach,
  getDirTree,
  getPaths,
  isUpdate,
} from './utils.js'
import { readFile, writeFile } from 'node:fs/promises'
import spawn from 'await-spawn'
import { suite } from 'uvu'

const { filesystemDir, getSnapshotFile, scriptFile } = getPaths(
  // @ts-ignore
  import.meta.url
)
const snapshotFile = getSnapshotFile('clean')

const test = suite<Context>('clean', { cwd: undefined })

test.before.each(getBeforeEach(filesystemDir))
test.after.each(getAfterEach())

test('BARE', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(execPath, [scriptFile, 'clean'], { cwd })
  if (isUpdate) await writeFile(snapshotFile('bare'), stdout.toString())
  const snapshot = await readFile(snapshotFile('bare'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate) await writeFile(snapshotFile('bare_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('bare_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--verbose', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(execPath, [scriptFile, 'clean', '--verbose'], {
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

test('--only=images', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(execPath, [scriptFile, 'clean', '--only=images'], {
    cwd,
  })
  if (isUpdate) await writeFile(snapshotFile('only_images'), stdout.toString())
  const snapshot = await readFile(snapshotFile('only_images'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await getDirTree(cwd)
  if (isUpdate)
    await writeFile(snapshotFile('only_images_tree'), tree.toString())
  const snaptree = await readFile(snapshotFile('only_images_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=images --verbose', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(
    execPath,
    [scriptFile, 'clean', '--only=images', '--verbose'],
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

test('--only=manifests', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(
    execPath,
    [scriptFile, 'clean', '--only=manifests'],
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

test('--only=manifests --verbose', async ({ cwd }) => {
  await spawn(execPath, [scriptFile, 'generate'], { cwd })

  const stdout = await spawn(
    execPath,
    [scriptFile, 'clean', '--only=manifests', '--verbose'],
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

test.run()
