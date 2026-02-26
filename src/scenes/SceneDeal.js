import Phaser from "phaser";
import { GameEvents } from "../objects/Events.js";
import { LINES_CONFIG } from "../configs/linesConfig.js";

export default class SceneDeal extends Phaser.Scene {
  constructor() {
    super("SceneDeal");
  }

  init(data) {
    this.stopBox = data.stopBox;
    this.reelsManager = data.reelsManager;
    this.winData = data.winData;
    this.stoppedCount = 0;
  }

  create() {
    const mainMenu = this.scene.get("SceneMainMenu");

    mainMenu.events.off(GameEvents.GAME.REEL_STOPPED);

    this.reelsManager.startSpin();

    this.time.delayedCall(1500, () => {
      this.events.emit(GameEvents.GAME.REELS_STOPPING);
      this.reelsManager.stopSpin(this.stopBox);
    });

    mainMenu.events.on(GameEvents.GAME.REEL_STOPPED, () => {
      this.stoppedCount++;
      if (this.stoppedCount === 5) {
        this.handleAllStopped(mainMenu);
      }
    });
  }

  handleAllStopped(mainMenu) {
    this.events.emit(GameEvents.GAME.ALL_STOPPED);

    if (this.winData.totalWin > 0 || this.winData.freeSpinsAwarded > 0) {
      this.showWinSequence(mainMenu);
    } else {
      this.time.delayedCall(200, () => this.final(mainMenu));
    }
  }

  showWinSequence(mainMenu) {
    this.winData.winningCoords.forEach((c) => {
      const s = this.reelsManager.getSymbolAt(c.reel, c.row);
      if (s && s.playAnim) s.playAnim();
    });

    if (this.winData.totalWin > 0) {
      mainMenu.panel.setValue("YOUR WIN", this.winData.totalWin);
      this.showWinPopup(this.winData.totalWin);
      this.drawAllWinLines();
    }

    if (this.winData.freeSpinsAwarded > 0) {
      this.time.delayedCall(2000, () => {
        mainMenu.popupManager.show("FREE_SPINS", this.winData.freeSpinsAwarded);
        mainMenu.popupManager.once("close", () => {
          this.final(mainMenu, true);
        });
      });
    } else {
      const delay = this.winData.totalWin > 0 ? 2000 : 500;
      this.time.delayedCall(delay, () => this.final(mainMenu));
    }
  }

  showWinPopup(totalWin) {
    const currentBet = this.winData.isFreeSpin
      ? this.winData.bet * this.winData.activeLines
      : this.winData.totalBet;

    const ratio = totalWin / (currentBet || 200);

    let texture = "";
    let isBigWin = false;

    if (ratio >= 50) texture = "megaWin";
    else if (ratio >= 20) texture = "hugeWin";
    else if (ratio >= 10) isBigWin = true;

    if (!texture && !isBigWin) return;

    const { width, height } = this.scale;
    const targets = [];

    const title = texture
      ? this.add.image(width / 2, height / 2 - 50, texture)
      : this.add
          .text(width / 2, height / 2 - 50, "BIG WIN", {
            fontSize: "110px",
            fill: "#ffcc00",
            stroke: "#663300",
            strokeThickness: 10,
            fontFamily: "Arial Black",
          })
          .setOrigin(0.5);

    title.setDepth(100).setScale(0);
    targets.push(title);

    const winText = this.add
      .text(width / 2, height / 2 + 150, `+${Math.floor(totalWin)}`, {
        fontSize: "90px",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 8,
        fontFamily: "Arial Black",
      })
      .setOrigin(0.5)
      .setDepth(101)
      .setScale(0);
    targets.push(winText);

    this.tweens.add({
      targets: targets,
      scale: 1,
      ease: "Back.out",
      duration: 600,
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.tweens.add({
            targets: targets,
            alpha: 0,
            scale: 1.2,
            duration: 500,
            onComplete: () => targets.forEach((t) => t.destroy()),
          });
        });
      },
    });
  }

  drawAllWinLines() {
    const graphics = this.add.graphics().setDepth(10);
    this.winData.winningLines.forEach((winLine) => {
      const lineCoords = LINES_CONFIG[winLine.lineIndex];
      graphics.lineStyle(8, 0xffcc00, 1);
      graphics.beginPath();

      lineCoords.forEach((row, reel) => {
        const symbol = this.reelsManager.getSymbolAt(reel, row);
        if (symbol) {
          const x = this.reelsManager.x + this.reelsManager.reels[reel].x;
          const y = this.reelsManager.y + symbol.y;
          if (reel === 0) graphics.moveTo(x, y);
          else graphics.lineTo(x, y);
        }
      });
      graphics.strokePath();
    });
    this.time.delayedCall(2000, () => graphics.destroy());
  }

  final(mainMenu, fromFS = false) {
    mainMenu.events.off(GameEvents.GAME.REEL_STOPPED);

    if (this.winData.totalWin > 0) {
      mainMenu.animateBalance(
        this.winData.newBalance,
        this.winData.totalWin,
        this.winData.balanceBeforeSpin,
      );
    }

    if (this.winData.freeSpinsRemaining > 0) {
      mainMenu.panel.setFreeSpinMode(true, this.winData.freeSpinsRemaining);
    } else if (
      this.winData.isFreeSpin &&
      this.winData.freeSpinsRemaining === 0
    ) {
      mainMenu.exitFreeSpins();
    }

    const keepLocked =
      mainMenu.isAutoSpin || this.winData.freeSpinsRemaining > 0;
    if (!keepLocked) {
      mainMenu.panel.setLocked(false);
    }

    if (keepLocked) {
      const delay = this.winData.totalWin > 0 ? 1500 : 600;
      mainMenu.time.delayedCall(delay, () => {
        mainMenu.handleStartSpin();
      });
    }

    this.scene.stop();
  }
}
