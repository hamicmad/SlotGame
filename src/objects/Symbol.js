import Phaser from "phaser";
import { SYMBOLS_CONFIG } from "../configs/symbolsConfig.js";

export default class Symbol extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, symbolId) {
    super(scene, x, y, "symbols", SYMBOLS_CONFIG.MAP[symbolId]);

    this.scene.add.existing(this);
    this.setOrigin(0.5, 0.5);
    this.symbolId = symbolId;
  }

  blurSymbols(isBlur) {
    const id = this.symbolId;

    const frameName = isBlur ? SYMBOLS_CONFIG.BLUR[id] : SYMBOLS_CONFIG.MAP[id];

    const atlasKey = isBlur ? "blurSymbols" : "symbols";

    this.setTexture(atlasKey, frameName);
  }

  setSymbolId(newId) {
    this.symbolId = newId;

    const isCurrentlyBlurred = this.texture.key === "blurSymbols";

    const atlasKey = isCurrentlyBlurred ? "blurSymbols" : "symbols";
    const frameName = isCurrentlyBlurred
      ? SYMBOLS_CONFIG.BLUR[newId]
      : SYMBOLS_CONFIG.MAP[newId];

    this.setTexture(atlasKey, frameName);
  }

  copyFrom(sourceSymbol) {
    this.y = sourceSymbol.y;
    this.setSymbolId(sourceSymbol.symbolId);
    this.setAlpha(sourceSymbol.alpha);
    this.setOrigin(sourceSymbol.originX, sourceSymbol.originY);
  }
}
