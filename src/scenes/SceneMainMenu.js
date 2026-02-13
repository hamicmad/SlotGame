import Phaser from "phaser";
import ReelsManager from "../objects/ReelsManager.js";
import ServerAnalytics from "../modules/ServerAnalytics.js";
import Panel from "../objects/Panel.js";

export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super("SceneMainMenu");
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "main_bg");

    this.stats = new ServerAnalytics();
    this.reelsManager = new ReelsManager(this, width / 2, 100);
    this.panel = new Panel(this, width / 2, height - 100);

    const initBox = Array(5).fill([0, 1, 2]);
    this.reelsManager.fill(initBox);

    this.panel.setValue("BALANCE", this.stats.getBalance());

    this.events.on("START_SPIN", () => {
      this.handleStartSpin();
    });

    this.events.on("UNLOCK_INTERFACE", () => {
      this.panel.setLocked(false);
    });
  }

  handleStartSpin() {
    const result = this.stats.getNextSpin();
    if (result) {
      const balanceAfterBet = result.newBalance - result.totalWin;
      this.panel.setValue("BALANCE", balanceAfterBet);
      this.panel.setLocked(true);

      this.scene.launch("SceneDeal", {
        stopBox: result.stopBox,
        reelsManager: this.reelsManager,
        winData: result,
      });
    }
  }

  animateBalance(targetBalance, winAmount) {
    this.tweens.killTweensOf(this.panel);
    const startValue = targetBalance - winAmount;
    let displayObj = { val: startValue };

    this.tweens.add({
      targets: displayObj,
      val: targetBalance,
      duration: 1000,
      ease: "Quad.out",
      onUpdate: () => {
        this.panel.setValue("BALANCE", Math.floor(displayObj.val));
      },
      onComplete: () => {
        this.panel.setValue("BALANCE", targetBalance);
      },
    });
  }

  update(time, delta) {
    if (this.reelsManager) this.reelsManager.update(time, delta);
  }
}
