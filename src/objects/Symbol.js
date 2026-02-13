import Phaser from "phaser";
import { SYMBOLS_CONFIG } from "../configs/symbolsConfig.js";

export default class Symbol extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, symbolId) {
    super(scene, x, y, "symbols", SYMBOLS_CONFIG.MAP[symbolId]);
    this.scene.add.existing(this);
    this.setOrigin(0.5, 0.5);
    this.symbolId = symbolId;
    this.setDisplaySize(250, 250);
  }

  blurSymbols(isBlur) {
    const frameName = isBlur
      ? SYMBOLS_CONFIG.BLUR[this.symbolId]
      : SYMBOLS_CONFIG.MAP[this.symbolId];
    const atlasKey = isBlur ? "blurSymbols" : "symbols";

    this.setTexture(atlasKey, frameName);
    this.setDisplaySize(250, 250);
  }

  setSymbolId(newId) {
    this.symbolId = newId;
    const isCurrentlyBlurred = this.texture.key === "blurSymbols";
    this.blurSymbols(isCurrentlyBlurred);
  }

  playAnim() {
    const anKey = `winAn${this.symbolId}`;
    if (this.scene.anims.exists(anKey)) {
      this.setDepth(5);
      this.play(anKey);
      this.once("animationcomplete", () => {
        this.setDepth(1);
        this.blurSymbols(false);
      });
    }
  }
}
