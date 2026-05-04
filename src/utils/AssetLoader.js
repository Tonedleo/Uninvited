import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const _gltfLoader = new GLTFLoader();

// Draco compression support (optional – useful for large models)
const _draco = new DRACOLoader();
_draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
_gltfLoader.setDRACOLoader(_draco);

export const AssetLoader = {
  /**
   * Load a GLTF/GLB file.
   * @param {string} url - path relative to /public
   * @param {function} [onProgress] - called with xhr progress events
   * @returns {Promise<GLTF>}
   */
  loadGLTF(url, onProgress) {
    return new Promise((resolve, reject) => {
      _gltfLoader.load(url, resolve, onProgress, reject);
    });
  },
};
