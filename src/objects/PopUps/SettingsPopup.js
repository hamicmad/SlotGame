import BasePopup from "./BasePopup.js";

export default class SettingsPopup extends BasePopup {
  constructor(scene) {
    super(scene, "Pop Up Settings", "SETTINGS");
    this.createSettings();
  }

  createSettings() {
    this.createToggle(0, -100, "SOUND", "Icon Sound On", "Icon Sound Off");
    this.createToggle(0, 10, "MUSIC", "Icon Music On", "Icon Music Off");
  }

  createToggle(x, y, label, iconOn, iconOff) {
    const text = this.scene.add
      .text(x - 120, y, label, {
        fontSize: "32px",
        fill: "#000",
        fontFamily: "Arial",
        fontWeight: "800",
        stroke: "#000000",
        strokeThickness: 1,
      })
      .setOrigin(1, 0.5);

    const icon = this.scene.add.image(x - 60, y, "PopUps", iconOn);
    const toggleBtn = this.scene.add
      .image(x + 60, y, "PopUps", "Toggle Button On")
      .setInteractive({ useHandCursor: true });

    toggleBtn.isON = true;
    toggleBtn.on("pointerdown", () => {
      toggleBtn.isON = !toggleBtn.isON;
      toggleBtn.setFrame(
        toggleBtn.isON ? "Toggle Button On" : "Toggle Button Off",
      );
      icon.setFrame(toggleBtn.isON ? iconOn : iconOff);
      this.scene.events.emit("CHANGE_" + label, toggleBtn.isON);
    });

    this.add([text, icon, toggleBtn]);
  }
}
