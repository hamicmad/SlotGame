import Phaser from "phaser";

export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, atlasKey, frames, text, fontSize, style, callback) {
    super(scene, x, y);
    this.frames = frames;
    this.callback = callback;
    this.isLocked = false;
    this.atlasKey = atlasKey;

    this.image = scene.add
      .image(0, 0, this.atlasKey, frames.normal)
      .setInteractive({ useHandCursor: true });

    if (text) {
      this.text = scene.add
        .text(0, 0, text.toUpperCase(), {
          ...style,
          fontSize: fontSize || "45px",
        })
        .setOrigin(0.5);
      if (text.includes("\n")) this.text.setLineSpacing(-10);
      this.add(this.text);
    }

    this.addAt(this.image, 0);

    this.image.on("pointerdown", () => {
      if (this.isLocked) return;
      this.image.setFrame(this.frames.pressed);
      if (this.text) this.text.y = 4;
    });

    const onRelease = () => {
      this.image.setFrame(this.frames.normal);
      if (this.text) this.text.y = 0;
    };

    this.image.on("pointerup", () => {
      onRelease();
      if (this.callback && !this.isLocked) this.callback();
    });

    this.image.on("pointerout", onRelease);
    scene.add.existing(this);
  }

  setLocked(locked) {
    this.isLocked = locked;
    this.setAlpha(locked ? 0.5 : 1);
  }
}
