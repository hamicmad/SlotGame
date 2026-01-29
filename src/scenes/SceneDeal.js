import Phaser from "phaser";
import Reel from "../objects/Reel.js";
import PanelBot from "../objects/PanelBot.js";

export default class SceneDeal extends Phaser.Scene {
  constructor() {
    super("SceneDeal");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(0, 0, "main_bg").setOrigin(0).setDepth(0);

    this.panelbot = new PanelBot(this, width / 2, height - 120);
    this.panelbot.setDepth(100);

    const centerX = 960;
    const centerY = 478;
    const maskW = 1230;
    const maskH = 738;
    const maskX = centerX - maskW / 2;
    const maskY = centerY - maskH / 2;

    const maskGraphics = this.make.graphics();
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillRect(maskX, maskY, maskW, maskH);
    this.reelMask = maskGraphics.createGeometryMask();

    this.reelsContainer = this.add.container(maskX, maskY);
    this.reelsContainer.setMask(this.reelMask);
    this.reelsContainer.setDepth(5);

    this.createReels(maskW);

    this.events.on("START_SPIN", () => {
      this.panelbot.disableButtons();

      this.reels.forEach((reel) => reel.spin());

      this.time.delayedCall(2000, () => {
        this.reels.forEach((reel, index) => {
          this.time.delayedCall(index * 250, () => {
            reel.stop();

            if (index === this.reels.length - 1) {
              this.panelbot.enableButtons();
            }
          });
        });
      });
    });
  }

  createReels(mW) {
    const columnWidth = mW / 5;
    const startX = columnWidth / 2;

    this.reels = [];

    for (let i = 0; i < 5; i++) {
      const reel = new Reel(this, startX + i * columnWidth, 0, i);

      this.reelsContainer.add(reel);
      this.reels.push(reel);
    }
  }

  update() {
    if (this.reels) {
      this.reels.forEach((reel) => {
        reel.update();
      });
    }
  }
}
