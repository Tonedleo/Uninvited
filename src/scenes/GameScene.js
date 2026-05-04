import * as THREE from 'three';
import { BaseScene } from '../BaseScene.js';

/**
 * GameScene
 * Main gameplay scene – first-person exploration.
 * Swap the placeholder geometry for your actual level GLTF here.
 */
export class GameScene extends BaseScene {
  constructor(manager) {
    super(manager);

    this.scene.background = new THREE.Color(0x0d0d0d);
    this.scene.fog = new THREE.FogExp2(0x0d0d0d, 0.04);

    this.camera.position.set(0, 1.7, 0);
    this.camera.fov = 75;
    this.camera.updateProjectionMatrix();

    // Movement state
    this._keys  = {};
    this._yaw   = 0;
    this._pitch = 0;
    this._velocity = new THREE.Vector3();

    this._buildLevel();
    this._bindControls();
  }

  _buildLevel() {
    this.scene.add(new THREE.AmbientLight(0x111111, 1));

    // Flickering point light – atmosphere
    this._light = new THREE.PointLight(0xffaa55, 2, 12);
    this._light.position.set(0, 2.5, 0);
    this.scene.add(this._light);

    // Placeholder room
    const wallMat  = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 1.0 });

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const ceiling = floor.clone();
    ceiling.position.y = 3;
    ceiling.rotation.x = Math.PI / 2;
    this.scene.add(ceiling);

    const wallPositions = [
      [0,  1.5,  -10, 0],
      [0,  1.5,   10, Math.PI],
      [-10, 1.5,  0,  Math.PI / 2],
      [10,  1.5,  0, -Math.PI / 2],
    ];

    for (const [x, y, z, ry] of wallPositions) {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(20, 3), wallMat);
      wall.position.set(x, y, z);
      wall.rotation.y = ry;
      wall.receiveShadow = true;
      this.scene.add(wall);
    }
  }

  _bindControls() {
    this._onKeyDown = (e) => { this._keys[e.code] = true; };
    this._onKeyUp   = (e) => { this._keys[e.code] = false; };

    this._onMouseMove = (e) => {
      if (!document.pointerLockElement) return;
      const sens = 0.002;
      this._yaw   -= e.movementX * sens;
      this._pitch -= e.movementY * sens;
      this._pitch  = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this._pitch));
    };

    this._onClick = () => {
      const canvas = this.manager.renderer.domElement;
      if (!document.pointerLockElement) canvas.requestPointerLock();
    };
  }

  onEnter() {
    window.addEventListener('keydown',   this._onKeyDown);
    window.addEventListener('keyup',     this._onKeyUp);
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('click',     this._onClick);
    document.getElementById('hud').classList.remove('hidden');
  }

  onExit() {
    window.removeEventListener('keydown',   this._onKeyDown);
    window.removeEventListener('keyup',     this._onKeyUp);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('click',     this._onClick);
    if (document.pointerLockElement) document.exitPointerLock();
  }

  update(delta) {
    // Camera rotation
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this._yaw;
    this.camera.rotation.x = this._pitch;

    // WASD movement
    const speed = 4;
    const dir   = new THREE.Vector3();

    if (this._keys['KeyW'] || this._keys['ArrowUp'])    dir.z -= 1;
    if (this._keys['KeyS'] || this._keys['ArrowDown'])  dir.z += 1;
    if (this._keys['KeyA'] || this._keys['ArrowLeft'])  dir.x -= 1;
    if (this._keys['KeyD'] || this._keys['ArrowRight']) dir.x += 1;

    if (dir.lengthSq() > 0) {
      dir.normalize();
      dir.applyEuler(new THREE.Euler(0, this._yaw, 0));
      this.camera.position.addScaledVector(dir, speed * delta);
    }

    // Flickering light
    this._light.intensity = 1.8 + Math.sin(Date.now() * 0.005) * 0.3 + Math.random() * 0.1;
  }
}
