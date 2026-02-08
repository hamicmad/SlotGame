import Phaser from "phaser";
import { SYMBOLS_CONFIG } from "../configs/symbolsConfig.js";

export default class Symbol extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, symbolId) {
    super(scene, x, y, "symbols", SYMBOLS_CONFIG.MAP[symbolId]);

    this.scene.add.existing(this);
    this.setOrigin(0.5, 0);
    this.symbolId = symbolId;
  }

  setSymbolId(newId) {
    this.symbolId = newId;
    this.setFrame(SYMBOLS_CONFIG.MAP[newId]);
  }

  copyFrom(sourceSymbol) {
    this.y = sourceSymbol.y;
    this.setSymbolId(sourceSymbol.symbolId);
    this.setAlpha(sourceSymbol.alpha);
  }
}
