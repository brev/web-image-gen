import * as assert from 'uvu/assert'
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import spawn from 'await-spawn'
import { suite } from 'uvu'

// @ts-ignore
const dir = dirname(fileURLToPath(import.meta.url))
const fsdir = resolve(dir, '../_fixtures/filesystem')
const script = resolve(dir, '../../dist/index.js')
const snapdir = resolve(dir, '../_snapshots/cli/generate')
const snapfile = (name: string) => resolve(snapdir, `${name}.txt`)
const update = process.env['SNAPSHOT_UPDATE']

const test = suite('generate')

test.before.each(async (context) => {
  context.cwd = await mkdtemp('./.sveltekit-imagegen-test-')
  await cp(fsdir, context.cwd, { recursive: true })
})

test.after.each(async (context) => {
  await rm(context.cwd, { recursive: true })
  delete context.cwd
})

test('BARE', async ({ cwd }) => {
  const stdout = await spawn(process.execPath, [script, 'generate'], { cwd })
  if (update) await writeFile(snapfile('bare'), stdout.toString())
  const snapshot = await readFile(snapfile('bare'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('bare_tree'), tree.toString())
  const snaptree = await readFile(snapfile('bare_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('BARE (config js)', async ({ cwd }) => {
  await cp(
    resolve(fsdir, '../config/configfile.js'),
    resolve(cwd, '.sveltekit-imagegen.js')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(process.execPath, [script, 'generate'], { cwd })
  if (update) await writeFile(snapfile('bare_config_js'), stdout.toString())
  const snapshot = await readFile(snapfile('bare_config_js'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('bare_config_js_tree'), tree.toString())
  const snaptree = await readFile(snapfile('bare_config_js_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('BARE (config json)', async ({ cwd }) => {
  await cp(
    resolve(fsdir, '../config/configfile.json'),
    resolve(cwd, '.sveltekit-imagegen.json')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(process.execPath, [script, 'generate'], { cwd })
  if (update) await writeFile(snapfile('bare_config_json'), stdout.toString())
  const snapshot = await readFile(snapfile('bare_config_json'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('bare_config_json_tree'), tree.toString())
  const snaptree = await readFile(snapfile('bare_config_json_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--config (js)', async ({ cwd }) => {
  await cp(
    resolve(fsdir, '../config/configfile.js'),
    resolve(cwd, 'configfile.js')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(
    `${process.execPath} ${script} generate --config=configfile.js`,
    [],
    { cwd, shell: true }
  )
  if (update) await writeFile(snapfile('config_js'), stdout.toString())
  const snapshot = await readFile(snapfile('config_js'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('config_js_tree'), tree.toString())
  const snaptree = await readFile(snapfile('config_js_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--config (json)', async ({ cwd }) => {
  await cp(
    resolve(fsdir, '../config/configfile.json'),
    resolve(cwd, 'configfile.json')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })

  const stdout = await spawn(
    `${process.execPath} ${script} generate --config=configfile.json`,
    [],
    { cwd, shell: true }
  )
  if (update) await writeFile(snapfile('config_json'), stdout.toString())
  const snapshot = await readFile(snapfile('config_json'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('config_json_tree'), tree.toString())
  const snaptree = await readFile(snapfile('config_json_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--force', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--force'],
    { cwd }
  )
  if (update) await writeFile(snapfile('force'), stdout.toString())
  const snapshot = await readFile(snapfile('force'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('force_tree'), tree.toString())
  const snaptree = await readFile(snapfile('force_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--verbose', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--verbose'],
    { cwd }
  )
  if (update) await writeFile(snapfile('verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('verbose_tree'), tree.toString())
  const snaptree = await readFile(snapfile('verbose_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--verbose (configfile)', async ({ cwd }) => {
  await cp(
    resolve(fsdir, '../config/configfile.js'),
    resolve(cwd, 'configfile.js')
  )
  await rm(resolve(cwd, 'src/'), { recursive: true })
  await rm(resolve(cwd, 'static/images/fruits/_gen'), { recursive: true })
})

test('--force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--force', '--verbose'],
    { cwd }
  )
  if (update) await writeFile(snapfile('force_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('force_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=images', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=images'],
    { cwd }
  )
  if (update) await writeFile(snapfile('only_images'), stdout.toString())
  const snapshot = await readFile(snapfile('only_images'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('only_images_tree'), tree.toString())
  const snaptree = await readFile(snapfile('only_images_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=images --force', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=images', '--force'],
    { cwd }
  )
  if (update) await writeFile(snapfile('only_images_force'), stdout.toString())
  const snapshot = await readFile(snapfile('only_images_force'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=images --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=images', '--verbose'],
    { cwd }
  )
  if (update)
    await writeFile(snapfile('only_images_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('only_images_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update)
    await writeFile(snapfile('only_images_verbose_tree'), tree.toString())
  const snaptree = await readFile(snapfile('only_images_verbose_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=images --force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=images', '--force', '--verbose'],
    { cwd }
  )
  if (update)
    await writeFile(snapfile('only_images_force_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('only_images_force_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=manifests', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=manifests'],
    { cwd }
  )
  if (update) await writeFile(snapfile('only_manifests'), stdout.toString())
  const snapshot = await readFile(snapfile('only_manifests'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update) await writeFile(snapfile('only_manifests_tree'), tree.toString())
  const snaptree = await readFile(snapfile('only_manifests_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=manifests --force', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=manifests', '--force'],
    { cwd }
  )
  if (update)
    await writeFile(snapfile('only_manifests_force'), stdout.toString())
  const snapshot = await readFile(snapfile('only_manifests_force'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test('--only=manifests --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=manifests', '--verbose'],
    { cwd }
  )
  if (update)
    await writeFile(snapfile('only_manifests_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('only_manifests_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update)
    await writeFile(snapfile('only_manifests_verbose_tree'), tree.toString())
  const snaptree = await readFile(snapfile('only_manifests_verbose_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=manifests --verbose (mkdir)', async ({ cwd }) => {
  await rm(resolve(cwd, 'src/lib/assets/images/_gen'), { recursive: true })

  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=manifests', '--verbose'],
    { cwd }
  )
  if (update)
    await writeFile(snapfile('only_manifests_verbose_mkdir'), stdout.toString())
  const snapshot = await readFile(snapfile('only_manifests_verbose_mkdir'))
  assert.snapshot(stdout.toString(), snapshot.toString())

  const tree = await spawn('ls', ['-1R'], { cwd })
  if (update)
    await writeFile(
      snapfile('only_manifests_verbose_mkdir_tree'),
      tree.toString()
    )
  const snaptree = await readFile(snapfile('only_manifests_verbose_mkdir_tree'))
  assert.snapshot(tree.toString(), snaptree.toString())
})

test('--only=manifests --force --verbose', async ({ cwd }) => {
  const stdout = await spawn(
    process.execPath,
    [script, 'generate', '--only=manifests', '--force', '--verbose'],
    { cwd }
  )
  if (update)
    await writeFile(snapfile('only_manifests_force_verbose'), stdout.toString())
  const snapshot = await readFile(snapfile('only_manifests_force_verbose'))
  assert.snapshot(stdout.toString(), snapshot.toString())
})

test.run()
