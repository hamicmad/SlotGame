import Phaser from "phaser";
import SlotMachine from "../objects/SlotMachine.js";

export default class SceneDeal extends Phaser.Scene {
  constructor() {
    super("SceneDeal");
  }

  init(data) {
    this.serverResult = data;
    this.stoppedCount = 0;
    this.isClosing = false;
  }

  create() {
    const { width } = this.scale;

    this.slotMachine = new SlotMachine(this, width / 2, 100);

    this.slotMachine.startSpin();

    this.time.delayedCall(1500, () => {
      this.slotMachine.stopSpin(this.serverResult.stopIndex);
    });

    this.events.on("REEL_STOPPED", () => {
      this.stoppedCount++;
      if (this.stoppedCount === 5) {
        this.time.delayedCall(200, () => this.finishDeal());
      }
    });
  }

  finishDeal() {
    if (this.isClosing) return;
    this.isClosing = true;

    this.tweens.killAll();
    const mainMenu = this.scene.get("SceneMainMenu");

    if (mainMenu) {
      mainMenu.slotMachine.sync(
        this.serverResult.stopIndex,
        this.slotMachine.reels,
      );

      this.slotMachine.setVisible(false);
      mainMenu.slotMachine.setVisible(true);
      mainMenu.events.emit("UNLOCK_INTERFACE");
    }
    this.scene.stop();
  }

  update(time, delta) {
    if (!this.isClosing) this.slotMachine.update(time, delta);
  }
}
