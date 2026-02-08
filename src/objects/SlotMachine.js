import Phaser from "phaser";
import Reel from "./Reel.js";
import { SYMBOLS_CONFIG } from "../configs/symbolsConfig.js";

export default class SlotMachine extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.reels = [];
    this.createMachine();
    scene.add.existing(this);
  }

  createMachine() {
    const columnWidth = 250;
    const maskW = columnWidth * 5;
    const maskH = SYMBOLS_CONFIG.REEL.SYMBOL_HEIGHT * 3;

    const maskGraphics = this.scene.make.graphics();
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillRect(this.x - maskW / 2, this.y, maskW, maskH);
    const mask = maskGraphics.createGeometryMask();
    this.setMask(mask);

    for (let i = 0; i < 5; i++) {
      const reelX = (i - 2) * columnWidth;
      const reel = new Reel(this.scene, reelX, 0);
      this.add(reel);
      this.reels.push(reel);
    }
  }

  startSpin() {
    this.reels.forEach((reel, i) => {
      this.scene.time.delayedCall(i * 50, () => reel.spin());
    });
  }

  stopSpin(stopIndex) {
    stopIndex.forEach((targetId, i) => {
      this.scene.time.delayedCall(i * SYMBOLS_CONFIG.REEL.STOP_DELAY, () => {
        this.reels[i].stop(targetId);
      });
    });
  }

  //Синхронизация между main и deal
  sync(stopIndex, sourceReels) {
    this.reels.forEach((reel, i) => {
      reel.setFinalSymbols(stopIndex[i], sourceReels[i].symbols);
    });
  }

  update(time, delta) {
    this.reels.forEach((reel) => reel.update(time, delta));
  }
}
