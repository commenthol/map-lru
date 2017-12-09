export default class MapLRU {
  /**
  * @constructor
  * @param {Number} maxSize - max. size of the LRU cache
  */
  constructor (maxSize) {
    if (typeof maxSize !== 'number') throw TypeError('maxSize needs to be a number')
    Object.assign(this, {
      maxSize,
      _lastKey: void (0),
      _set: new Set(),
      _map: new Map() // unfortunately we can't extend `Map`
    })
    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
    */
    this.forEach = this._map.forEach.bind(this._map)
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size
  */
  get size () {
    return this._map.size
  }

  /**
  * returns the last accessed key
  * @return {Any}
  */
  get last () {
    return this._lastKey
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
  */
  get (key) {
    if (key === this._lastKey) {
      return this._map.get(key)
    } else if (this._set.delete(key)) {
      this._set.add(key)
      this._lastKey = key
      return this._map.get(key)
    }
  }

  /**
  * Get an item without marking it as recently used
  * @param {Any} key
  */
  peek (key) {
    return this._map.get(key)
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
  */
  set (key, value) {
    for (let _key of this._set) {
      if (this.size < this.maxSize) {
        break
      }
      this.delete(_key)
    }
    this._lastKey = key
    this._set.add(key)
    this._map.set(key, value)
    return this
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear
  */
  clear () {
    this._set.clear()
    this._map.clear()
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete
  */
  delete (key) {
    this._set.delete(key)
    return this._map.delete(key)
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
  */
  has (key) {
    return this._map.has(key)
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
  */
  keys() {
    return this._map.keys()
  }

  /**
  * keys in order of access - last one is most recently used one
  * @return {Iterator} Iterator object
  */
  keysAccessed() {
    return this._set.values()
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
  */
  values() {
    return this._map.values()
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries
  */
  entries () {
    return this._map.entries()
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/@@iterator
  */
  [Symbol.iterator] () {
    return this._map[Symbol.iterator]()
  }
}
