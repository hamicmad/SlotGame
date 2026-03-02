import Phaser from 'phaser';
import BasePopup from './BasePopup.js';
import Button from '../Buttons.js';

export default class FreeSpinsPopup extends BasePopup {
  constructor(scene, spinsCount) {
    super(scene, 'Pop Up Message', 'FREE SPINS');

    const spinsText = scene.add
      .text(0, -20, `${spinsCount}`, {
        fontSize: '120px',
        fontFamily: 'Dosis, Arial',
        fill: '#ffcc00',
        fontWeight: '900',
        stroke: '#663300',
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.startButton = new Button(
      scene,
      0,
      155,
      'ui',
      { normal: 'Button Spin Normal', pressed: 'Button Spin Hover' },
      'START',
      '55px',
      this.baseTextStyle,
      () => {
        this.emit('close');
      },
    );

    this.add([spinsText, this.startButton]);
  }
}
