# MAX7219-Matrix
Interfacing with MAX7219 8x8 LED arrays for the Raspberry Pi over SPI
## Install
``npm install max7219-matrix``
___
## Dependencies
The SPI device needs to be enabled on your Raspberry Pi.
[Sparkfun tutorial on how to do this](https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial#spi-on-pi)  

Check in /dev if the devices installed successfully:
```shell
$ ls -l /dev/spi*
crw-rw---- 1 root spi 153, 0 Aug 14 22:22 /dev/spidev0.0
crw-rw---- 1 root spi 153, 1 Aug 14 22:22 /dev/spidev0.1
```
___
## Wiring
![alt text](https://i.imgur.com/N8GwqnK.png "Wiring the MAX7219 to the Raspberry Pi")
___
## How to use the package

```javascript
let maxMatrix = require("max7219-matrix");

let m = new maxMatrix.MAX7219Matrix("/dev/spidev0.0", 4);
m.processText("TEST");
```
Run `node example/demo.js` to run the snippet from above
--- The demo is set for 4 LED Arrays.

* The displayed text will always be trimmed to the first N characters, where N is the number or screens specified in the constructor. ex.: 
If we set the screen count to 4, and we send the text "HELLO" (`max7219.processText("APPLE");`), our screen will display `APPL`.
___
__**`maxMatrix.MAX7219Matrix(device, screenCount)`**__

* __**Constructor**__
* Creates an instance of the object, and initializes it with the required values.
* The `device` argument specifies the SPI Device to which the screens are connected. ex.: `"/dev/spidev0.0"`.
* The `screenCount` argument specifies the number of daisy-chained MAX7219 driven 8x8 LED arrays ex.: `4`.

__**`setBrightness(brightness)`**__

* Set the brightness of the matrices.
* `brightness` should be between 0 and 15 (inclusive)

__**`processText(text, font)`**__

* Display the `text`, in the selected `font`. If the `font` is not specified, it defaults to `CP437_FONT`.
* The following fonts can be used: 
* __`CP437_FONT` (default), `SINCLAIR_FONT`, `LCD_FONT`, `UKR_FONT` and `TINY_FONT`.__
* Syntax :
```javascript
m.processText("TEST", maxMatrix.LCD_FONT);
```
___
## Example

The demo, found at `example/demo.js`, displays __" TEST "__ in the __CP437_FONT__.
(it's set for 4 daisy-chained MAX7219 arrays)
___
## TO-DOs

* Text rotation
* Scrolling text
* "Breathing" text effect
* "Blinking" text effect
___
## Notes
This is a project I work on in my spare time, and it's very much a work-in-progress. If you have any problems, open an issue on GitHub.
Pull requests are very welcome! Any improvements made to the code are much appreciated.
___
## Special thanks to

* [Larry Bank (bitbank2)](https://github.com/bitbank2), and his awesomely documented C++ [project](https://github.com/bitbank2/MAX7219).
