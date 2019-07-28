"use strict";

let SPI = require("spi");
const fonts = require("./fonts.js");
const DEFAULT_FONT = fonts.DEFAULT_FONT;

const MAX7219_REG_DECODEMODE = 0x9;
const MAX7219_REG_INTENSITY = 0xA;
const MAX7219_REG_SCANLIMIT = 0xB;
const MAX7219_REG_SHUTDOWN = 0xC;
const MAX7219_REG_DISPLAYTEST = 0xF;

const NUM_DIGITS = 8;
const MAX7219_REG_DIGIT0 = 0x1;
const MAX7219_REG_DIGIT1 = 0x2;
const MAX7219_REG_DIGIT2 = 0x3;
const MAX7219_REG_DIGIT3 = 0x4;
const MAX7219_REG_DIGIT4 = 0x5;
const MAX7219_REG_DIGIT5 = 0x6;
const MAX7219_REG_DIGIT6 = 0x7;
const MAX7219_REG_DIGIT7 = 0x8;

let screenCount = 1;
let initialized = false;

/**
 * Constructor for the MAX7219Matrix
 * @param device The SPI port on which the MAX7219 controlled LED matrices are connected
 * @constructor
 */
let MAX7219Matrix = function (device, screenCount) {
    this._spi = new SPI.Spi(device, {
        "mode": SPI.MODE["MODE_0"],  // Mode should be the first one set
        "chipSelect": SPI.CS["low"] // "none", "high" - defaults to low
    },
        function (s) {
            s.open();
        });

    this._initialize(screenCount);
}

/**
 * Initializes the MAX7219 controlled LED matrices
 * @param sc Number of screens daisy-chained and connected
 */
MAX7219Matrix.prototype._initialize = function (sc) {
    if (typeof this._spi !== "undefined" && !initialized) {
        this.screenCount = sc ? sc : 1; // Set screen count, or default it to 1
        this._sendToAllMatrices(MAX7219_REG_SCANLIMIT, 7); // show all 8 digits
        this._sendToAllMatrices(MAX7219_REG_DECODEMODE, 0x0); // 0x0 Matrix - 0x1 Seven-Segment
        this._sendToAllMatrices(MAX7219_REG_DISPLAYTEST, 0x0); // not a display test
        this._sendToAllMatrices(MAX7219_REG_SHUTDOWN, 0x1); // not shutdown mode
        this.setBrightness(7); // Set the LEDs' brightness (0 -> 15)
        initialized = true;
    }
}

/**
 * Processes the input string, and writes it to the correct registries of the MAX7219
 * @param text The text to be displayed
 * @param font The font in which the text should be displayed (defaults to CP437)
 */
MAX7219Matrix.prototype.processText = function (text, font) {
    if (typeof text === 'undefined' || !text) {
        text = Array(screenCount).fill(" ").join("");;
    }
    let fittedText = text.slice(0, this.screenCount).split("");
    let finalData = [];
    let asciiData = [];
    if (typeof font === "undefined" || !fonts.hasOwnProperty(font)) {
        font = fonts.CP437_FONT_ROTATED;
    } else {
        font = fonts[font];
    }
    for (let char of fittedText) {
        asciiData.push(font[this._ascii(char)]);
    }
    finalData = this._transpose(asciiData);
    let col = MAX7219_REG_DIGIT0;
    for (let i = 0; i < 8; i++) {
        this._writeToChip(col, finalData[i]);
        col++;
    }
    return this;
}

/**
 * Writes data to the specified register
 * @param register The register where the data should be written
 * @param data The data that should be written
 */
MAX7219Matrix.prototype._writeToChip = function (register, data) {
    let writableData = this._formatData(register, data);
    var buf = new Buffer(writableData);
    this._spi.write(buf);
}

/**
 * Formats the data to the number of connected matrices.
 * reg:[0x0] data:[0x1, 0x2, 0x3, 0x4]
 * will become
 * [0x0, 0x1, 0x0, 0x2, 0x0, 0x3, 0x0, 0x4]
 * @param register The register where the data should be written
 * @param data The data that should be formatted to the number of matrices
 */
MAX7219Matrix.prototype._formatData = function (register, data) {
    let finalData = [];
    for (let i = 0; i < this.screenCount; i++) {
        finalData.push(register);
        finalData.push(data.pop());
    }
    return finalData;
}

/**
 * Writes the same data to all matrices' register
 * @param register The register where the data should be written
 * @param data The data that should be written
 */
MAX7219Matrix.prototype._sendToAllMatrices = function (reg, data) {
    this._writeToChip(reg, Array(this.screenCount).fill(data));
}

/**
 * Sets the matrices' intensity (0 <= intensity <= 15)
 * @param intensity The matrices' intensity
 */
MAX7219Matrix.prototype.setBrightness = function (brightness) {
    if (brightness < 0 && brightness > 15) {
        throw `Brightness should be between 0 and 15. You set it to ${brightness}.`;
    }
    this._sendToAllMatrices(MAX7219_REG_INTENSITY, brightness);
    return this;
}

/**
 * Returns a character's ASCII code
 * @param char The matrices' intensity
 */
MAX7219Matrix.prototype._ascii = function (char) {
    return char.charCodeAt(0);
}

/**
 * Returns the matrix, transposed (flipped over it's diagonal)
 * @param m The matrix to be transposed
 */
MAX7219Matrix.prototype._transpose = function (m) {
    return m[0].map((x, i) => m.map(x => x[i]));
}

/**
 * Sleeps for the set amount of milliseconds
 * @param milliseconds Sleep duration, in milliseconds
 */
MAX7219Matrix.prototype._sleep = function (milliseconds) {
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

module.exports.MAX7219Matrix = MAX7219Matrix;
