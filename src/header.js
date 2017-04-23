/**
 * Removes an object from the array.
 * @param {Object} obj - The object to remove.
 * @returns {Object} The removed object, or undefined if no object was found to be removed.
 */
Array.prototype.remove = function(obj) {
  var index = this.indexOf(obj);
  if(index !== -1) {
    return this.splice(index, 1)[0];
  }
  return undefined;
}
