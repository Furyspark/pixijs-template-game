/**
 * Handles user input.
 * @namespace
 */
function InputManager() {}

/**
 * Starts the input manager.
 * @protected
 */
InputManager.start = function() {
  this.initMembers();
  this.attachBasicEvents();
}

/**
 * Initializes member variables.
 * @protected
 */
InputManager.initMembers = function() {
  this.position = {
    mouse: {
      screen: new Point(),
      game: new Point()
    }
  };
  // Add buttons
  this.buttons = {};
  var keys = [
    "Alt",
    "Control",
    "Shift",
    "CapsLock",
    "NumLock",
    "ScrollLock",
    "Enter",
    "Tab",
    " ",
    "ArrowDown",
    "ArrowLeft",
    "ArrowUp",
    "ArrowRight",
    "End",
    "Home",
    "PageDown",
    "PageUp",
    "Backspace",
    "Delete",
    "Insert",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "F13",
    "F14",
    "F15",
    "F16",
    "F17",
    "F18",
    "F19",
    "F20",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "-",
    "=",
    "[",
    "]",
    ";",
    "'",
    ",",
    ".",
    "/",
    "\\",
    "`",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "Numpad0",
    "Numpad1",
    "Numpad2",
    "Numpad3",
    "Numpad4",
    "Numpad5",
    "Numpad6",
    "Numpad7",
    "Numpad8",
    "Numpad9",
    "NumpadDelete",
    "NumpadEnter",
    "NumpadAdd",
    "NumpadSubtract",
    "NumpadMultiply",
    "NumpadDivide",
    "Mouse1",
    "Mouse2",
    "Mouse3",
    "Mouse4",
    "Mouse5"
  ];
  for(var a = 0;a < keys.length;a++) {
    var keyName = keys[a];
    this.buttons[keyName] = new Input_Key();
  }
  // Set gamepad data
  this.gamepads = [];
}

/**
 * Called every frame before game updates.
 */
InputManager.update = function() {
  
}

/**
 * Adds basic event listeners.
 * @protected
 */
InputManager.attachBasicEvents = function() {
  // Update mouse position on the screen
  window.addEventListener("mousemove", this._onMouseMoveScreen.bind(this));
  // Update mouse position in the renderer
  Core.renderer.view.addEventListener("mousemove", this._onMouseMoveContent.bind(this));
  // Mouse down
  Core.renderer.view.addEventListener("mousedown", this._onMouseDown.bind(this));
  // Mouse up
  window.addEventListener("mouseup", this._onMouseUp.bind(this));
  // Key down
  window.addEventListener("keydown", this._onKeyDown.bind(this));
  // Key up
  window.addEventListener("keyup", this._onKeyUp.bind(this));
  // Connect gamepad
  window.addEventListener("gamepadconnected", this._onGamepadConnect.bind(this));
  // Disconnect gamepad
  window.addEventListener("gamepaddisconnected",this._onGamepadDisconnect.bind(this));
}

/**
 * Event listener for a mouse screen move event.
 * @param {MouseEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onMouseMoveScreen = function(e) {
  this.position.mouse.screen.set(e.screenX, e.screenY);
}

/**
 * Event listener for a mouse content move event.
 * @param {MouseEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onMouseMoveContent = function(e) {
  var rect = Core.renderer.view.getBoundingClientRect();
  var gameX = Math.round((e.clientX - rect.left) * (Core.renderer.width / (rect.right - rect.left)));
  var gameY = Math.round((e.clientY - rect.top) * (Core.renderer.height / (rect.bottom - rect.top)));
  this.position.mouse.game.set(gameX, gameY);
}

/**
 * Event listener for mouse down event.
 * @param {MouseEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onMouseDown = function(e) {
  var name = "Mouse" + (e.button+1).toString();
  this.buttons[name].onPress.dispatch();
}

/**
 * Event listener for mouse up event.
 * @param {MouseEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onMouseUp = function(e) {
  var name = "Mouse" + (e.button+1).toString();
  this.buttons[name].onRelease.dispatch();
}

/**
 * Event listener for a keyboard key press event.
 * @param {KeyboardEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onKeyDown = function(e) {
  var keyName = this.convertKeyboardEventToButton(e);
  if(!!this.buttons[keyName]) {
    this.buttons[keyName].onPress.dispatch();
  }
}

/**
 * Event listener for a keyboard key release event.
 * @param {KeyboardEvent} e - The event associated with this listener.
 * @protected
 */
InputManager._onKeyUp = function(e) {
  var keyName = this.convertKeyboardEventToButton(e);
  if(!!this.buttons[keyName]) {
    this.buttons[keyName].onRelease.dispatch();
  }
}

/**
 * Converts a keyboard event to an appropriate InputManager button variable name.
 * @param {KeyboardEvent} e - The keyboard event to convert.
 * @returns {string} An appropriate variable name for InputManager buttons, or the default value.
 */
InputManager.convertKeyboardEventToButton = function(e) {
  var key = e.key;
  // Determine and return results
  switch(key) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "Enter":
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
        return "Numpad" + key.toString();
      }
      break;
    case "-":
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
        return "NumpadSubtract";
      }
      break;
    case "+":
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
        return "NumpadAdd";
      }
      break;
    case "/":
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
        return "NumpadDivide";
      }
      break;
    case "*":
      if(e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
        return "NumpadMultiply";
      }
      break;
  }
  // Convert shifted misc keys
  if(key === "~") key = "`";
  else if(key === "_") key = "-";
  else if(key === "+") key = "=";
  else if(key === "{") key = "[";
  else if(key === "}") key = "]";
  else if(key === ":") key = ";";
  else if(key === "\"") key = "'";
  else if(key === "<") key = ",";
  else if(key === ">") key = ".";
  else if(key === "?") key = "/";
  else if(key === "|") key = "\\";
  else if(key === "!") key = "1";
  else if(key === "@") key = "2";
  else if(key === "#") key = "3";
  else if(key === "$") key = "4";
  else if(key === "%") key = "5";
  else if(key === "^") key = "6";
  else if(key === "&") key = "7";
  else if(key === "*") key = "8";
  else if(key === "(") key = "9";
  else if(key === ")") key = "0";
  // Return results
  return key;
}

/**
 * Event listener for a gamepad connect event.
 * @param {Object} e - The event associated with this listener.
 * @protected
 */
InputManager._onGamepadConnect = function(e) {
  var gamepads = navigator.getGamepads();
  for(var a = 0;a < gamepads.length;a++) {
    var gamepad = gamepads[a];
    if(!!gamepad && this.gamepads.indexOf(gamepad) === -1) this.gamepads.push(gamepad);
  }
  this.sortGamepads();
}

/**
 * Event listener for a gamepad disconnect event.
 * @param {Object} e - The event associated with this listener.
 * @protected
 */
InputManager._onGamepadDisconnect = function(e) {
}

/**
 * Sorts the gamepad array by their index.
 */
InputManager.sortGamepads = function() {
  this.gamepads = this.gamepads.sort(function(a, b) {
    if(a.index > b.index) return 1;
    if(a.index < b.index) return -1;
    return 0;
  });
  console.log(this.gamepads);
}
