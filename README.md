# Uninvited

A 3D first-person browser game built with [Three.js](https://threejs.org/) and [Vite](https://vitejs.dev/).

---

## Getting started

```bash
npm install
npm run dev        # start dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

---

## Project structure

```
src/
  main.js            – renderer setup + game loop
  SceneManager.js    – switches between scenes
  BaseScene.js       – abstract base class for all scenes
  style.css          – full-page canvas + UI overlay styles

  scenes/
    MenuScene.js     – main menu (particle backdrop, Play button)
    LobbyScene.js    – starting lobby (loads scene.gltf, look-around)
    GameScene.js     – main gameplay (WASD movement, flickering light)

  utils/
    AssetLoader.js   – GLTF/GLB loader with Draco support

public/
  assets/
    lobby/
      scene.gltf     ← copy your GLTF file here
      scene.bin      ← copy your BIN file here
      textures/      ← copy your textures folder here
```

---

## Adding your subway station model

1. Copy `scene.gltf`, `scene.bin`, and the `textures/` folder into `public/assets/lobby/`.
2. Run `npm run dev` – the lobby will auto-load the model with a progress bar.

> **Tip:** If your model is very large (>20 MB), consider compressing it with
> [gltf-transform](https://gltf-transform.donmccurdy.com/) or Blender's GLTF exporter
> with Draco compression enabled. The `AssetLoader` already has Draco support built in.

---

## Controls

| Action | Key / Mouse |
|--------|-------------|
| Look around | Mouse (after clicking canvas) |
| Move | W A S D or Arrow keys |
| Start game (from lobby) | Enter or Space |
| Capture mouse | Click on canvas |

---

## Scene flow

```
MenuScene  →(Play)→  LobbyScene  →(Enter/Space)→  GameScene
```
