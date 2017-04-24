function SoundFile() {
  this.initialize.apply(this, arguments);
}

Object.defineProperties(SoundFile.prototype, {
  /**
   * Sets or gets the volume of this sound.
   * @type {number}
   * @memberof SoundFile.prototype
   */
  volume: {
    get: function() {
      return this.howl.volume(this.howlId);
    },
    set: function(value) {
      this.howl.volume(value, this.howlId);
    }
  },
  /**
   * Sets or gets whether this sound is looping.
   * @type {Boolean}
   * @memberof SoundFile.prototype
   */
  loop: {
    get: function() {
      return this.howl.loop(this.howlId);
    },
    set: function(value) {
      this.howl.loop(value, this.howlId);
    }
  }
});

/**
 * @class
 * Contains info on a HowlerJS sound.
 * @param {Howl} howl - The Howl associated with this SoundFile.
 * @param {number} id - The ID for this SoundFile's Howl.
 * @constructs SoundFile
 */
SoundFile.prototype.initialize = function(howl, id) {
  /**
   * The Howl associated with this SoundFile.
   * @type {Howl}
   * @readonly
   */
  this.howl = howl;
  /**
   * The ID for this SoundFile's Howl.
   * @type {number}
   * @readonly
   */
  this.howlId = id;
}

/**
 * Stops this sound.
 */
SoundFile.prototype.stop = function() {
  this.howl.stop(this.howlId);
}
