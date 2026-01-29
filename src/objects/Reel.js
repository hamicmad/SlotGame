import Phaser from "phaser";

export default class Reel extends Phaser.GameObjects.Container {
  constructor(scene, x, y, index) {
    super(scene, x, y);
    this.scene = scene;
    this.index = index; // колонка

    this.symbolHeight = 246;
    this.isSpining = false;
    this.symbols = [];

    this.createSymbols();

    scene.add.existing(this);
  }

  createSymbols() {
    const allNames = this.scene.textures.get("symbols").getFrameNames();

    for (let i = -1; i < 3; i++) {
      const name = Phaser.Utils.Array.GetRandom(allNames);

      const symbol = this.scene.add.image(
        0,
        i * this.symbolHeight,
        "symbols",
        name,
      );

      symbol.setOrigin(0.5, 0);
      this.symbols.push(symbol);
      this.add(symbol);
    }
  }

  spin() {
    this.isSpining = true;
  }

  stop() {
    this.isSpining = false;

    this.symbols.forEach((symbol) => {
      const targetY =
        Math.round(symbol.y / this.symbolHeight) * this.symbolHeight;

      this.scene.tweens.add({
        targets: symbol,
        y: targetY,
        duration: 200,
        ease: "Cubic.out",
      });
    });
  }

  update() {
    if (this.isSpining !== true) return;

    const speed = 30;
    const limit = 3 * this.symbolHeight;

    for (let i = 0; i < this.symbols.length; i++) {
      const symbol = this.symbols[i];
      symbol.y += speed;

      if (symbol.y >= limit) {
        const overstep = symbol.y - limit;
        symbol.y = -this.symbolHeight + overstep;

        const allNames = this.scene.textures.get("symbols").getFrameNames();
        symbol.setFrame(Phaser.Utils.Array.GetRandom(allNames));
      }
    }
  }
}
