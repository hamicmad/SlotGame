import Phaser from "phaser";

export default class ScenePreload extends Phaser.Scene {
  constructor() {
    super("ScenePreload");
  }

  preload() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.image(width / 2, height / 2, "bar_empty");

    const fullBar = this.add.image(width / 2, height / 2, "bar_full");

    const maskImage = this.make.image({
      x: width / 2,
      y: height / 2,
      key: "bar_mask",
      add: false,
    });

    const bitMask = maskImage.createBitmapMask();
    fullBar.setMask(bitMask);

    const barWidth = fullBar.width;
    maskImage.x = width / 2 - barWidth;

    this.load.image("main_bg", "assets/images/bg.png");
    this.load.image("bigPlate", "assets/images/BigPlate.png");
    this.load.image("smallPlate", "assets/images/SmallPlate.png");
    this.load.atlas(
      "symbols",
      "assets/atlas/symbols.png",
      "assets/atlas/symbols.json",
    );
    this.load.atlas("ui", "assets/atlas/ui.png", "assets/atlas/ui.json");

    this.load.font("Dosis", "assets/fonts/Dosis.ttf");

    this.load.on("progress", (value) => {
      maskImage.x = width / 2 - barWidth + barWidth * value;
    });

    this.load.on("complete", () => {
      this.time.delayedCall(1000, () => {
        this.scene.start("SceneEnter");
      });
    });
  }

  create() {
    console.log("Assets loaded");
  }
}
