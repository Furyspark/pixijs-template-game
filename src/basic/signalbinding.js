function SignalBinding() {
  this.initialize.apply(this, arguments);
}

/**
 * @class
 * Contains data on a binding for signals.
 * @param {Function} callback - The function to call when this binding is dispatched.
 * @param {Object} context - The context to call this binding's callback from.
 * @param {Array} [args=[]] - The parameters to hand over to the callback when it is fired. Has no effect if the signal calls with parameters.
 * @param {number} [priority=50] - The priority of this binding. Higher values get called first.
 * @param {Boolean} [once=false] - Whether to remove this binding once it has been dispatched once.
 * @constructs SignalBinding
 */
SignalBinding.prototype.initialize = function(callback, context, args, priority, once) {
  if(!args instanceof Array) args = [];
  if(!priority && priority !== 0) priority = 50;
  if(!once && once !== false) once = false;
  /**
   * The function to call when this binding is dispatched.
   * @type {Function}
   */
  this.callback = callback;
  /**
   * The context to call this binding's callback from.
   * @type {Object}
   */
  this.context = context;
  /**
   * The parameters to hand over to the callback when it is fired. Has no effect if the signal calls with parameters.
   * @type {Array}
   */
  this.args = args;
  /**
   * The priority of this binding. Higher values get called first.
   * @type {number}
   */
  this.priority = priority;
  /**
   * Whether to remove this binding once it has been dispatched once.
   * @type {Boolean}
   */
  this.once = once;
}

/**
 * Fires this binding's callback.
 * @param {Array} [args=[]] - The arguments to pass down to this binding. Will override this binding's own arguments.
 */
SignalBinding.prototype.dispatch = function(args) {
  if(!(args instanceof Array)) args = [];
  if(args.length === 0) args = this.args;
  this.callback.apply(this.context, args);
}
