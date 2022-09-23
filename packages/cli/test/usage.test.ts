import * as assert from 'uvu/assert'
import { execPath } from 'node:process'
import { getPaths, isUpdate, readFile, spawn } from './common.js'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { suite } from 'uvu'

type SpawnError = Error & {
  code: number
  stdout: Buffer
  stderr: Buffer
}

const { filesystemDir, getSnapshotFile, scriptFile } = getPaths(import.meta.url)
const snapshotFile = getSnapshotFile('usage')

const test = suite('usage')

test('BARE', async () => {
  const stdout = await spawn(execPath, [scriptFile])
  if (isUpdate) await writeFile(snapshotFile('bare'), stdout)
  const snapshot = await readFile(snapshotFile('bare'))
  assert.snapshot(stdout, snapshot)

  // help
  const help = await spawn(execPath, [scriptFile, 'help'])
  assert.snapshot(help, snapshot)

  // --help
  const __help = await spawn(execPath, [scriptFile, '--help'])
  assert.snapshot(__help, snapshot)
})

test('--config (invalids)', async () => {
  // js file
  try {
    await spawn(`${execPath} ${scriptFile} generate --config=blarg.js`, [], {
      shell: true,
    })
  } catch (error: unknown) {
    assert.match((error as SpawnError).stderr.toString(), /Cannot import/)
  }

  // json file
  try {
    await spawn(`${execPath} ${scriptFile} generate --config=blarg.json`, [], {
      shell: true,
    })
  } catch (error: unknown) {
    assert.match(
      (error as SpawnError).stderr.toString(),
      /Cannot read or parse/
    )
  }

  // other file
  try {
    await spawn(`${execPath} ${scriptFile} generate --config=blarg.txt`, [], {
      shell: true,
    })
  } catch (error: unknown) {
    assert.match((error as SpawnError).stderr.toString(), /format.*js.*json/)
  }

  // images.default.format
  try {
    await spawn(
      [
        execPath,
        scriptFile,
        'generate',
        [
          '--config',
          resolve(filesystemDir, '../config/invalid-images-default-format.js'),
        ].join('='),
      ].join(' '),
      [],
      { shell: true }
    )
  } catch (error: unknown) {
    assert.match(
      (error as SpawnError).stderr.toString(),
      /Unsupported.*format.*images.*default/
    )
  }

  // images.default.format (membership)
  try {
    await spawn(
      [
        execPath,
        scriptFile,
        'generate',
        [
          '--config',
          resolve(
            filesystemDir,
            '../config/invalid-images-default-format-member.js'
          ),
        ].join('='),
      ].join(' '),
      [],
      { shell: true }
    )
  } catch (error: unknown) {
    assert.match(
      (error as SpawnError).stderr.toString(),
      /format.*images.*default.*formats/
    )
  }

  // images.default.size (membership)
  try {
    await spawn(
      [
        execPath,
        scriptFile,
        'generate',
        [
          '--config',
          resolve(
            filesystemDir,
            '../config/invalid-images-default-size-member.js'
          ),
        ].join('='),
      ].join(' '),
      [],
      { shell: true }
    )
  } catch (error: unknown) {
    assert.match(
      (error as SpawnError).stderr.toString(),
      /images.*default.*size/
    )
  }

  // images.formats
  try {
    await spawn(
      [
        execPath,
        scriptFile,
        'generate',
        [
          '--config',
          resolve(filesystemDir, '../config/invalid-images-formats.js'),
        ].join('='),
      ].join(' '),
      [],
      { shell: true }
    )
  } catch (error: unknown) {
    assert.match((error as SpawnError).stderr.toString(), /images.*formats/)
  }

  // images.version
  try {
    await spawn(
      [
        execPath,
        scriptFile,
        'generate',
        [
          '--config',
          resolve(filesystemDir, '../config/invalid-images-version.js'),
        ].join('='),
      ].join(' '),
      [],
      { shell: true }
    )
  } catch (error: unknown) {
    assert.match((error as SpawnError).stderr.toString(), /images.*version/)
  }

  // manifest.format
  try {
    await spawn(
      [
        execPath,
        scriptFile,
        'generate',
        [
          '--config',
          resolve(filesystemDir, '../config/invalid-manifests-format.js'),
        ].join('='),
      ].join(' '),
      [],
      { shell: true }
    )
  } catch (error: unknown) {
    assert.match((error as SpawnError).stderr.toString(), /manifest.*format/)
  }
})

test('generate', async () => {
  // help
  const help = await spawn(execPath, [scriptFile, 'help', 'generate'])
  if (isUpdate) await writeFile(snapshotFile('generate'), help)
  const snapshot = await readFile(snapshotFile('generate'))
  assert.snapshot(help, snapshot)

  // --help
  const __help = await spawn(execPath, [scriptFile, 'generate', '--help'])
  assert.snapshot(__help, snapshot)

  // --only
  const __only = await spawn(execPath, [scriptFile, 'generate', '--only'])
  assert.snapshot(__only, snapshot)

  // --only invalid
  const __onlyInvalid = await spawn(execPath, [
    scriptFile,
    'generate',
    '--only invalid',
  ])
  assert.snapshot(__onlyInvalid, snapshot)
})

test('originals', async () => {
  const bare = await spawn(execPath, [scriptFile, 'originals'])
  if (isUpdate) await writeFile(snapshotFile('originals'), bare)
  const snapshot = await readFile(snapshotFile('originals'))
  assert.snapshot(bare, snapshot)

  // help
  const help = await spawn(execPath, [scriptFile, 'help', 'originals'])
  assert.snapshot(help, snapshot)

  // --help
  const __help = await spawn(execPath, [scriptFile, 'originals', '--help'])
  assert.snapshot(__help, snapshot)

  // --optimize --remove
  const __optimize__remove = await spawn(execPath, [
    scriptFile,
    'originals',
    '--optimize',
    '--remove',
  ])
  assert.snapshot(__optimize__remove, snapshot)
})

test('clean', async () => {
  // help
  const help = await spawn(execPath, [scriptFile, 'help', 'clean'])
  if (isUpdate) await writeFile(snapshotFile('clean'), help)
  const snapshot = await readFile(snapshotFile('clean'))
  assert.snapshot(help, snapshot)

  // --help
  const __help = await spawn(execPath, [scriptFile, 'clean', '--help'])
  assert.snapshot(__help, snapshot)

  // --only
  const __only = await spawn(execPath, [scriptFile, 'clean', '--only'])
  assert.snapshot(__only, snapshot)

  // --only invalid
  const __onlyInvalid = await spawn(execPath, [
    scriptFile,
    'clean',
    '--only invalid',
  ])
  assert.snapshot(__onlyInvalid, snapshot)
})

test.run()
