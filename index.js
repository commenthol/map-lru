'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapLRU = function () {
  /**
  * @constructor
  * @param {Number} maxSize - max. size of the LRU cache
  */
  function MapLRU(maxSize) {
    _classCallCheck(this, MapLRU);

    if (typeof maxSize !== 'number') throw TypeError('maxSize needs to be a number');

    this.maxSize = maxSize;
    this._keys = new Array(maxSize);
    this._next = new Float64Array(maxSize);
    this._prev = new Float64Array(maxSize);
    this._lastKey = undefined;
    this.clear();
  }

  _createClass(MapLRU, [{
    key: '_move',
    value: function _move(pointer) {
      var oldHead = this._head;

      if (oldHead === pointer) return;

      var prev = this._prev[pointer];
      var next = this._next[pointer];

      if (this._tail === pointer) {
        this._tail = prev;
      } else {
        this._prev[next] = prev;
      }

      this._prev[oldHead] = pointer;
      this._head = pointer;
      this._next[prev] = next;
      this._next[pointer] = oldHead;
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size
    */

  }, {
    key: 'get',


    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
    */
    value: function get(key) {
      var pointer = this._pointers.get(key);

      if (typeof pointer === 'undefined') return;

      this._move(pointer);
      this._lastKey = key;
      return this._map.get(key);
    }

    /**
    * Get an item without marking it as recently used
    * @param {Any} key
    */

  }, {
    key: 'peek',
    value: function peek(key) {
      var pointer = this._pointers.get(key);

      if (typeof pointer === 'undefined') return;

      this._lastKey = key;
      return this._map.get(key);
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
    */

  }, {
    key: 'set',
    value: function set(key, value) {
      var pointer = this._pointers.get(key);
      this._lastKey = key;

      if (typeof pointer !== 'undefined') {
        this._move(pointer);
        this._map.set(key, value);
        return this;
      } else if (this._size < this.maxSize) {
        pointer = this._size++;
      } else {
        pointer = this._tail;
        this._tail = this._prev[pointer];
        this._pointers.delete(this._keys[pointer]);
      }

      this._pointers.set(key, pointer);
      this._keys[pointer] = key;
      this._map.set(key, value);

      this._next[pointer] = this._head;
      this._prev[this._head] = pointer;
      this._head = pointer;

      return this;
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear
    */

  }, {
    key: 'clear',
    value: function clear() {
      this._size = 0;
      this._head = 0;
      this._tail = 0;
      this._pointers = new Map();
      this._map = new Map();
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete
    */

  }, {
    key: 'delete',
    value: function _delete(key) {
      var pointer = this._pointers.get(key);

      if (typeof pointer === 'undefined') return false;

      var next = this._next[pointer];
      var prev = this._prev[pointer];
      this._next[prev] = next;
      this._prev[next] = prev;
      this._pointers.delete(key);
      this._map.delete(key);
      this._size -= 1;

      return true;
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
    */

  }, {
    key: 'has',
    value: function has(key) {
      return this._pointers.has(key);
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
    */

  }, {
    key: 'keys',
    value: function keys() {
      return this._pointers.keys();
    }

    /**
    * keys in order of access - last one is most recently used one
    * @return {Iterator} Iterator object
    */

  }, {
    key: 'keysAccessed',
    value: function keysAccessed() {
      var keys = new Set();
      if (this._size) {
        var pointer = this._tail;
        keys.add(this._keys[pointer]);
        while (pointer !== this._head) {
          pointer = this._prev[pointer];
          keys.add(this._keys[pointer]);
        }
      }
      return keys;
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
    */

  }, {
    key: 'values',
    value: function values() {
      return this._map.values();
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries
    */

  }, {
    key: 'entries',
    value: function entries() {
      return this._map.entries();
    }
  }, {
    key: Symbol.iterator,


    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/@@iterator
    */
    value: function value() {
      return this._map[Symbol.iterator]();
    }
  }, {
    key: 'size',
    get: function get() {
      return this._size;
    }

    /**
    * returns the last accessed key
    * @return {Any}
    */

  }, {
    key: 'last',
    get: function get() {
      return this._lastKey;
    }
  }, {
    key: 'forEach',
    get: function get() {
      var map = this._map;
      return map.forEach.bind(map);
    }
  }]);

  return MapLRU;
}();

exports.default = MapLRU;
