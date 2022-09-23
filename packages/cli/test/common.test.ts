import { access } from 'node:fs/promises'
import * as assert from 'uvu/assert'
import { env } from 'node:process'
import {
  getAfterEach,
  getBeforeEach,
  getDirTree,
  getPaths,
  isUpdate,
  readFile,
  spawn,
} from './common.js'
import { resolve } from 'node:path'
import { suite } from 'uvu'

const test = suite('common')

test('getAfterEach getBeforeEach', async () => {
  const context = { cwd: '' }
  const { filesystemDir } = getPaths(import.meta.url)

  const beforeEach = getBeforeEach(filesystemDir)
  assert.ok(beforeEach)
  assert.type(beforeEach, 'function')
  assert.ok(context)
  assert.not.ok(context.cwd)
  await beforeEach(context)
  assert.ok(context)
  assert.ok(context.cwd)
  assert.match(context.cwd, /web-image-gen-test/)

  const { cwd } = context
  let exists = false
  try {
    await access(resolve(cwd))
    exists = true
  } catch {}
  assert.ok(exists)

  const afterEach = getAfterEach()
  assert.ok(afterEach)
  assert.type(afterEach, 'function')
  await afterEach(context)
  assert.ok(context)
  assert.not.ok(context.cwd)

  exists = true
  try {
    await access(resolve(cwd))
  } catch {
    exists = false
  }
  assert.not.ok(exists)
})

test('getDirTree', async () => {
  const { filesystemDir } = getPaths(import.meta.url)
  const tree = await getDirTree(filesystemDir)
  assert.ok(tree)
  assert.match(tree, /src\/lib\/assets\/images\/_gen\/fruits\.json/)
  assert.match(tree, /static\/images\/countries\/france\./)
  assert.match(tree, /static\/images\/fruits\/apple\./)
  assert.match(tree, /static\/images\/fruits\/_gen\/apple-/)
})

test('getPaths', () => {
  const { filesystemDir, getSnapshotFile, scriptFile } = getPaths(
    import.meta.url
  )

  assert.ok(filesystemDir)
  assert.match(filesystemDir, /fixtures\/filesystem/)

  const snapshotFile = getSnapshotFile('pather')
  assert.ok(snapshotFile)
  assert.type(snapshotFile, 'function')
  const snapFile = snapshotFile('namer')
  assert.ok(snapFile)
  assert.match(snapFile, /pather/)
  assert.match(snapFile, /namer/)

  assert.ok(scriptFile)
  assert.match(scriptFile, /dist\/index\.js/)
})

test('isUpdate', () => {
  if (env['SNAPSHOT_UPDATE']) assert.ok(isUpdate)
  else assert.not.ok(isUpdate)
})

test('readFile', async () => {
  try {
    await readFile('NOT_EXIST')
  } catch (error) {
    assert.ok(error)
    assert.match(
      (error as Error).message,
      /no such file or directory.*NOT_EXIST/
    )
  }
})

test('spawn', async () => {
  const stdout = await spawn('echo', ['Hello'])
  assert.ok(stdout)
  assert.match(stdout, /Hello/)
})

test.run()
