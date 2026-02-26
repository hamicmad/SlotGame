import Phaser from "phaser";

export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, atlasKey, frames, text, fontSize, style, callback) {
    super(scene, x, y);
    this.frames = frames;
    this.callback = callback;
    this.isLocked = false;
    this.isToggled = false;
    this.atlasKey = atlasKey;

    this.image = scene.add
      .image(0, 0, this.atlasKey, frames.normal)
      .setInteractive({ useHandCursor: true });

    this.addAt(this.image, 0);

    if (text) {
      const isMultiline = text.includes("\n");

      this.text = scene.add
        .text(0, 0, text.toUpperCase(), {
          ...style,
          fontSize: fontSize || "45px",
          align: "center",
          lineSpacing: isMultiline ? -15 : 0,
        })
        .setOrigin(0.5);

      if (isMultiline) {
        this.text.y = -5;
      }

      this.add(this.text);
    }

    this.image.on("pointerdown", () => {
      if (this.isLocked) return;

      this.image.setFrame(this.frames.pressed);

      if (this.text) this.text.y = this.text.text.includes("\n") ? -1 : 4;
    });

    const onRelease = () => {
      if (this.isToggled) {
        this.image.setFrame(this.frames.pressed);
        if (this.text) this.text.y = this.text.text.includes("\n") ? -1 : 4;
      } else {
        this.image.setFrame(this.frames.normal);
        if (this.text) this.text.y = this.text.text.includes("\n") ? -5 : 0;
      }
    };

    this.image.on("pointerup", () => {
      if (this.isLocked) return;
      if (this.callback) this.callback();
      onRelease();
    });

    this.image.on("pointerout", onRelease);

    scene.add.existing(this);
  }

  setToggle(isActive) {
    this.isToggled = isActive;

    if (isActive) {
      this.image.setFrame(this.frames.pressed);
      if (this.text) this.text.y = this.text.text.includes("\n") ? -1 : 4;
    } else {
      this.image.setFrame(this.frames.normal);
      if (this.text) this.text.y = this.text.text.includes("\n") ? -5 : 0;
    }
  }

  setLocked(locked) {
    this.isLocked = locked;
    this.setAlpha(locked ? 0.5 : 1);
    if (!locked) this.setToggle(this.isToggled);
  }
}
