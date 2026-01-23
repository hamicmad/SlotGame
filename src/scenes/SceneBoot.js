import Phaser from "phaser";

export default class SceneBoot extends Phaser.Scene {
  constructor() {
    super("SceneBoot");
  }

  preload() {
    this.load.image("bar_empty", "assets/images/Load Bar Empty.png");
    this.load.image("bar_full", "assets/images/Load Bar Full.png");
    this.load.image("bar_mask", "assets/images/Load Bar Mask.png");
  }

  create() {
    console.log("Boot Scene");
    this.scene.start("ScenePreload");
  }
}
