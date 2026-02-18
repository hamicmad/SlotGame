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
    this.stoppedCount = 0;
    this.reelsManager.startSpin();

    this.time.delayedCall(1500, () => {
      this.events.emit(GameEvents.GAME.REELS_STOPPING);
      this.reelsManager.stopSpin(this.stopBox);
    });

    const mainMenu = this.scene.get("SceneMainMenu");

    mainMenu.events.off(GameEvents.GAME.REEL_STOPPED);
    mainMenu.events.on(GameEvents.GAME.REEL_STOPPED, () => {
      this.stoppedCount++;

      if (this.stoppedCount === 5) {
        this.events.emit(GameEvents.GAME.ALL_STOPPED);
        if (this.winData.totalWin > 0) this.showWin();
        else this.time.delayedCall(200, () => this.final(mainMenu));
      }
    });
  }

  showWinPopup(totalWin) {
    const bet = 10;
    const ratio = totalWin / bet;
    let texture = "";
    let isTextOnly = false;

    if (ratio >= 50) {
      texture = "megaWin";
    } else if (ratio >= 20) {
      texture = "hugeWin";
    } else if (ratio >= 10) {
      isTextOnly = true;
    }

    if (!texture && !isTextOnly) return;

    const { width, height } = this.scale;
    const targets = [];

    if (!isTextOnly) {
      const popup = this.add
        .image(width / 2, height / 2, texture)
        .setDepth(100)
        .setScale(0);
      targets.push(popup);
    }

    if (isTextOnly) {
      const bigWinTitle = this.add
        .text(width / 2, height / 2 - 50, "BIG WIN", {
          fontSize: "110px",
          fill: "#ffcc00",
          stroke: "#663300",
          strokeThickness: 10,
          fontFamily: "Arial Black",
        })
        .setOrigin(0.5)
        .setDepth(100)
        .setScale(0);
      targets.push(bigWinTitle);
    }

    const winText = this.add
      .text(width / 2, height / 2 + 200, `+${totalWin}`, {
        fontSize: "82px",
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
            onComplete: () => {
              targets.forEach((t) => t.destroy());
            },
          });
        });
      },
    });
  }

  showWin() {
    const mainMenu = this.scene.get("SceneMainMenu");
    mainMenu.panel.setValue("YOUR WIN", this.winData.totalWin);
    this.showWinPopup(this.winData.totalWin);

    this.winData.winningCoords.forEach((c) => {
      const s = this.reelsManager.getSymbolAt(c.reel, c.row);
      if (s) s.playAnim();
    });

    this.drawAllWinLines();

    this.time.delayedCall(2000, () => this.final(mainMenu));
  }

  drawAllWinLines() {
    const graphics = this.add.graphics().setDepth(10);

    this.winData.winningLines.forEach((winLine) => {
      const lineCoords = LINES_CONFIG[winLine.lineIndex];

      graphics.lineStyle(8, 0xffcc00, 1);
      graphics.beginPath();

      lineCoords.forEach((row, reel) => {
        const symbol = this.reelsManager.getSymbolAt(reel, row);
        const x = this.reelsManager.x + this.reelsManager.reels[reel].x;
        const y = this.reelsManager.y + symbol.y;

        if (reel === 0) graphics.moveTo(x, y);
        else graphics.lineTo(x, y);
      });

      graphics.strokePath();
    });

    this.time.delayedCall(2000, () => graphics.destroy());
  }
  final(mainMenu) {
    if (this.winData.totalWin > 0) {
      mainMenu.animateBalance(this.winData.newBalance, this.winData.totalWin);
    }

    mainMenu.events.emit(GameEvents.UI.UNLOCK_INTERFACE);

    if (mainMenu.isAutoSpin) {
      const delay = this.winData.totalWin > 0 ? 1200 : 500;

      mainMenu.time.delayedCall(delay, () => {
        if (mainMenu.isAutoSpin) {
          mainMenu.handleStartSpin();
        }
      });
    }

    this.scene.stop();
  }
}
