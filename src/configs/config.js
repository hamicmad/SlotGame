import Phaser from "phaser";

export const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: "game-container",
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
