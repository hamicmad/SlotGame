import Phaser from "phaser";
import Reel from "./Reel.js";
import { SYMBOLS_CONFIG } from "../configs/symbolsConfig.js";

export default class ReelsManager extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.reels = [];
    this.createMachine();
    scene.add.existing(this);
  }

  createMachine() {
    const columnWidth = 250;
    const symbolH = SYMBOLS_CONFIG.REEL.SYMBOL_HEIGHT;
    const maskW = columnWidth * 5;
    const maskH = symbolH * 3;

    const maskGraphics = this.scene.make.graphics();
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillRect(this.x - maskW / 2, this.y, maskW, maskH);
    this.setMask(maskGraphics.createGeometryMask());

    for (let i = 0; i < 5; i++) {
      const reel = new Reel(this.scene, (i - 2) * columnWidth, 0, i);
      this.add(reel);
      this.reels.push(reel);
    }
  }

  fill(stopBox) {
    this.reels.forEach((reel, i) => reel.fill(stopBox[i]));
  }

  startSpin() {
    this.reels.forEach((reel, i) => {
      this.scene.time.delayedCall(i * 100, () => reel.spin());
    });
  }

  stopSpin(stopBox) {
    this.reels.forEach((reel, i) => {
      this.scene.time.delayedCall(i * 300, () => {
        reel.stop(stopBox[i]);
      });
    });
  }

  getSymbolAt(reelIndex, rowIndex) {
    const reel = this.reels[reelIndex];
    if (!reel) return null;

    const sorted = [...reel.symbols].sort(
      (a, b) => Math.round(a.y) - Math.round(b.y),
    );

    return sorted[rowIndex + 1];
  }

  update(time, delta) {
    this.reels.forEach((reel) => reel.update(time, delta));
  }
}
