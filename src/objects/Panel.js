import Phaser from "phaser";
import { GameEvents } from "../objects/Events.js";
import Button from "./Buttons.js";

export default class Panel extends Phaser.GameObjects.Container {
  constructor(scene, x, y, startLocked = false) {
    super(scene, x, y);
    this.valueTexts = {};
    this.titleTexts = {};
    this.subMenuButtons = [];
    this.isLocked = startLocked;
    this.isMenuOpen = false;

    this.baseTextStyle = {
      fontFamily: "Dosis",
      fontSize: "46px",
      fill: "#ffffff",
      fontWeight: "800",
      stroke: "#ffffff",
      strokeThickness: 3,
      align: "center",
    };

    this.smallTextStyle = {
      ...this.baseTextStyle,
      fontSize: "30px",
      fontWeight: "800",
      strokeThickness: 3,
    };

    this.numberStyle = {
      ...this.baseTextStyle,
      fontSize: "36px",
      fontWeight: "800",
      strokeThickness: 3,
    };

    this.freeSpinsStyle = {
      ...this.numberStyle,
      fill: "#ffffff",
      stroke: "#ffffff",
      strokeThickness: 3,
    };

    this.frames = {
      spin: { normal: "Button Spin Normal", pressed: "Button Spin Hover" },
      autoSpin: {
        normal: "Button Auto Spin Normal",
        pressed: "Button Auto Spin Hover",
      },
      minus: { normal: "Minus Button Normal", pressed: "Minus Button Hover" },
      plus: { normal: "Plus Button Normal", pressed: "Plus Button Hover" },
      menu: { normal: "Button Menu Normal", pressed: "Button Menu Hover" },
      smallFrame: "smallPlate",
      bigFrame: "bigPlate",
      settings: {
        normal: "Button Settings Normal",
        pressed: "Button Settings Hover",
      },
      info: { normal: "Button Info Normal", pressed: "Button Info Hover" },
      rules: { normal: "Button Rules Normal", pressed: "Button Rules Hover" },
    };

    this.initElements();
    scene.add.existing(this);
    if (this.isLocked) this.setLocked(true);
  }

  initElements() {
    this.spinBtn = new Button(
      this.scene,
      0,
      45,
      "ui",
      this.frames.spin,
      "SPIN",
      "70px",
      {
        ...this.baseTextStyle,
        fontSize: "70px",
        fontWeight: "800",
        strokeThickness: 2.5,
      },
      () => this.onSpinClick(),
    );
    this.add(this.spinBtn);

    this.maxBetBtn = new Button(
      this.scene,
      -170,
      45,
      "ui",
      this.frames.autoSpin,
      "MAX\nBET",
      "42px",
      {
        ...this.baseTextStyle,
        fontSize: "42px",
        fontWeight: "800",
        lineSpacing: -15,
        strokeThickness: 2,
        padding: { top: 5, bottom: 5 },
      },
      () => this.scene.events.emit(GameEvents.UI.MAX_BET),
    );
    this.add(this.maxBetBtn);

    this.autoSpinBtn = new Button(
      this.scene,
      170,
      45,
      "ui",
      this.frames.autoSpin,
      "AUTO\nSPIN",
      "38px",
      {
        ...this.baseTextStyle,
        fontSize: "38px",
        fontWeight: "800",
        lineSpacing: -15,
        strokeThickness: 2,
        padding: { top: 5, bottom: 5 },
      },
      () => this.scene.events.emit(GameEvents.UI.TOGGLE_AUTO),
    );
    this.add(this.autoSpinBtn);

    this.createMenuSystem(900, -820);

    const fields = [
      {
        x: -650,
        label: "LINES",
        frame: this.frames.smallFrame,
        btns: true,
        onMinus: () => this.scene.events.emit(GameEvents.UI.CHANGE_LINES, -1),
        onPlus: () => this.scene.events.emit(GameEvents.UI.CHANGE_LINES, 1),
      },
      {
        x: -400,
        label: "TOTAL BET",
        frame: this.frames.bigFrame,
        btns: true,
        onMinus: () => this.scene.events.emit(GameEvents.UI.CHANGE_BET, -1),
        onPlus: () => this.scene.events.emit(GameEvents.UI.CHANGE_BET, 1),
      },
      { x: 350, label: "BALANCE", frame: this.frames.bigFrame, btns: false },
      { x: 600, label: "YOUR WIN", frame: this.frames.smallFrame, btns: false },
    ];

    fields.forEach((f) =>
      this.createNumericField(
        f.x,
        60,
        f.label,
        0,
        f.frame,
        f.btns,
        f.onMinus,
        f.onPlus,
      ),
    );
  }

  createMenuSystem(x, y) {
    const menuConfig = [
      {
        frame: this.frames.rules,
        event: GameEvents.GAME.SHOW_POPUP,
        type: "HELP",
        offX: -305,
      },
      {
        frame: this.frames.info,
        event: GameEvents.UI.OPEN_PAYTABLE,
        type: "PAYTABLE",
        offX: -205,
      },
      {
        frame: this.frames.settings,
        event: GameEvents.GAME.SHOW_POPUP,
        type: "SETTINGS",
        offX: -105,
      },
    ];

    menuConfig.forEach((config) => {
      const btn = new Button(
        this.scene,
        x,
        y,
        "ui",
        config.frame,
        "",
        "0px",
        this.baseTextStyle,
        () => {
          this.scene.events.emit(config.event, config.type);
          this.toggleMenu();
        },
      );
      btn.setAlpha(0);
      this.add(btn);
      this.subMenuButtons.push({
        obj: btn,
        targetX: x + config.offX,
        startX: x,
      });
    });

    this.add(
      new Button(
        this.scene,
        x,
        y,
        "ui",
        this.frames.menu,
        "",
        "0px",
        this.baseTextStyle,
        () => this.toggleMenu(),
      ),
    );
  }

  toggleMenu() {
    if (this.isLocked) return;
    this.isMenuOpen = !this.isMenuOpen;
    this.subMenuButtons.forEach((item, i) => {
      this.scene.tweens.add({
        targets: item.obj,
        x: this.isMenuOpen ? item.targetX : item.startX,
        alpha: this.isMenuOpen ? 1 : 0,
        duration: 300,
        delay: i * 50,
        ease: "Back.out",
      });
    });
  }

  createNumericField(
    x,
    y,
    label,
    startValue,
    frameKey,
    hasButtons,
    onMinus,
    onPlus,
  ) {
    const titleY = label === "BALANCE" || label === "YOUR WIN" ? 15 : 10;

    const title = this.scene.add
      .text(x, titleY, label, this.smallTextStyle)
      .setOrigin(0.5);

    this.titleTexts[label] = title;

    const plate = this.scene.add.image(x, y, frameKey);

    const valText = this.scene.add
      .text(x, y, startValue, this.numberStyle)
      .setOrigin(0.5);

    this.add([title, plate, valText]);
    this.valueTexts[label] = valText;

    if (hasButtons) {
      const offset = plate.width / 2 - 30;

      this.add(
        new Button(
          this.scene,
          x - offset,
          y,
          "ui",
          this.frames.minus,
          "",
          "1px",
          this.baseTextStyle,
          onMinus,
        ),
      );
      this.add(
        new Button(
          this.scene,
          x + offset,
          y,
          "ui",
          this.frames.plus,
          "",
          "1px",
          this.baseTextStyle,
          onPlus,
        ),
      );
    }
  }

  setFreeSpinMode(isActive, remainingCount = 0) {
    const betTitle = this.titleTexts["TOTAL BET"];
    const betValue = this.valueTexts["TOTAL BET"];

    if (!betTitle || !betValue) return;

    if (isActive) {
      betTitle.setText("SPINS LEFT");
      betTitle.setStyle(this.smallTextStyle);

      betValue.setStyle(this.freeSpinsStyle);
      betValue.setText(String(remainingCount));
    } else {
      betTitle.setText("TOTAL BET");
      betTitle.setStyle(this.smallTextStyle);
      betValue.setStyle(this.numberStyle);
    }
  }

  setLocked(locked) {
    this.isLocked = locked;
    if (this.isMenuOpen && locked) this.toggleMenu();

    this.list.forEach((child) => {
      if (child instanceof Button) {
        const isSubMenu = this.subMenuButtons.some(
          (item) => item.obj === child,
        );

        if (isSubMenu && !this.isMenuOpen) {
          child.setAlpha(0);
        } else if (child === this.autoSpinBtn) {
          child.setLocked(locked && !this.autoSpinBtn.isToggled);
        } else {
          child.setLocked(locked);
        }
      }
    });
  }

  updateAutoSpinState(isActive) {
    if (this.autoSpinBtn) {
      this.autoSpinBtn.setToggle(isActive);
    }
  }

  setValue(label, newValue) {
    if (this.valueTexts[label]) {
      this.valueTexts[label].setText(String(newValue));
    }
  }

  onSpinClick() {
    if (!this.isLocked) this.scene.events.emit(GameEvents.UI.START_SPIN);
  }
}
