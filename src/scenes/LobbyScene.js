import * as THREE from 'three';
import { BaseScene } from '../BaseScene.js';
import { AssetLoader } from '../utils/AssetLoader.js';

/**
 * LobbyScene
 * Starting area loaded from scene.gltf.
 * The player can look around; pressing Enter / clicking advances to the Game.
 *
 * ── Asset setup ───────────────────────────────────────────────────
 * Place your GLTF files under:
 *   public/assets/lobby/scene.gltf
 *   public/assets/lobby/scene.bin
 *   public/assets/lobby/textures/  (all texture files)
 *
 * The loader will pick them up automatically via the relative path.
 */
export class LobbyScene extends BaseScene {
  constructor(manager) {
    super(manager);

    this.scene.background = new THREE.Color(0x1a1a2e);
    this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.015);

    this.camera.position.set(0, 1.7, 0);
    this.camera.fov = 75;
    this.camera.updateProjectionMatrix();

    this._yaw   = 0;
    this._pitch = 0;
    this._loaded = false;

    this._buildLighting();
    this._bindControls();
  }

  _buildLighting() {
    this.scene.add(new THREE.AmbientLight(0x303050, 1.2));

    const main = new THREE.DirectionalLight(0xfff0cc, 1.0);
    main.position.set(5, 10, 5);
    main.castShadow = true;
    this.scene.add(main);

    // Placeholder floor so the lobby isn't pitch-black before GLTF loads
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  _loadScene() {
    const loadingEl  = document.getElementById('loading');
    const barEl      = document.getElementById('loading-bar');

    loadingEl.classList.remove('hidden');

    AssetLoader.loadGLTF(
      '/assets/lobby/scene.gltf',
      (xhr) => {
        const pct = (xhr.loaded / xhr.total) * 100;
        barEl.style.width = `${pct}%`;
      }
    ).then((gltf) => {
      loadingEl.classList.add('hidden');
      this._loaded = true;

      const model = gltf.scene;
      model.traverse((node) => {
        if (node.isMesh) {
          node.castShadow    = true;
          node.receiveShadow = true;
        }
      });
      this.scene.add(model);
    }).catch((err) => {
      console.warn('Lobby GLTF not found – running with placeholder.', err);
      loadingEl.classList.add('hidden');
      this._loaded = true;
    });
  }

  _bindControls() {
    this._onMouseMove = (e) => {
      if (!document.pointerLockElement) return;
      const sens = 0.002;
      this._yaw   -= e.movementX * sens;
      this._pitch -= e.movementY * sens;
      this._pitch  = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this._pitch));
    };

    this._onClick = () => {
      const canvas = this.manager.renderer.domElement;
      if (!document.pointerLockElement) {
        canvas.requestPointerLock();
      }
    };

    this._onKeyDown = (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        this.manager.switchTo('game');
      }
    };
  }

  onEnter() {
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('click',    this._onClick);
    window.addEventListener('keydown',  this._onKeyDown);

    document.getElementById('menu').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');

    if (!this._loaded) this._loadScene();
  }

  onExit() {
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('click',    this._onClick);
    window.removeEventListener('keydown',  this._onKeyDown);
    if (document.pointerLockElement) document.exitPointerLock();
  }

  update(_delta) {
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this._yaw;
    this.camera.rotation.x = this._pitch;
  }
}
