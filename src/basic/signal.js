function Signal() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * A variant of the event listener.
 * @constructs Signal
 */
Signal.prototype.initialize = function() {
  /**
   * List of bindings attached to this signal.
   * @type {Array.<SignalBinding>}
   * @protected
   */
  this._bindings = [];
}

/**
 * Attaches a signal binding to this signal.
 * @param {Function} callback - The callback to call when this signal if fired.
 * @param {Object} context - The context to call the callback from.
 * @param {Array} [args=undefined] - The parameters to pass down to the callback. Has no effect if the signal dispatches with parameters.
 * @param {number} [priority=undefined] - The priority of this binding. Higher values get called first.
 */
Signal.prototype.add = function(callback, context, args, priority) {
  this._bindings.push(new SignalBinding(callback, context, args, priority, false));
}

/**
 * Attaches a signal binding to this signal. Will only be called once before it is automatically removed from this signal.
 * @param {Function} callback - The callback to call when this signal if fired.
 * @param {Object} context - The context to call the callback from.
 * @param {Array} [args=[]] - The parameters to pass down to the callback. Has no effect if the signal dispatches with parameters.
 * @param {number} [priority=50] - The priority of this binding. Higher values get called first.
 */
Signal.prototype.addOnce = function(callback, context, args, priority) {
  this._bindings.push(new SignalBinding(callback, context, args, priority, true));
}

/**
 * Removes a binding from this signal.
 * @param {Function} callback - The callback of the binding to remove.
 * @param {Object} context - The context that was assigned to this binding.
 */
Signal.prototype.remove = function(callback, context) {
  for(var a = 0;a < this._bindings.length;a++) {
    var obj = this._bindings[a];
    if(obj.callback === callback && obj.context === context) {
      this._bindings.splice(a, 1);
      return true;
    }
  }
  return false;
}

/**
 * Function used in sorting the bindings.
 * @param {SignalBinding} a - First object to test against.
 * @param {SignalBinding} b - Second object to test against.
 * @protected
 */
Signal.prototype.sortFunction = function(a, b) {
  if(a.priority < b.priority) return 1;
  if(a.priority > b.priority) return -1;
  return 0;
}

/**
 * Fires this signal, calling all bindings' callbacks.
 * @param {Array} [args=[]] - Optional parameters to pass to the callbacks.
 */
Signal.prototype.dispatch = function(args) {
  if(!args instanceof Array) args = [];
  var binds = [];
  for(var a = 0;a < this._bindings.length;a++) {
    var bind = this._bindings[a];
    if(bind.once) {
      this._bindings.splice(a, 1);
      a--;
    }
    binds.push(bind);
  }
  binds = binds.sort(this.sortFunction);
  for(var a = 0;a < binds.length;a++) {
    var bind = binds[a];
    bind.dispatch(args);
  }
}
