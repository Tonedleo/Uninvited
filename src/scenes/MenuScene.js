import * as THREE from 'three';
import { BaseScene } from '../BaseScene.js';

/**
 * MenuScene
 * Shows the main menu overlay and a slowly-rotating atmospheric background.
 * Transitions to LobbyScene when the player clicks "Play".
 */
export class MenuScene extends BaseScene {
  constructor(manager) {
    super(manager);

    // Dark ambient background
    this.scene.background = new THREE.Color(0x080808);
    this.scene.fog = new THREE.FogExp2(0x080808, 0.05);

    this.camera.position.set(0, 1.6, 5);

    this._buildBackground();
    this._bindUI();
  }

  _buildBackground() {
    // Drifting particle field for atmosphere
    const count = 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xe0c97f,
      size: 0.04,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });

    this._particles = new THREE.Points(geo, mat);
    this.scene.add(this._particles);

    // Dim point light for depth
    const light = new THREE.PointLight(0xe0c97f, 1.5, 20);
    light.position.set(0, 3, 0);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x111111));
  }

  _bindUI() {
    this._menuEl   = document.getElementById('menu');
    this._btnPlay  = document.getElementById('btn-play');

    this._onPlay = () => {
      this.manager.switchTo('lobby');
    };
    this._btnPlay.addEventListener('click', this._onPlay);
  }

  onEnter() {
    this._menuEl.classList.remove('hidden');
    document.getElementById('hud').classList.add('hidden');
  }

  onExit() {
    this._menuEl.classList.add('hidden');
  }

  update(delta) {
    this._particles.rotation.y += delta * 0.03;
    this._particles.rotation.x += delta * 0.01;
  }
}
