import Phaser from "phaser";
import BasePopup from "./BasePopup.js";

export default class HelpPopup extends BasePopup {
  constructor(scene) {
    super(scene, "Pop Up Paytable", "HELP");

    const textStyle = {
      fontFamily: "Dosis, Arial, sans-serif",
      fontSize: "42px",
      fill: "#000000",
      align: "left",
      lineSpacing: 20,
      fontWeight: "800",
      stroke: "#ffffff",
      strokeThickness: 2,
    };

    const rulesContent =
      "• Выигрышные комбинации считаются слева направо.\n" +
      "• Оплачивается только самый высокий выигрыш на линии.\n" +
      "• Выигрыши по разным линиям суммируются.\n" +
      "• Используйте кнопки ПЛЮС и МИНУС для изменения ставки.";

    const rules = scene.add
      .text(0, -50, rulesContent, textStyle)
      .setOrigin(0.5);
    this.add(rules);
  }
}
