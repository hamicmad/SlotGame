import Phaser from "phaser";

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
      this.reelsManager.stopSpin(this.stopBox);
    });

    const mainMenu = this.scene.get("SceneMainMenu");
    mainMenu.events.off("REEL_STOPPED");

    mainMenu.events.on("REEL_STOPPED", (index) => {
      this.stoppedCount++;

      if (this.stoppedCount === 5) {
        if (this.winData && this.winData.totalWin > 0) {
          this.showWin();
        } else {
          this.time.delayedCall(200, () => this.final(mainMenu));
        }
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
    this.showWinPopup(this.winData.totalWin);

    this.winData.winningCoords.forEach((coord) => {
      const symbol = this.reelsManager.getSymbolAt(coord.reel, coord.row);
      if (symbol) symbol.playAnim();
    });

    const mainMenu = this.scene.get("SceneMainMenu");
    this.time.delayedCall(2000, () => this.final(mainMenu));
  }

  final(mainMenu) {
    if (this.winData.totalWin > 0) {
      mainMenu.animateBalance(this.winData.newBalance, this.winData.totalWin);
    }

    mainMenu.events.emit("UNLOCK_INTERFACE");
    this.scene.stop("SceneDeal");
  }
}
