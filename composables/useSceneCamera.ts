/**
 * useSceneCamera
 *
 * Module-level singleton that holds the active Three.js PerspectiveCamera
 * from the WebGL scroll scene.
 *
 * WebGLCanvas calls setSceneCamera() after useScrollScene() resolves.
 * ScenePin calls useSceneCamera() to get a reactive ref to the camera.
 *
 * This avoids prop drilling and Nuxt app instance pollution.
 */

import type { PerspectiveCamera } from 'three'

// Module-level shared ref — one camera per app instance
const _camera = shallowRef<PerspectiveCamera | null>(null)

/**
 * Set the active scene camera. Called by WebGLCanvas.
 */
export function setSceneCamera(cam: PerspectiveCamera | null): void {
  _camera.value = cam
}

/**
 * Read the active scene camera. Called by ScenePin and any component
 * that needs to project world coordinates.
 */
export function useSceneCamera(): Ref<PerspectiveCamera | null> {
  return _camera as Ref<PerspectiveCamera | null>
}
