import SettingsPopup from "./SettingsPopup.js";
import PaytablePopup from "./PaytablePopup.js";
import HelpPopup from "./HelpPopup.js";
import NotifyPopup from "./NotifyPopup.js";

export default class PopupManager extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, scene.scale.width / 2, scene.scale.height / 2);
    this.scene = scene;
    this.overlay = scene.add
      .rectangle(0, 0, scene.scale.width, scene.scale.height, 0x000000, 0.7)
      .setInteractive();
    this.overlay.on("pointerdown", () => this.hide());

    this.add(this.overlay);
    this.setVisible(false);
    scene.add.existing(this);
  }

  show(type, data = null) {
    if (this.current) this.current.destroy();

    switch (type) {
      case "SETTINGS":
        this.current = new SettingsPopup(this.scene);
        break;
      case "PAYTABLE":
        this.current = new PaytablePopup(this.scene);
        break;
      case "HELP":
        this.current = new HelpPopup(this.scene);
        break;
      case "NOTIFY":
        const msg =
          typeof data === "string" ? data : data?.message || "Произошла ошибка";
        this.current = new NotifyPopup(this.scene, msg);
        break;
      default:
        console.error("Unknown popup:", type);
        return;
    }

    this.current.on("close", () => this.hide());
    this.add(this.current);

    this.setVisible(true);
    this.setDepth(2000);
    this.setScale(0.5);
    this.alpha = 0;

    this.scene.tweens.add({
      targets: this,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: "Back.out",
    });
  }

  hide() {
    this.scene.tweens.add({
      targets: this,
      scale: 0.8,
      alpha: 0,
      duration: 200,
      onComplete: () => this.setVisible(false),
    });
  }
}
