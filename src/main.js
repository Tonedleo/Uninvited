import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { MenuScene } from './scenes/MenuScene.js';
import { LobbyScene } from './scenes/LobbyScene.js';
import { GameScene } from './scenes/GameScene.js';

// ── Renderer ──────────────────────────────────────────────────────
const canvas = document.getElementById('game-canvas');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// ── Scene manager ─────────────────────────────────────────────────
const manager = new SceneManager(renderer);

manager.register('menu',  new MenuScene(manager));
manager.register('lobby', new LobbyScene(manager));
manager.register('game',  new GameScene(manager));

manager.switchTo('menu');

// ── Resize ────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  manager.onResize(window.innerWidth, window.innerHeight);
});

// ── Loop ──────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function tick() {
  requestAnimationFrame(tick);
  const delta = clock.getDelta();
  manager.update(delta);
  manager.render();
}

tick();
