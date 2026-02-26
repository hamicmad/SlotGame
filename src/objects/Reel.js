import Phaser from "phaser";
import Symbol from "./Symbol.js";
import { SYMBOLS_CONFIG } from "../configs/symbolsConfig.js";
import { GameEvents } from "../objects/Events.js";

export default class Reel extends Phaser.GameObjects.Container {
  constructor(scene, x, y, index) {
    super(scene, x, y);
    this.index = index;
    this.symbolHeight = SYMBOLS_CONFIG.REEL.SYMBOL_HEIGHT;
    this.symbols = [];
    this.isSpinning = false;
    this.stopping = false;
    this.shouldFinalize = false;
    this.targetIds = [];
    this.symbolsPlaced = 0;
    this.upSymbol = null;
    this.createSymbols();
  }

  createSymbols() {
    for (let i = 0; i < 5; i++) {
      const symbolY = (i - 1) * this.symbolHeight + this.symbolHeight / 2;
      const symbol = new Symbol(this.scene, 0, symbolY, 0);
      this.add(symbol);
      this.symbols.push(symbol);
    }
  }

  fill(ids) {
    this.symbols.sort((a, b) => a.y - b.y);
    for (let i = 0; i < 3; i++) {
      this.symbols[i + 1].setSymbolId(ids[i]);
    }
  }

  spin() {
    this.isSpinning = true;
    this.stopping = false;
    this.shouldFinalize = false;
    this.symbolsPlaced = 0;
    this.upSymbol = null;
    this.symbols.forEach((s) => s.blurSymbols(true));
  }

  stop(targetColumnIds) {
    this.targetIds = targetColumnIds;
    this.stopping = true;
  }

  update() {
    if (!this.isSpinning) return;

    const speed = SYMBOLS_CONFIG.REEL.SPIN_SPEED;
    const limitY = this.symbolHeight * 3.5;

    this.symbols.forEach((symbol) => {
      symbol.y += speed;

      if (symbol.y >= limitY) {
        symbol.y -= 5 * this.symbolHeight;

        if (this.stopping && this.symbolsPlaced < 3) {
          const mapping = [2, 1, 0];
          const targetIndex = mapping[this.symbolsPlaced];

          symbol.setSymbolId(this.targetIds[targetIndex]);

          if (targetIndex === 0) {
            this.upSymbol = symbol;
            this.shouldFinalize = true;
          }
          this.symbolsPlaced++;
        } else {
          const randomId = Phaser.Math.Between(0, 9);
          symbol.setSymbolId(randomId);
        }
      }
    });

    if (this.shouldFinalize && this.upSymbol) {
      const targetY = this.symbolHeight * 0.5;

      if (this.upSymbol.y + speed >= targetY) {
        this.completeStop();
      }
    }
  }

  completeStop() {
    this.isSpinning = false;
    this.shouldFinalize = false;

    this.symbols.sort((a, b) => Math.round(a.y) - Math.round(b.y));

    const currentIds = [
      this.symbols[1].symbolId,
      this.symbols[2].symbolId,
      this.symbols[3].symbolId,
    ];

    const offset = this.symbolHeight / 2;
    let completedTweens = 0;

    this.symbols.forEach((symbol, i) => {
      symbol.blurSymbols(false);
      const finalY = (i - 1) * this.symbolHeight + offset;

      this.scene.tweens.add({
        targets: symbol,
        y: finalY,
        duration: 600,
        ease: "Back.out",
        onComplete: () => {
          completedTweens++;
          if (completedTweens === this.symbols.length) {
            const finalIds = [
              this.symbols[1].symbolId,
              this.symbols[2].symbolId,
              this.symbols[3].symbolId,
            ];

            this.scene.events.emit(GameEvents.GAME.REEL_STOPPED, this.index);
          }
        },
      });
    });
  }
}
