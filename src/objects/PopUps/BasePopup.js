import Phaser from "phaser";
import Button from "../Buttons.js";

export default class BasePopup extends Phaser.GameObjects.Container {
  constructor(scene, bgFrame, titleText) {
    super(scene, 0, 0);
    this.scene = scene;

    const bg = scene.add.image(0, 0, "PopUps1", bgFrame);
    this.add(bg);

    const flag = scene.add
      .image(0, -330, "PopUps", "Flag Title Long")
      .setOrigin(0.5);
    const title = scene.add
      .text(0, -435, titleText, {
        fontSize: "45px",
        fontFamily: "Dosis, Arial",
        fill: "#ffffff",
        fontWeight: "800",
      })
      .setOrigin(0.5);
    this.add([flag, title]);

    // const closeBtn = new Button(
    //   scene,
    //   420,
    //   -330,
    //   "PopUps",
    //   { normal: "Exit Icon Normal", pressed: "Exit Icon Hover" },
    //   "",
    //   "1px",
    //   {},
    //   () => this.emit("close"),
    // );
    // this.add(closeBtn);
  }
}
