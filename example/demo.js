let maxMatrix = require("../index.js");

let m = new maxMatrix.MAX7219Matrix(0, 0, 4);

m.setRotation(90).processText("TEST", "CP437_FONT").setBrightness(12);
