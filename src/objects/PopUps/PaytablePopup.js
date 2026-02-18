import BasePopup from "./BasePopup.js";
import { PAYTABLE } from "../../configs/payTableConfig.js";
import { LINES_CONFIG } from "../../configs/linesConfig.js";
import { SYMBOLS_CONFIG } from "../../configs/symbolsConfig.js";
import Button from "../Buttons.js";

export default class PaytablePopup extends BasePopup {
  constructor(scene) {
    super(scene, "Pop Up Paytable", "PAYTABLE & LINES");

    this.pageContent = this.scene.add.container(0, 0);
    this.add(this.pageContent);

    this.showPage(1);
  }

  showPage(page) {
    this.pageContent.removeAll(true);

    if (page === 1) {
      this.renderLines();
    } else {
      this.renderSymbols();
    }
  }

  renderLines() {
    const startX = -520;
    const startY = -290;
    const spacingX = 260;
    const spacingY = 150;

    for (let i = 0; i < 20; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      this.drawMiniLine(startX + col * spacingX, startY + row * spacingY, i);
    }

    const nextBtn = new Button(
      this.scene,
      580,
      320,
      "PopUps",
      { normal: "Icon Next Normal", pressed: "Icon Next Hover" },
      "",
      "",
      { fill: "#fff" },
      () => this.showPage(2),
    );
    this.pageContent.add(nextBtn);
  }

  renderSymbols() {
    const symbolsIds = Object.keys(PAYTABLE);
    const startX = -540;
    const startY = -245;
    const stepX = 280;
    const stepY = 180;

    symbolsIds.forEach((id, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = startX + col * stepX;
      const y = startY + row * stepY;

      const symbolName = SYMBOLS_CONFIG.MAP[id];
      const img = this.scene.add
        .image(x, y, "symbols", symbolName)
        .setScale(0.7);

      const data = PAYTABLE[id];
      let payoutText = "";
      if (data[5]) payoutText += `5 - ${data[5]}\n`;
      if (data[4]) payoutText += `4 - ${data[4]}\n`;
      if (data[3]) payoutText += `3 - ${data[3]}`;

      const txt = this.scene.add
        .text(x + 105, y, payoutText, {
          fontSize: "26px",
          fontFamily: "Arial",
          fill: "#000000",
          fontWeight: "800",
          stroke: "#1a0303",
          strokeThickness: 2,
        })
        .setOrigin(0, 0.5);

      this.pageContent.add([img, txt]);
    });

    const backBtn = new Button(
      this.scene,
      -580,
      320,
      "PopUps",
      { normal: "Icon Preview Normal", pressed: "Icon Preview Hover" },
      "",
      "",
      { fill: "#fff" },
      () => this.showPage(1),
    );
    this.pageContent.add(backBtn);
  }

  drawMiniLine(x, y, index) {
    const lineCoords = LINES_CONFIG[index];
    if (!lineCoords) return;

    const grid = this.scene.add.graphics();
    const cellW = 36;
    const cellH = 30;
    const sX = x - (5 * cellW) / 2;
    const sY = y - (3 * cellH) / 2;

    grid.lineStyle(1, 0x000000, 0.3);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        grid.strokeRect(sX + c * cellW, sY + r * cellH, cellW, cellH);
      }
    }

    grid.fillStyle(0xffcc00, 0.6);
    grid.lineStyle(4, 0x000000, 1);
    grid.beginPath();

    lineCoords.forEach((rowIdx, reelIdx) => {
      const px = sX + reelIdx * cellW + cellW / 2;
      const py = sY + rowIdx * cellH + cellH / 2;
      grid.fillRect(sX + reelIdx * cellW, sY + rowIdx * cellH, cellW, cellH);
      if (reelIdx === 0) grid.moveTo(px, py);
      else grid.lineTo(px, py);
    });

    grid.strokePath();
    this.pageContent.add(grid);

    const label = this.scene.add
      .text(x, y + 65, `LINE ${index + 1}`, {
        fontSize: "20px",
        fill: "#000",
        fontWeight: "800",
      })
      .setOrigin(0.5);
    this.pageContent.add(label);
  }
}
