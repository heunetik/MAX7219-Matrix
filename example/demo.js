let maxMatrix = require("../index.js");

let m = new maxMatrix.MAX7219Matrix(0, 0, 4);

m.processText("TEST", "SINCLAIR_FONT_ROTATED").setBrightness(12);