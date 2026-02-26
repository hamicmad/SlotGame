import Phaser from "phaser";

export default class ScenePreload extends Phaser.Scene {
  constructor() {
    super("ScenePreload");
  }

  preload() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.image(width / 2, height / 2, "bar_empty");

    const fullBar = this.add.image(width / 2, height / 2, "bar_full");

    const maskImage = this.make.image({
      x: width / 2,
      y: height / 2,
      key: "bar_mask",
      add: false,
    });

    const bitMask = maskImage.createBitmapMask();
    fullBar.setMask(bitMask);

    const barWidth = fullBar.width;
    maskImage.x = width / 2 - barWidth;

    this.load.image("main_bg", "assets/images/bg.png");
    this.load.image("bigPlate", "assets/images/BigPlate.png");
    this.load.image("smallPlate", "assets/images/SmallPlate.png");
    this.load.image("hugeWin", "assets/images/hugeWin.png");
    this.load.image("megaWin", "assets/images/megaWin.png");
    this.load.image("Exit Icon Normal", "assets/images/Exit Icon Normal.png");
    this.load.image("Exit Icon Hover", "assets/images/Exit Icon Hover.png");

    this.load.atlas(
      //todo в одну строчку
      "symbols",
      "assets/atlas/symbols.png",
      "assets/atlas/symbols.json",
    ); // нормикс
    this.load.atlas(
      "blurSymbols",
      "assets/atlas/blurSymbols.png",
      "assets/atlas/blurSymbols.json",
    ); //не нормикс (чуже читается чем вариант выше)
    this.load.atlas("ui", "assets/atlas/ui.png", "assets/atlas/ui.json");
    this.load.atlas(
      "PopUps",
      "assets/atlas/PopUps.png",
      "assets/atlas/PopUps.json",
    );
    this.load.atlas(
      "PopUps1",
      "assets/atlas/PopUps1.png",
      "assets/atlas/PopUps1.json",
    );

    //todo сократить, зарефакторить
    //#region ТУТНАФЛУДИЛ
    this.load.spritesheet("low1An", "assets/sprites/low1An.png", {
      frameWidth: 281,
      frameHeight: 281,
    });

    this.load.spritesheet("low2An", "assets/sprites/low2An.png", {
      frameWidth: 281,
      frameHeight: 281,
    });
    this.load.spritesheet("low3An", "assets/sprites/low3An.png", {
      frameWidth: 281,
      frameHeight: 281,
    });
    this.load.spritesheet("low4An", "assets/sprites/low4An.png", {
      frameWidth: 281,
      frameHeight: 281,
    });
    this.load.spritesheet("high1An", "assets/sprites/high1An.png", {
      frameWidth: 281,
      frameHeight: 281,
    });
    this.load.spritesheet("high2An", "assets/sprites/high2An.png", {
      frameWidth: 281,
      frameHeight: 281,
    });
    this.load.spritesheet("high3An", "assets/sprites/high3An.png", {
      frameWidth: 281,
      frameHeight: 281,
    });
    this.load.spritesheet("high4An", "assets/sprites/high4An.png", {
      frameWidth: 281,
      frameHeight: 281,
    });
    this.load.spritesheet("high5An", "assets/sprites/high5An.png", {
      frameWidth: 281,
      frameHeight: 281,
    });
    this.load.spritesheet("wildAn", "assets/sprites/wildAn.png", {
      frameWidth: 281,
      frameHeight: 281,
    });
    this.load.spritesheet("scatterAn", "assets/sprites/scatterAn.png", {
      frameWidth: 281,
      frameHeight: 281,
    });
    this.load.font("Dosis", "assets/fonts/Dosis.ttf");

    this.load.on("progress", (value) => {
      maskImage.x = width / 2 - barWidth + barWidth * value;
    });

    this.load.on("complete", () => {
      this.time.delayedCall(1000, () => {
        this.scene.start("SceneEnter");
      });
    });
  }

  create() {
    const anKeys = [
      "low1An",
      "low2An",
      "low3An",
      "low4An",
      "high1An",
      "high2An",
      "high3An",
      "high4An",
      "high5An",
      "wildAn",
      "scatterAn",
    ];

    anKeys.forEach((sheetKey, i) => {
      this.anims.create({
        key: `winAn${i}`,
        frames: this.anims.generateFrameNumbers(sheetKey, {
          start: 0,
          end: 23,
        }),
        frameRate: 24,
        repeat: 0,
      });
    });
  }
}
