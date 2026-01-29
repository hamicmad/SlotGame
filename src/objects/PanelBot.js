import Phaser from "phaser";

export default class PanelBot extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.isLocked = false;
    this.allInteractiveButtons = [];

    this.baseTextStyle = {
      fontFamily: "Dosis, Arial",
      fontSize: "45px",
      fill: "#ffffff",
      align: "center",
      fontWeight: "900",
      stroke: "#ffffff",
      strokeThickness: 2,
    };

    this.valueTexts = {};

    this.frames = {
      spin: { normal: "Button Spin Normal", pressed: "Button Spin Hover" },
      autoSpin: {
        normal: "Button Auto Spin Normal",
        pressed: "Button Auto Spin Hover",
      },
      minus: { normal: "Minus Button Normal", pressed: "Minus Button Hover" },
      plus: { normal: "Plus Button Normal", pressed: "Plus Button Hover" },
      smallFrame: "smallPlate",
      bigFrame: "bigPlate",
    };

    this.btnSpin = this.createButton(
      0,
      60,
      this.frames.spin,
      "SPIN",
      "60px",
      () => {
        this.onSpinClick();
      },
    );

    this.createButton(-170, 60, this.frames.autoSpin, "MAX\nBET", "45px");
    this.createButton(170, 60, this.frames.autoSpin, "AUTO\nSPIN", "45px");

    this.createNumericField(
      -650,
      60,
      "LINES",
      "100",
      this.frames.smallFrame,
      true,
    );
    this.createNumericField(
      -400,
      60,
      "TOTAL BET",
      "10",
      this.frames.bigFrame,
      true,
    );
    this.createNumericField(
      350,
      60,
      "BALANCE",
      "5000",
      this.frames.bigFrame,
      false,
    );
    this.createNumericField(
      600,
      60,
      "YOUR WIN",
      "0",
      this.frames.smallFrame,
      false,
    );

    this.setAlpha(0);
    scene.add.existing(this);
    scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 600,
      ease: "Power2",
    });
  }

  createNumericField(x, y, label, startValue, frameKey, hasButtons) {
    const titleY = label === "BALANCE" || label === "YOUR WIN" ? 15 : 10;
    const title = this.scene.add
      .text(x, titleY, label, { ...this.baseTextStyle, fontSize: "32px" })
      .setOrigin(0.5);
    this.add(title);

    let plate = this.scene.add.image(x, y, frameKey);
    this.add(plate);

    const valText = this.scene.add
      .text(x, y, startValue, { ...this.baseTextStyle, fontSize: "32px" })
      .setOrigin(0.5);
    this.add(valText);
    this.valueTexts[label] = valText;

    if (hasButtons) {
      const padding = plate.width / 2 - 30;
      this.createButton(x - padding, y, this.frames.plus, "", "1px");
      this.createButton(x + padding, y, this.frames.minus, "", "1px");
    }
  }

  createButton(x, y, frameConfig, text, fontSize, callback) {
    const btn = this.scene.add
      .image(x, y, "ui", frameConfig.normal)
      .setInteractive({ useHandCursor: true });
    const txt = this.scene.add
      .text(x, y, text.toUpperCase(), {
        ...this.baseTextStyle,
        fontSize: fontSize || this.baseTextStyle.fontSize,
      })
      .setOrigin(0.5);

    if (text.includes("\n")) txt.setLineSpacing(-10);
    this.add([btn, txt]);

    this.allInteractiveButtons.push(btn);

    btn.on("pointerdown", () => {
      if (this.isLocked) return;
      btn.setFrame(frameConfig.pressed);
      txt.y += 4;
      txt.setScale(0.9);
    });

    const release = () => {
      btn.setFrame(frameConfig.normal);
      txt.y = y;
      txt.setScale(1);
    };

    btn.on("pointerup", () => {
      release();
      if (callback && !this.isLocked) callback();
    });

    btn.on("pointerout", release);
    return btn;
  }

  onSpinClick() {
    if (this.isLocked) return;
    this.scene.events.emit("START_SPIN");
  }

  disableButtons() {
    this.isLocked = true;
    this.allInteractiveButtons.forEach((btn) => {
      btn.setAlpha(0.5);
      btn.disableInteractive();
    });
  }

  enableButtons() {
    this.isLocked = false;
    this.allInteractiveButtons.forEach((btn) => {
      btn.setAlpha(1);
      btn.setInteractive({ useHandCursor: true });
    });
  }

  setValue(label, newValue) {
    if (this.valueTexts[label]) {
      this.valueTexts[label].setText(newValue.toString());
    }
  }
}
