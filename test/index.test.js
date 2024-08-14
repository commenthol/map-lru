/* global describe, it */

import assert from 'assert'
import MapLRU from '../src/index.js'

/// needs renaming to *.cjs
// const assert = require('assert')
// const MapLRU = require('..')

describe('#MapLRU', function () {
  it('should throw with TypeError', function () {
    assert.throws(() => {
      new MapLRU() // eslint-disable-line no-new
    }, /maxSize needs to be a number/)
  })

  it('should create a LRU-Cache', function () {
    const cache = new MapLRU(10)
    assert.strictEqual(cache.maxSize, 10)
    assert.strictEqual(cache.size, 0)
    assert.deepStrictEqual(Array.from(cache.entries()), [])
    assert.deepStrictEqual([...cache.keysAccessed()], [])
  })

  it('should create a maxSize-ed LRU-Cache', function () {
    const cache = new MapLRU(3)
    assert.strictEqual(cache.maxSize, 3)
    assert.strictEqual(cache.size, 0)
    assert.deepStrictEqual(Array.from(cache.entries()), [])
  })

  it('should add one entry', function () {
    const cache = new MapLRU(3)
    cache.set('a', 'aa')
    assert.strictEqual(cache.size, 1)
    assert.strictEqual(cache.get('a'), 'aa')
    assert.deepStrictEqual(Array.from(cache.entries()), [['a', 'aa']])
    assert.deepStrictEqual(Array.from(cache.keys()), ['a'])
    assert.deepStrictEqual(Array.from(cache.values()), ['aa'])
  })

  it('should set and return entries', function () {
    const cache = new MapLRU(10)
    cache.set('a', 'aa').set('b', { bb: 1 })
    assert.strictEqual(cache.has('a'), true)
    assert.strictEqual(cache.get('a'), 'aa')
    assert.deepStrictEqual(cache.get('b'), { bb: 1 })
    assert.strictEqual(cache.get('c'), undefined)
    assert.strictEqual(cache.last, 'b')
  })

  it('should delete entries', function () {
    const cache = new MapLRU(10)
    cache.set('a', 1).set('b', 2)
    assert.strictEqual(cache.size, 2)
    assert.deepStrictEqual(Array.from(cache.keys()), ['a', 'b'])
    assert.strictEqual(cache.delete('a'), true)
    assert.strictEqual(cache.size, 1)
    assert.deepStrictEqual(Array.from(cache.keys()), ['b'])
    cache.delete('b')
    assert.strictEqual(cache.size, 0)
    assert.deepStrictEqual(Array.from(cache.keys()), [])
    assert.strictEqual(cache.delete('z'), false)
  })

  it('should clear cache', function () {
    const cache = new MapLRU(10)
    cache.set('a', 1).set('b', 2)
    assert.strictEqual(cache.size, 2)
    cache.clear()
    assert.strictEqual(cache.size, 0)
  })

  it('should dedup entries', function () {
    const cache = new MapLRU(10)
    const a = [['a', 1], ['b', 2], ['c', 3], ['a', 4]]
    a.forEach((entry) => cache.set(...entry))
    // console.log(cache)
    assert.deepStrictEqual(Array.from(cache.entries()), [['a', 4], ['b', 2], ['c', 3]])
    assert.strictEqual(cache.last, 'a')
  })

  it('should dedup entries - maxSize', function () {
    const cache = new MapLRU(2)
    const a = [['a', 1], ['b', 2], ['a', 4]]
    a.forEach((entry) => cache.set(...entry))
    // console.log(cache)
    assert.deepStrictEqual(Array.from(cache.entries()), [['a', 4], ['b', 2]])
    assert.strictEqual(cache.last, 'a')
  })

  it('should iterate over entries using for ... of', function () {
    const cache = new MapLRU(10)
    const a = [['a', 1], ['b', 2], ['c', 3]]
    a.forEach((entry) => cache.set(...entry))
    let i = 0
    for (const entry of cache) {
      assert.deepStrictEqual(entry, a[i++])
    }
  })

  it('should iterate over entries using forEach', function () {
    const cache = new MapLRU(10)
    const a = [['a', 1], ['b', 2], ['c', 3]]
    a.forEach((entry) => cache.set(...entry))
    let i = 0
    cache.forEach((entry) => {
      assert.strictEqual(entry, a[i++][1])
    })
  })

  it('should limit entries', function () {
    const cache = new MapLRU(2)
    cache.set('a', 'aa')
    cache.set('b', 'bb')
    cache.set('c', 'cc')
    assert.strictEqual(cache.size, 2)
    assert.deepStrictEqual(Array.from(cache.keys()), ['b', 'c'])
  })

  it('should return keys accessed', function () {
    const cache = new MapLRU(3)
    cache.set('a', 1)
    cache.set('a', 2)
    assert.deepStrictEqual([...cache.keysAccessed()], ['a'])
  })

  it('should return keys accessed #2', function () {
    const cache = new MapLRU(3)
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 2)
    cache.get('c')
    cache.get('b')
    const iter = cache.keysAccessed()
    const arr = []
    for (;;) {
      const { value, done } = iter.next()
      if (done) break
      arr.push(value)
    }
    assert.deepStrictEqual(arr, ['a', 'c', 'b'])
  })

  it('should drop last used entry', function () {
    const cache = new MapLRU(3)
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)
    assert.strictEqual(cache.get('a'), 1)
    cache.set('d', 4)
    assert.strictEqual(cache.get('a'), 1)
    cache.set('e', 5)
    // console.log(cache)
    assert.deepStrictEqual([...cache.keys()], ['a', 'd', 'e'])
    assert.deepStrictEqual([...cache.keysAccessed()], ['d', 'a', 'e'])
  })

  it('should peek without changing last', function () {
    const cache = new MapLRU(3)
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)
    assert.strictEqual(cache.peek('a'), 1)
    cache.set('d', 4)
    assert.strictEqual(cache.peek('a'), undefined)
    cache.set('e', 5)
    assert.deepStrictEqual(Array.from(cache.keys()), ['c', 'd', 'e'])
  })
})
