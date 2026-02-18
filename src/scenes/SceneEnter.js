import Phaser from "phaser";

export default class SceneEnter extends Phaser.Scene {
  constructor() {
    super("SceneEnter");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.image(0, 0, "main_bg").setOrigin(0);

    const style = {
      fontFamily: "Arial",
      fontSize: "64px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6,
    };

    const tapText = this.add.text(
      width / 2,
      height / 2 + 200,
      "TAP TO PLAY",
      style,
    );
    tapText.setOrigin(0.5);

    this.tweens.add({
      targets: tapText,
      angle: { from: -1, to: 1 },
      duration: 1000,
      yoyo: true,
      loop: -1,
      ease: "Linear",
    });

    this.input.once("pointerdown", () => {
      this.scene.start("SceneMainMenu");
    });
  }
}
