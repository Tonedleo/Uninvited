/**
 * SceneManager
 * Owns the active scene, handles transitions, and drives the render loop.
 */
export class SceneManager {
  constructor(renderer) {
    this.renderer = renderer;
    this._scenes = {};
    this._active = null;
  }

  register(name, scene) {
    this._scenes[name] = scene;
  }

  switchTo(name) {
    if (this._active) this._active.onExit();
    this._active = this._scenes[name];
    if (!this._active) throw new Error(`Scene "${name}" not registered.`);
    this._active.onEnter();
  }

  update(delta) {
    if (this._active) this._active.update(delta);
  }

  render() {
    if (this._active) {
      this.renderer.render(this._active.scene, this._active.camera);
    }
  }

  onResize(width, height) {
    if (this._active) this._active.onResize(width, height);
  }
}
