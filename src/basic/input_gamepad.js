function Input_Gamepad() {
  this.initialize.apply(this, arguments);
}

Object.defineProperties(Input_Gamepad.prototype, {
  /**
   * The index of this gamepad.
   * @type {number}
   * @readonly
   * @memberof Input_Gamepad.prototype
   */
  index: {
    get: function() {
      return InputManager.gamepads.indexOf(this);
    }
  },
  /**
   * A list of this gamepad's axes. Each axis goes from -1.0 to 1.0.
   * @type {Array.<number>}
   * @readonly
   * @memberof Input_Gamepad.prototype
   */
  axes: {
    get: function() {
      if(this.gamepad) return this.gamepad.axes;
      return [0, 0, 0, 0, 0, 0];
    }
  },
  /**
   * The ID or name of the gamepad.
   * @type {string}
   * @readonly
   * @memberof Input_Gamepad.prototype
   */
  id: {
    get: function() {
      if(this.gamepad) return this.gamepad.id;
      return "<No Gamepad>";
    }
  }
});

/**
 * @class
 * A wrapper for a JavaScript Gamepad.
 * @param {Gamepad} gamepad - The JavaScript Gamepad object.
 * @constructs Input_Gamepad
 */
Input_Gamepad.prototype.initialize = function() {
  /**
   * The JavaScript Gamepad object associated with this Input_Gamepad object.
   * @type {Gamepad}
   * @readonly
   */
  this.gamepad = null;
  /**
   * A list of this gamepad's buttons.
   * @type {Array.<Input_Key>}
   * @readonly
   */
  this.buttons = [];
  /**
   * Fired when this gamepad is connected.
   * @type {Signal}
   */
  this.onConnect = new Signal();
  /**
   * Fired when this gamepad is disconnected.
   * @type {Signal}
   */
  this.onDisconnect = new Signal();

  // Create buttons
  for(var a = 0;a < 32;a++) {
    this.buttons.push(new Input_Key());
  }
  // Add events
  this.onConnect.add(function(gamepad) {
    this.gamepad = gamepad;
  }, this, [], 100);
  this.onDisconnect.add(function() {
    this.gamepad = null;
  }, [], 100);
}

/**
 * Updates this gamepad's state.
 * Called from within InputManager.update.
 */
Input_Gamepad.prototype.update = function() {
  for(var a = 0;a < this.buttons.length;a++) {
    var btn = this.buttons[a];
    var srcDown = false;
    if(this.gamepad && this.gamepad.buttons[a]) srcDown = this.gamepad.buttons[a].pressed;
    if(srcDown && !btn.down) btn.onPress.dispatch();
    else if(!srcDown && btn.down) btn.onRelease.dispatch();
  }
}
