import Phaser from "phaser";
import PanelBot from "../objects/PanelBot.js"; // Путь к твоему классу панели

export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super("SceneMainMenu");
  }

  create() {
    const { width, height } = this.scale;
    console.log("MainMenu1");

    this.add.image(0, 0, "main_bg").setOrigin(0);

    this.panelBot = new PanelBot(this, width / 2, height - 120);

    this.events.on("START_SPIN", () => {
      this.scene.start("SceneDeal");
    });

    console.log("MainMenu2");
  }
}
