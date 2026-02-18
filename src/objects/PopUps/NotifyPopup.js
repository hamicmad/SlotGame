import BasePopup from "./BasePopup.js";
import Button from "../Buttons.js";

export default class NotifyPopup extends BasePopup {
  constructor(scene, message) {
    super(scene, "Pop Up Message", "ВНИМАНИЕ");

    const textStyle = {
      fontFamily: "Dosis, Arial, sans-serif",
      fontSize: "42px",
      fill: "#000000",
      fontWeight: "800",
      stroke: "#ffffff",
      strokeThickness: 2,
    };

    this.messageText = scene.add
      .text(0, -20, message, textStyle)
      .setOrigin(0.5);
    this.add(this.messageText);

    this.okBtn = new Button(
      scene,
      0,
      190,
      "ui",
      { normal: "Button Spin Normal", pressed: "Button Spin Hover" },
      "OK",
      "40px",
      { fontFamily: "Dosis", fontWeight: "800", fill: "#ffffff" },
      () => this.emit("close"),
    );
    this.okBtn.setScale(0.6);
    this.add(this.okBtn);
  }
}
