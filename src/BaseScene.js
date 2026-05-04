import * as THREE from 'three';

/**
 * BaseScene – lightweight abstract base for all game scenes.
 * Subclasses must call super(manager) and implement onEnter / update.
 */
export class BaseScene {
  constructor(manager) {
    this.manager = manager;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
  }

  /** Called once when this scene becomes active. */
  onEnter() {}

  /** Called once when this scene is replaced by another. */
  onExit() {}

  /** Called every frame with elapsed seconds since last frame. */
  update(_delta) {}

  onResize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
