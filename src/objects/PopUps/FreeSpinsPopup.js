import Phaser from "phaser";
import BasePopup from "./BasePopup.js";
import Button from "../Buttons.js"; // Убедись, что путь верный

export default class FreeSpinsPopup extends BasePopup {
  constructor(scene, spinsCount) {
    super(scene, "PopUps", "FREE SPINS");

    const counterBg = scene.add.image(0, 50, "PopUps", "Pop Up Message Small");

    const spinsText = scene.add
      .text(0, 30, `${spinsCount}`, {
        fontSize: "120px",
        fontFamily: "Dosis, Arial",
        fill: "#ffcc00",
        fontWeight: "900",
        stroke: "#663300",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.startButton = new Button(
      scene,
      0,
      230,
      "ui",
      { normal: "Button Spin Normal", pressed: "Button Spin Hover" },
      "START",
      "40px",
      this.baseTextStyle, // Можно прокинуть из сцены или задать тут
      () => {
        this.emit("close"); // Это закроет попап и запустит SceneDeal.final()
      },
    );

    this.add([counterBg, spinsText, this.startButton]);
  }
}
