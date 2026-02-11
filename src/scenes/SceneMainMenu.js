import Phaser from "phaser";
import Panel from "../objects/Panel.js";
import SlotMachine from "../objects/SlotMachine.js";

export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super("SceneMainMenu");
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(0, 0, "main_bg").setOrigin(0);

    this.slotMachine = new SlotMachine(this, width / 2, 100);

    this.panel = new Panel(this, width / 2, height - 120, false);

    this.events.off("START_SPIN");
    this.events.on("START_SPIN", this.handleStartSpin, this);

    this.events.off("UNLOCK_INTERFACE");
    this.events.on("UNLOCK_INTERFACE", () => this.panel.setLocked(false));
  }

  handleStartSpin() {
    this.panel.setLocked(true);
    this.slotMachine.setVisible(false);

    const stopIndex = Array.from({ length: 5 }, () =>
      Phaser.Math.Between(0, 9),
    );
    this.scene.launch("SceneDeal", { stopIndex });
  }
}
