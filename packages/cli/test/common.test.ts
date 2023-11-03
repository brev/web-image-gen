import type { Config } from '../types'

import * as assert from 'uvu/assert'
import { cwd } from 'node:process'
import {
  deepMerge,
  getFlags,
  getServePath,
  imageInputFormats,
  imageOutputFormats,
  manifestOutputFormats,
  shortPath,
} from '../src/common.js'
import { suite } from 'uvu'

const test = suite('common')

test('deepMerge', () => {
  const a = {
    b: {
      c: ['d', 'e'],
      d: {
        e: 'f',
      },
    },
  }
  const b = {
    a: {},
    b: {
      c: ['f', 'g'],
      d: {
        g: 'h',
      },
    },
  }
  assert.equal(deepMerge(a, b), {
    a: {},
    b: {
      c: ['f', 'g'],
      d: {
        e: 'f',
        g: 'h',
      },
    },
  })
})

test('getFlags', () => {
  assert.equal(getFlags({}), {
    force: false,
    only: false,
    verbose: false,
  })
  assert.equal(getFlags({ force: true, only: 'hi', verbose: true }), {
    force: true,
    only: 'hi',
    verbose: true,
  })
})

test('getServePath', () => {
  const servePath = getServePath({
    images: { static: '/static', version: '1' },
  } as Config)
  assert.ok(servePath)
  assert.is(servePath('/static/images'), '/images?v=1')
})

test('imageInputFormats', () => {
  assert.ok(imageInputFormats)
  assert.ok(imageInputFormats.length)
})

test('imageOutputFormats', () => {
  assert.ok(imageOutputFormats)
  assert.ok(imageOutputFormats.length)
})

test('manifestOutputFormats', () => {
  assert.ok(manifestOutputFormats)
  assert.ok(manifestOutputFormats.length)
})

test('shortPath', () => {
  assert.is(shortPath(`${cwd()}/boingo`), 'boingo')
})

test.run()
