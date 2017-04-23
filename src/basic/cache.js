function Cache() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * Stores any kind of data, but should only hold one type per cache.
 * @constructs Cache
 */
Cache.prototype.initialize = function() {
  /**
   * Holds all the items as a dictionary data type.
   * @type {Object.<string, Object>}
   */
  this._items = {};
}

/**
 * Stores an object in the cache.
 * @param {string} key - The key to store the object under.
 * @param {Object} item - The object to store in the cache.
 */
Cache.prototype.setItem = function(key, item) {
  this._items[key] = item;
}

/**
 * Retrieves an item from the cache.
 * @param {string} key - The key under which the item is stored.
 * @returns {Object} The item to be retrieved.
 */
Cache.prototype.getItem = function(key) {
  return this._items[key];
}
