/*
const fs = require("fs");
const { registerFont } = require('canvas');
const { newError } = require("./utils.js");

if(fs.existsSync("./Fonts")) {
  fs.readdir("./Fonts", (err, fonts) => {
    if(err) return console.log(`\n=> ${newError(err, "CanvasFontManager")}`);

    var fontsNames = [];
    fonts.forEach((fontFile) => {
      let fontName = fontFile.split(".")[0];
      fontsNames.push(fontName);
      try {
        registerFont(`./Fonts/${fontFile}`, { family: fontName });
      } catch (err2) {
        console.log(`\n=> ${newError(err2, `CanvasFontManager_${fontName}`)}`);
      }
    });
    
    console.log("^ Ignora esse aviso em cima ^\nFontes registradas:\n" + fontsNames.join("\n"));
  });
}
*/