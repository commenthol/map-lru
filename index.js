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
    Object.assign(this, {
      maxSize: maxSize,
      _lastKey: void 0,
      _set: new Set(),
      _map: new Map() // unfortunately we can't extend `Map`
    });
    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
    */
    this.forEach = this._map.forEach.bind(this._map);
  }

  /**
  * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size
  */


  _createClass(MapLRU, [{
    key: 'get',


    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
    */
    value: function get(key) {
      if (key === this._lastKey) {
        return this._map.get(key);
      } else if (this._set.delete(key)) {
        this._set.add(key);
        this._lastKey = key;
        return this._map.get(key);
      }
    }

    /**
    * Get an item without marking it as recently used
    * @param {Any} key
    */

  }, {
    key: 'peek',
    value: function peek(key) {
      return this._map.get(key);
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
    */

  }, {
    key: 'set',
    value: function set(key, value) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._set[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _key = _step.value;

          if (this.size < this.maxSize) {
            break;
          }
          this.delete(_key);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this._lastKey = key;
      this._set.add(key);
      this._map.set(key, value);
      return this;
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear
    */

  }, {
    key: 'clear',
    value: function clear() {
      this._set.clear();
      this._map.clear();
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete
    */

  }, {
    key: 'delete',
    value: function _delete(key) {
      this._set.delete(key);
      return this._map.delete(key);
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
    */

  }, {
    key: 'has',
    value: function has(key) {
      return this._map.has(key);
    }

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
    */

  }, {
    key: 'keys',
    value: function keys() {
      return this._map.keys();
    }

    /**
    * keys in order of access - last one is most recently used one
    * @return {Iterator} Iterator object
    */

  }, {
    key: 'keysAccessed',
    value: function keysAccessed() {
      return this._set.values();
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

    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/@@iterator
    */

  }, {
    key: Symbol.iterator,
    value: function value() {
      return this._map[Symbol.iterator]();
    }
  }, {
    key: 'size',
    get: function get() {
      return this._map.size;
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
  }]);

  return MapLRU;
}();

exports.default = MapLRU;
module.exports = MapLRU;
