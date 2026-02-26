import { LINES_CONFIG } from "../configs/linesConfig.js";
import { PAYTABLE, FREE_SPINS_CONFIG } from "../configs/payTableConfig.js";

export default class ServerAnalytics {
  constructor() {
    this.balance = 2000;
    this.activeLines = 20;
    this.betSteps = [1, 2, 5, 10, 20, 50, 100];
    this.currentStepIndex = 3;

    this.WILD_ID = 9;
    this.SCATTER_ID = 10;

    this.freeSpinsRemaining = 0;
    this.freeSpinsTotalBet = 0;
    this.isFreeSpin = false;
  }

  get betPerLine() {
    return this.betSteps[this.currentStepIndex];
  }
  get totalBet() {
    return this.betPerLine * this.activeLines;
  }

  changeBetStep(direction) {
    if (this.isFreeSpin) return;
    const nextIndex = Phaser.Math.Clamp(
      this.currentStepIndex + direction,
      0,
      this.betSteps.length - 1,
    );
    if (this.betSteps[nextIndex] * this.activeLines <= this.balance)
      this.currentStepIndex = nextIndex;
  }

  setMaxBet() {
    if (this.isFreeSpin) return;
    for (let i = this.betSteps.length - 1; i >= 0; i--) {
      if (this.betSteps[i] * this.activeLines <= this.balance) {
        this.currentStepIndex = i;
        break;
      }
    }
  }

  getNextSpin() {
    const wasFreeSpin = this.freeSpinsRemaining > 0;
    this.isFreeSpin = wasFreeSpin;

    if (!wasFreeSpin) {
      this.freeSpinsTotalBet = this.totalBet;
    }

    const currentTotalBet = wasFreeSpin
      ? this.freeSpinsTotalBet
      : this.totalBet;
    const betPerLine = currentTotalBet / this.activeLines;

    if (!wasFreeSpin && this.balance < currentTotalBet) return null;
    if (!wasFreeSpin) this.balance -= currentTotalBet;

    let stopBox = Array.from({ length: 5 }, () =>
      Array.from({ length: 3 }, () => Math.floor(Math.random() * 11)),
    );

    if (wasFreeSpin) {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
          if (stopBox[i][j] === this.SCATTER_ID) {
            stopBox[i][j] = Math.floor(Math.random() * 9);
          }
        }
      }
    }

    let scatterCount = 0;
    let scatterPositions = [];
    stopBox.forEach((reel, i) =>
      reel.forEach((id, j) => {
        if (id === this.SCATTER_ID) {
          scatterCount++;
          scatterPositions.push({ reel: i, row: j });
        }
      }),
    );

    const winningLines = [];
    const winningCoords = [];
    let totalWin = 0;

    for (let lineIndex = 0; lineIndex < this.activeLines; lineIndex++) {
      const line = LINES_CONFIG[lineIndex];
      let targetSymbolId = -1;
      let matchCount = 0;

      for (let i = 0; i < line.length; i++) {
        const id = stopBox[i][line[i]];
        if (id !== this.SCATTER_ID && id !== this.WILD_ID) {
          targetSymbolId = id;
          break;
        }
      }

      if (targetSymbolId === -1) {
        let lineHasScatter = line.some(
          (row, reel) => stopBox[reel][row] === this.SCATTER_ID,
        );
        if (!lineHasScatter) targetSymbolId = this.WILD_ID;
      }

      if (targetSymbolId !== -1) {
        for (let i = 0; i < line.length; i++) {
          const id = stopBox[i][line[i]];
          if (id === targetSymbolId || id === this.WILD_ID) matchCount++;
          else break;
        }
        if (matchCount >= 3) {
          const payout =
            (PAYTABLE[targetSymbolId][matchCount] || 0) * betPerLine;
          if (payout > 0) {
            totalWin += payout;
            winningLines.push({
              lineIndex,
              symbolId: targetSymbolId,
              count: matchCount,
              payout,
            });
            for (let i = 0; i < matchCount; i++)
              winningCoords.push({ reel: i, row: line[i] });
          }
        }
      }
    }

    this.balance += totalWin;

    let freeSpinsAwarded = 0;
    if (!wasFreeSpin && scatterCount >= 3) {
      freeSpinsAwarded = FREE_SPINS_CONFIG[scatterCount] || 0;
      this.freeSpinsRemaining += freeSpinsAwarded;
    }

    if (wasFreeSpin) this.freeSpinsRemaining--;

    const allUniqueCoords = [...winningCoords, ...scatterPositions].filter(
      (v, i, a) =>
        a.findIndex((t) => t.reel === v.reel && t.row === v.row) === i,
    );

    return {
      stopBox,
      balanceBeforeSpin: this.balance - totalWin,
      newBalance: this.balance,
      totalWin,
      winningLines,
      winningCoords: allUniqueCoords,
      scatterCount,
      scatterPositions,
      freeSpinsAwarded,
      freeSpinsRemaining: this.freeSpinsRemaining,
      isFreeSpin: wasFreeSpin,
      bet: betPerLine,
      totalBet: currentTotalBet,
      activeLines: this.activeLines,
    };
  }

  getBalance() {
    return this.balance;
  }
}
