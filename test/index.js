/* global describe, it */

import MapLRU from '../index.es.js'
import assert from 'assert'

// const MapLRU = require('../index.js')
// const assert = require('assert')

describe('#MapLRU', function () {
  it('should throw with TypeError', function () {
    assert.throws(() => {
      new MapLRU() // eslint-disable-line no-new
    }, /maxSize needs to be a number/)
  })

  it('should create a LRU-Cache', function () {
    const cache = new MapLRU(10)
    assert.equal(cache.maxSize, 10)
    assert.equal(cache.size, 0)
    assert.deepEqual(cache.entries(), {})
  })

  it('should create a maxSize-ed LRU-Cache', function () {
    const cache = new MapLRU(3)
    assert.equal(cache.maxSize, 3)
    assert.equal(cache.size, 0)
    assert.deepEqual(Array.from(cache.entries()), [])
  })

  it('should add one entry', function () {
    const cache = new MapLRU(3)
    cache.set('a', 'aa')
    assert.equal(cache.size, 1)
    assert.strictEqual(cache.get('a'), 'aa')
    assert.deepEqual(Array.from(cache.entries()), [ [ 'a', 'aa' ] ])
    assert.deepEqual(Array.from(cache.keys()), [ 'a' ])
    assert.deepEqual(Array.from(cache.values()), [ 'aa' ])
  })

  it('should set and return entries', function () {
    const cache = new MapLRU(10)
    cache.set('a', 'aa').set('b', {bb: 1})
    assert.strictEqual(cache.has('a'), true)
    assert.strictEqual(cache.get('a'), 'aa')
    assert.deepEqual(cache.get('b'), {bb: 1})
    assert.strictEqual(cache.get('c'), undefined)
    assert.strictEqual(cache.last, 'b')
  })

  it('should delete entries', function () {
    const cache = new MapLRU(10)
    cache.set('a', 1).set('b', 2)
    assert.strictEqual(cache.size, 2)
    assert.deepEqual(Array.from(cache.keys()), ['a', 'b'])
    cache.delete('a')
    assert.strictEqual(cache.size, 1)
    assert.deepEqual(Array.from(cache.keys()), ['b'])
    cache.delete('b')
    assert.strictEqual(cache.size, 0)
    assert.deepEqual(Array.from(cache.keys()), [])
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
    assert.deepEqual(Array.from(cache.entries()), [['a', 4], ['b', 2], ['c', 3]])
    assert.strictEqual(cache.last, 'a')
  })

  it('should dedup entries - maxSize', function () {
    const cache = new MapLRU(2)
    const a = [['a', 1], ['b', 2], ['a', 4]]
    a.forEach((entry) => cache.set(...entry))
    assert.deepEqual(Array.from(cache.entries()), [['b', 2], ['a', 4]])
    assert.strictEqual(cache.last, 'a')
  })

  it('should iterate over entries using for ... of', function () {
    const cache = new MapLRU(10)
    const a = [['a', 1], ['b', 2], ['c', 3]]
    a.forEach((entry) => cache.set(...entry))
    let i = 0
    for (const entry of cache) {
      assert.deepEqual(entry, a[i++])
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
    assert.deepEqual(Array.from(cache.keys()), ['b', 'c'])
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
    assert.deepEqual([...cache.keys()], [ 'a', 'd', 'e' ])
    assert.deepEqual([...cache.keysAccessed()], [ 'd', 'a', 'e' ])
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
    assert.deepEqual(Array.from(cache.keys()), [ 'c', 'd', 'e' ])
  })
})
