/*
 * Author: Sam Brendel
 */

/**
 * An object to control sound effects.
 * @param {*} sourceFileName 
 */
function Sound(sourceFileName, repeat) {
    this._source = (sourceFileName) ? "sounds\\" + sourceFileName : null;
    this._audio = (this._source) ? new Audio(this._source) : null;
    if(this._audio && repeat) {
        this._audio.loop = repeat;
    }
}

// Getter and Setter.
Sound.prototype = {
    /** Integer whole number where 50 < speedPercent < 200 to represent the speed of the sound played.
     *  Speed can be dynamically changed during playback.
     *  WARNING: Values other than 100 may cause a choppy sound.
     *  https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate
     */
    set playbackSpeed(speedPercent) {
        this._audio.playbackRate = (speedPercent) ? 1.0 * (speedPercent/100.0) : 1.0
    },
    get playbackSpeed() {
        return this._audio.playbackRate
    }
}

Sound.prototype.play = function() {
    if(this._source && this._audio) {
        this._audio.play();
    } else {
        console.error("Cannot play audio object.");
    }
}

/**
 * Allows for many repeats of this sound to overlap and play simultaneously. i.e. when pressing a key quickly several times during an attack.
 */
Sound.prototype.replay = function() {
    if(this._source && this._audio) {
        this._audio = new Audio(this._source   );
        this._audio.play();
    } else {
        console.error("Cannot play audio object.");
    }
}

Sound.prototype.pause = function() {
    if(this._source && this._audio) {
        this._audio.pause();
    } else {
        console.error("Cannot pause audio object.");
    }
}