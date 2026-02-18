import { LINES_CONFIG } from "../configs/linesConfig.js";
import { PAYTABLE } from "../configs/payTableConfig.js";

export default class ServerAnalytics {
  constructor() {
    this.balance = 2000;
    this.totalBet = 200;
    this.activeLines = 20;
    this.WILD_ID = 9;
  }

  getNextSpin() {
    const totalCost = this.totalBet;
    if (this.balance < totalCost) {
      return null;
    }

    this.balance -= totalCost;
    const betPerLine = this.totalBet / this.activeLines;

    let stopBox = [];
    for (let i = 0; i < 5; i++) {
      stopBox[i] = [];
      for (let j = 0; j < 3; j++) {
        stopBox[i][j] = Math.floor(Math.random() * 10);
      }
    }

    const winningLines = [];
    const winningCoords = [];
    let totalWin = 0;

    for (let lineIndex = 0; lineIndex < this.activeLines; lineIndex++) {
      const line = LINES_CONFIG[lineIndex];
      let targetSymbolId = -1;
      let matchCount = 0;

      for (let i = 0; i < line.length; i++) {
        const currentId = stopBox[i][line[i]];
        if (currentId !== this.WILD_ID) {
          targetSymbolId = currentId;
          break;
        }
      }

      if (targetSymbolId === -1) targetSymbolId = this.WILD_ID;

      for (let i = 0; i < line.length; i++) {
        const currentId = stopBox[i][line[i]];
        if (currentId === targetSymbolId || currentId === this.WILD_ID) {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount >= 3) {
        const symbolData = PAYTABLE[targetSymbolId];
        const multiplier = symbolData[matchCount] || 0;
        const payout = multiplier * betPerLine;

        if (payout > 0) {
          totalWin += payout;
          winningLines.push({
            lineIndex,
            symbolId: targetSymbolId,
            count: matchCount,
            payout,
          });

          for (let i = 0; i < matchCount; i++) {
            winningCoords.push({ reel: i, row: line[i] });
          }
        }
      }
    }

    const uniqueCoords = winningCoords.filter(
      (v, i, a) =>
        a.findIndex((t) => t.reel === v.reel && t.row === v.row) === i,
    );

    this.balance += totalWin;

    return {
      stopBox,
      newBalance: this.balance,
      totalWin,
      winningLines,
      winningCoords: uniqueCoords,
      bet: betPerLine,
      totalBet: this.totalBet,
      activeLines: this.activeLines,
    };
  }

  getBalance() {
    return this.balance;
  }
}
