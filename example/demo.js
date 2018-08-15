let maxMatrix = require("../index.js");

let m = new maxMatrix.MAX7219Matrix("/dev/spidev0.0", 4);

m.processText("TEST", maxMatrix.CP437_FONT);
