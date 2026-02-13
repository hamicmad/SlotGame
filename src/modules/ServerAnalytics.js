import { LINES_CONFIG } from "../configs/linesConfig.js";
import { PAYTABLE } from "../configs/payTableConfig.js";

export default class ServerAnalytics {
  constructor() {
    this.balance = 5000;
    this.bet = 10;
    this.WILD_ID = 9;
  }

  getNextSpin() {
    if (this.balance < this.bet) return null;

    this.balance -= this.bet;

    let stopBox = [];
    const nreels = 5;
    const nrows = 3;

    for (let i = 0; i < nreels; i++) {
      stopBox[i] = [];
      for (let j = 0; j < nrows; j++) {
        stopBox[i][j] = Math.floor(Math.random() * 10);
      }
    }

    const winningLines = [];
    const winningCoords = [];
    let totalWin = 0;

    LINES_CONFIG.forEach((line, lineIndex) => {
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
        const payout = multiplier * this.bet;

        if (payout > 0) {
          totalWin += payout;
          winningLines.push({
            lineIndex,
            symbolId: targetSymbolId,
            count: matchCount,
            payout,
          });

          for (let i = 0; i < matchCount; i++) {
            const coord = { reel: i, row: line[i] };
            const exists = winningCoords.some(
              (c) => c.reel === coord.reel && c.row === coord.row,
            );
            if (!exists) winningCoords.push(coord);
          }
        }
      }
    });

    this.balance += totalWin;

    console.table(stopBox);

    return {
      stopBox,
      newBalance: this.balance,
      totalWin,
      winningLines,
      winningCoords,
      bet: this.bet,
    };
  }

  getBalance() {
    return this.balance;
  }
}
