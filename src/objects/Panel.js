import Phaser from "phaser";

export default class Panel extends Phaser.GameObjects.Container {
  constructor(scene, x, y, startLocked = false) {
    super(scene, x, y);

    this.isLocked = startLocked;
    this.buttons = [];
    this.valueTexts = {};

    this.baseTextStyle = {
      fontFamily: "Dosis, Arial",
      fontSize: "45px",
      fill: "#ffffff",
      align: "center",
      fontWeight: "900",
      stroke: "#ffffff",
      strokeThickness: 2,
    };

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

    this.initElements();
    scene.add.existing(this);

    this.setAlpha(0);
    scene.tweens.add({ targets: this, alpha: 1, duration: 300 });

    if (this.isLocked) {
      this.setLocked(true);
    }
  }

  initElements() {
    this.createButton(0, 60, this.frames.spin, "SPIN", "60px", () =>
      this.onSpinClick(),
    );
    this.createButton(-170, 60, this.frames.autoSpin, "MAX\nBET", "45px");
    this.createButton(170, 60, this.frames.autoSpin, "AUTO\nSPIN", "45px");

    const fields = [
      {
        x: -650,
        label: "LINES",
        val: "100",
        frame: this.frames.smallFrame,
        btns: true,
      },
      {
        x: -400,
        label: "TOTAL BET",
        val: "10",
        frame: this.frames.bigFrame,
        btns: true,
      },
      {
        x: 350,
        label: "BALANCE",
        val: "5000",
        frame: this.frames.bigFrame,
        btns: false,
      },
      {
        x: 600,
        label: "YOUR WIN",
        val: "0",
        frame: this.frames.smallFrame,
        btns: false,
      },
    ];

    fields.forEach((f) =>
      this.createNumericField(f.x, 60, f.label, f.val, f.frame, f.btns),
    );
  }

  createNumericField(x, y, label, startValue, frameKey, hasButtons) {
    const titleY = label === "BALANCE" || label === "YOUR WIN" ? 15 : 10;

    const title = this.scene.add
      .text(x, titleY, label, { ...this.baseTextStyle, fontSize: "32px" })
      .setOrigin(0.5);
    const plate = this.scene.add.image(x, y, frameKey);
    const valText = this.scene.add
      .text(x, y, startValue, { ...this.baseTextStyle, fontSize: "32px" })
      .setOrigin(0.5);

    this.add([title, plate, valText]);
    this.valueTexts[label] = valText;

    if (hasButtons) {
      const offset = plate.width / 2 - 30;
      this.createButton(x - offset, y, this.frames.minus, "", "1px");
      this.createButton(x + offset, y, this.frames.plus, "", "1px");
    }
  }

  createButton(x, y, frames, text, fontSize, callback) {
    const btn = this.scene.add
      .image(x, y, "ui", frames.normal)
      .setInteractive({ useHandCursor: true });
    const txt = this.scene.add
      .text(x, y, text.toUpperCase(), {
        ...this.baseTextStyle,
        fontSize: fontSize || "45px",
      })
      .setOrigin(0.5);

    if (text.includes("\n")) txt.setLineSpacing(-10);
    this.add([btn, txt]);

    this.buttons.push({ image: btn, text: txt, frames: frames, originalY: y });

    btn.on("pointerdown", () => {
      if (this.isLocked) return;
      btn.setFrame(frames.pressed);
      txt.y = y + 4;
    });

    const onRelease = () => {
      btn.setFrame(frames.normal);
      txt.y = y;
    };

    btn.on("pointerup", () => {
      onRelease();
      if (callback && !this.isLocked) callback();
    });

    btn.on("pointerout", onRelease);
    return btn;
  }

  setLocked(locked) {
    this.isLocked = locked;

    this.buttons.forEach((btnGroup) => {
      const { image, text } = btnGroup;

      if (locked) {
        image.disableInteractive();
        image.setAlpha(0.5);
        text.setAlpha(0.5);
      } else {
        image.setInteractive({ useHandCursor: true });
        image.setAlpha(1);
        text.setAlpha(1);
      }
    });
  }

  setValue(label, newValue) {
    if (this.valueTexts && this.valueTexts[label]) {
      this.valueTexts[label].setText(String(newValue ?? ""));
    }
  }

  onSpinClick() {
    if (!this.isLocked) {
      this.scene.events.emit("START_SPIN");
    }
  }

  updateBalance(newBalance, totalWin) {
    if (totalWin <= 0) {
      this.balanceText.setText(newBalance.toLocaleString());
      return;
    }

    const startValue = parseInt(this.balanceText.text.replace(/\s/g, ""));

    const counter = { val: startValue };

    this.scene.tweens.add({
      targets: counter,
      val: newBalance,
      duration: 1000,
      ease: "Linear",
      onUpdate: () => {
        this.balanceText.setText(Math.floor(counter.val).toLocaleString());
      },
    });
  }
}
