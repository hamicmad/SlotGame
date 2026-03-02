import BasePopup from './BasePopup.js';

export default class SettingsPopup extends BasePopup {
  constructor(scene) {
    super(scene, 'Pop Up Settings', 'SETTINGS');
    this.createSettings();
  }

  createSettings() {
    this.createToggle(0, -100, 'SOUND', 'Icon Sound On', 'Icon Sound Off', 'sound');
    this.createToggle(0, 10, 'MUSIC', 'Icon Music On', 'Icon Music Off', 'music');
  }

  createToggle(x, y, label, iconOn, iconOff, type) {
    const text = this.scene.add
      .text(x - 120, y, label, {
        fontSize: '32px',
        fill: '#000',
        fontFamily: 'Arial',
        fontWeight: '800',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(1, 0.5);

    const registryKey = type === 'music' ? 'isMusicOn' : 'isSoundOn';
    if (this.scene.registry.get(registryKey) === undefined) {
      this.scene.registry.set(registryKey, true);
    }

    let isCurrentlyOn = this.scene.registry.get(registryKey);

    const icon = this.scene.add.image(x - 60, y, 'PopUps', isCurrentlyOn ? iconOn : iconOff);
    const toggleBtn = this.scene.add
      .image(x + 60, y, 'PopUps', isCurrentlyOn ? 'Toggle Button On' : 'Toggle Button Off')
      .setInteractive({ useHandCursor: true });

    toggleBtn.isON = isCurrentlyOn;

    toggleBtn.on('pointerdown', () => {
      toggleBtn.isON = !toggleBtn.isON;
      this.scene.registry.set(registryKey, toggleBtn.isON);

      toggleBtn.setFrame(toggleBtn.isON ? 'Toggle Button On' : 'Toggle Button Off');
      icon.setFrame(toggleBtn.isON ? iconOn : iconOff);

      this.scene.events.emit('CHANGE_' + label, toggleBtn.isON);
    });

    this.add([text, icon, toggleBtn]);
  }
}
