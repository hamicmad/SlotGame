import Phaser from "phaser";
import { GAME_CONFIG } from "./config.js";
import SceneBoot from "./scenes/SceneBoot.js";
import ScenePreload from "./scenes/ScenePreload.js";
import SceneEnter from "./scenes/SceneEnter.js";

const config = {
  ...GAME_CONFIG,
  scene: [SceneBoot, ScenePreload, SceneEnter],
};

new Phaser.Game(config);
