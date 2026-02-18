import Phaser from "phaser";
import ReelsManager from "../objects/ReelsManager.js";
import ServerAnalytics from "../modules/ServerAnalytics.js";
import Panel from "../objects/Panel.js";
import PopupManager from "../objects/PopUps/PopupManager.js";
import { GameEvents } from "../objects/Events.js";

export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super("SceneMainMenu");
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "main_bg");

    this.currentTotalBet = 200;
    this.currentLines = 20;
    this.isAutoSpin = false;

    this.stats = new ServerAnalytics();
    this.reelsManager = new ReelsManager(this, width / 2, 100);
    this.panel = new Panel(this, width / 2, height - 100);
    this.popupManager = new PopupManager(this);

    this.reelsManager.fill(Array(5).fill([0, 1, 2]));

    this.syncPanel();

    this.events.on(GameEvents.UI.START_SPIN, () => this.handleStartSpin());

    this.events.on(GameEvents.UI.UNLOCK_INTERFACE, () =>
      this.panel.setLocked(false),
    );

    this.events.on(GameEvents.UI.CHANGE_LINES, (step) => {
      this.currentLines = Phaser.Math.Clamp(this.currentLines + step, 1, 20);

      this.stats.activeLines = this.currentLines;
      this.syncPanel();
    });

    this.events.on(GameEvents.UI.CHANGE_BET, (step) => {
      const change = step * 10;

      this.currentTotalBet = Phaser.Math.Clamp(
        this.currentTotalBet + change,
        10,
        2000,
      );

      this.syncPanel();
    });

    this.events.on(GameEvents.UI.MAX_BET, () => {
      const currentBalance = this.stats.getBalance();
      if (currentBalance < 10) return;

      this.currentTotalBet = Math.floor(currentBalance / 10) * 10;
      this.syncPanel();
    });

    this.events.on(GameEvents.UI.TOGGLE_AUTO, () => {
      this.isAutoSpin = !this.isAutoSpin;
      if (this.isAutoSpin && !this.panel.isLocked) this.handleStartSpin();
    });

    this.events.on(GameEvents.GAME.SHOW_POPUP, (type, data) => {
      this.popupManager.show(type, data);
    });
    this.events.on(GameEvents.UI.OPEN_PAYTABLE, () => {
      this.popupManager.show("PAYTABLE");
    });
    this.events.on("INSUFFICIENT_FUNDS", () => {
      this.popupManager.show("NOTIFY", "НЕДОСТАТОЧНО СРЕДСТВ");
    });
  }

  syncPanel() {
    this.stats.totalBet = this.currentTotalBet;
    this.stats.activeLines = this.currentLines;

    this.panel.setValue("TOTAL BET", this.currentTotalBet);
    this.panel.setValue("LINES", this.currentLines);
    this.panel.setValue("BALANCE", this.stats.getBalance());
  }

  handleStartSpin() {
    const result = this.stats.getNextSpin();

    if (result) {
      this.panel.setValue("YOUR WIN", 0);
      this.panel.setValue("BALANCE", result.newBalance - result.totalWin);
      this.panel.setLocked(true);
      this.scene.launch("SceneDeal", {
        stopBox: result.stopBox,
        reelsManager: this.reelsManager,
        winData: result,
      });
    } else {
      this.isAutoSpin = false;
      this.panel.setLocked(false);
      this.events.emit("INSUFFICIENT_FUNDS");
    }
  }

  animateBalance(targetBalance, winAmount) {
    let displayObj = { val: targetBalance - winAmount };
    this.tweens.add({
      targets: displayObj,
      val: targetBalance,
      duration: 1000,
      onUpdate: () =>
        this.panel.setValue("BALANCE", Math.floor(displayObj.val)),
      onComplete: () => this.panel.setValue("BALANCE", targetBalance),
    });
  }

  update(time, delta) {
    if (this.reelsManager) this.reelsManager.update(time, delta);
  }
}
