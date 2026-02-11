import Phaser from "phaser";
import Reel from "./Reel.js";
import { SYMBOLS_CONFIG } from "../configs/symbolsConfig.js";
import { LINES_CONFIG } from "../configs/linesConfig.js";

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
      const reel = new Reel(this.scene, reelX, 0, i);
      this.add(reel);
      this.reels.push(reel);
    }
  }

  startSpin() {
    this.setAllBlur(true);

    this.reels.forEach((reel, i) => {
      this.scene.time.delayedCall(i * 100, () => reel.spin());
    });
  }

  setAllBlur(isBlur) {
    this.reels.forEach((reel) => {
      reel.setBlur(isBlur);
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

  getSymbols() {
    let matrix = [];
    const height = SYMBOLS_CONFIG.REEL.SYMBOL_HEIGHT;
    const offset = height / 2; // 125

    this.reels.forEach((reel) => {
      const column = [];
      for (let row = 0; row < 3; row++) {
        let targetY = row * height + offset;

        let symbol = reel.symbols.find((sym) => Math.round(sym.y) === targetY);
        if (symbol) {
          column.push(symbol.symbolId);
        }
      }
      matrix.push(column);
    });
    return matrix;
  }

  checkAllLines() {
    const matrix = this.getSymbols();
    const wins = [];

    LINES_CONFIG.forEach((line, index) => {
      const symbolsOnLine = [];

      for (let colId = 0; colId < 5; colId++) {
        const rowId = line[colId];
        const id = matrix[colId][rowId];
        symbolsOnLine.push(id);
      }

      let matchCount = 1;
      let firstId = symbolsOnLine[0];

      for (let i = 1; i < 5; i++) {
        if (symbolsOnLine[i] === firstId) {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount >= 3) {
        wins.push({
          lineId: index,
          matches: matchCount,
          symbolId: firstId,
        });
      }
    });

    return wins;
  }
}
