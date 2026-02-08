import Phaser from "phaser";
import Symbol from "./Symbol.js"; // Импортируем наш новый класс
import { SYMBOLS_CONFIG } from "../configs/symbolsConfig.js";

export default class Reel extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.symbolHeight = SYMBOLS_CONFIG.REEL.SYMBOL_HEIGHT;
    this.isSpinning = false;
    this.stopping = false;
    this.targetSymbolId = null;
    this.symbols = [];
    this.createSymbols();
  }

  createSymbols() {
    this.removeAll(true);
    this.symbols = [];
    for (let i = -1; i < 3; i++) {
      const randomId = Phaser.Math.Between(0, 9);
      const symbol = new Symbol(this.scene, 0, i * this.symbolHeight, randomId);
      this.add(symbol);
      this.symbols.push(symbol);
    }
  }

  spin() {
    this.isSpinning = true;
    this.stopping = false;
    this.targetSymbolId = null;
    this.shouldFinalize = false;
    this.targetSymbolObject = null;
  }

  stop(id) {
    this.targetSymbolId = id;
    this.stopping = true;
  }

  update() {
    if (!this.isSpinning || this.scene.isClosing) return;

    const speed = SYMBOLS_CONFIG.REEL.SPIN_SPEED;
    const limitY = 2 * this.symbolHeight;

    this.symbols.forEach((symbol) => {
      symbol.y += speed;

      if (symbol.y >= limitY + this.symbolHeight) {
        symbol.y -= 4 * this.symbolHeight;

        if (this.stopping && this.targetSymbolId !== null) {
          symbol.setSymbolId(this.targetSymbolId);
          this.targetSymbolObject = symbol;
          this.targetSymbolId = null;
          this.shouldFinalize = true;
        } else if (!this.shouldFinalize) {
          const randomId = Phaser.Math.Between(0, 9);
          symbol.setSymbolId(randomId);
        }
      }
    });

    if (this.shouldFinalize && this.targetSymbolObject) {
      if (Math.abs(this.targetSymbolObject.y - this.symbolHeight) < speed) {
        this.shouldFinalize = false;
        this.completeStop();
      }
    }
  }

  completeStop() {
    this.isSpinning = false;
    this.stopping = false;
    let completed = 0;

    this.symbols.forEach((symbol) => {
      const targetY =
        Math.round(symbol.y / this.symbolHeight) * this.symbolHeight;
      this.scene.tweens.add({
        targets: symbol,
        y: targetY,
        duration: 600,
        ease: "Back.out",
        onComplete: () => {
          completed++;
          if (completed === this.symbols.length) {
            this.scene.events.emit("REEL_STOPPED");
          }
        },
      });
    });
  }

  // синх сцен
  setFinalSymbols(targetId, sourceSymbols) {
    this.scene.tweens.killTweensOf(this.symbols);

    const mySorted = [...this.symbols].sort((a, b) => a.y - b.y);
    const sourceSorted = [...sourceSymbols].sort((a, b) => a.y - b.y);

    mySorted.forEach((symbol, i) => {
      symbol.copyFrom(sourceSorted[i]);

      if (Math.abs(symbol.y - this.symbolHeight) < 50) {
        symbol.setSymbolId(targetId);
      }
    });
  }
}
