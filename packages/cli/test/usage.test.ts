import * as assert from 'uvu/assert'
import { execPath } from 'node:process'
import { getPaths, isUpdate } from './common.js'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import spawn from 'await-spawn'
import { suite } from 'uvu'

// @ts-ignore
const { filesystemDir, getSnapshotFile, scriptFile } = getPaths(import.meta.url)
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

test('--config (invalids)', async () => {
  // js file
  try {
    await spawn(`${execPath} ${scriptFile} generate --config=blarg.js`, [], {
      shell: true,
    })
  } catch (error) {
    assert.match(error.stderr.toString(), /Cannot import/)
  }

  // json file
  try {
    await spawn(`${execPath} ${scriptFile} generate --config=blarg.json`, [], {
      shell: true,
    })
  } catch (error) {
    assert.match(error.stderr.toString(), /Cannot read or parse/)
  }

  // other file
  try {
    await spawn(`${execPath} ${scriptFile} generate --config=blarg.txt`, [], {
      shell: true,
    })
  } catch (error) {
    assert.match(error.stderr.toString(), /format.*js.*json/)
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
  } catch (error) {
    assert.match(
      error.stderr.toString(),
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
  } catch (error) {
    assert.match(error.stderr.toString(), /format.*images.*default.*formats/)
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
  } catch (error) {
    assert.match(error.stderr.toString(), /images.*default.*size/)
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
  } catch (error) {
    assert.match(error.stderr.toString(), /images.*formats/)
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
  } catch (error) {
    assert.match(error.stderr.toString(), /images.*version/)
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
  } catch (error) {
    assert.match(error.stderr.toString(), /manifest.*format/)
  }
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
