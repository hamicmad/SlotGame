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
      this.stats.activeLines = Phaser.Math.Clamp(
        this.stats.activeLines + step,
        1,
        20,
      );
      this.syncPanel();
    });

    this.events.on(GameEvents.UI.CHANGE_BET, (direction) => {
      this.stats.changeBetStep(direction);
      this.syncPanel();
    });

    this.events.on(GameEvents.UI.MAX_BET, () => {
      this.stats.setMaxBet();
      this.syncPanel();
    });

    this.events.on(GameEvents.UI.TOGGLE_AUTO, () => {
      this.isAutoSpin = !this.isAutoSpin;
      if (this.panel.updateAutoSpinState)
        this.panel.updateAutoSpinState(this.isAutoSpin);
      if (this.isAutoSpin && !this.panel.isLocked) this.handleStartSpin();
    });

    this.events.on(GameEvents.GAME.SHOW_POPUP, (type, data) =>
      this.popupManager.show(type, data),
    );
    this.events.on(GameEvents.UI.OPEN_PAYTABLE, () =>
      this.popupManager.show("PAYTABLE"),
    );
    this.events.on("INSUFFICIENT_FUNDS", () =>
      this.popupManager.show("NOTIFY", "НЕДОСТАТОЧНО СРЕДСТВ"),
    );
  }

  syncPanel() {
    this.panel.setValue("TOTAL BET", this.stats.totalBet);
    this.panel.setValue("LINES", this.stats.activeLines);
    this.panel.setValue("BALANCE", this.stats.getBalance());
  }

  handleStartSpin() {
    const result = this.stats.getNextSpin();

    if (result) {
      this.panel.setValue("BALANCE", result.balanceBeforeSpin);

      this.panel.setValue("YOUR WIN", 0);

      this.panel.setLocked(true);

      this.scene.launch("SceneDeal", {
        stopBox: result.stopBox,
        reelsManager: this.reelsManager,
        winData: result,
      });
    } else {
      this.isAutoSpin = false;
      if (this.panel.updateAutoSpinState) {
        this.panel.updateAutoSpinState(false);
      }
      this.panel.setLocked(false);
      this.events.emit("INSUFFICIENT_FUNDS");
    }
  }

  exitFreeSpins() {
    this.panel.setFreeSpinMode(false);
    this.syncPanel();
  }

  animateBalance(targetBalance, winAmount, startBalance = null) {
    const startValue =
      startBalance !== null ? startBalance : targetBalance - winAmount;

    let displayObj = { val: startValue };
    this.tweens.add({
      targets: displayObj,
      val: targetBalance,
      duration: 1000,
      onUpdate: () => {
        this.panel.setValue("BALANCE", Math.floor(displayObj.val));
      },
      onComplete: () => {
        this.panel.setValue("BALANCE", targetBalance);
      },
    });
  }

  update(time, delta) {
    if (this.reelsManager) this.reelsManager.update(time, delta);
  }
}
