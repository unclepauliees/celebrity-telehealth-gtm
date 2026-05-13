/**
 * useScrollScene
 *
 * Core scroll → camera driver for the OCP WebGL layer.
 *
 * Architecture:
 * - Native browser scroll only (no ScrollTrigger, no Lenis, no hijacking)
 * - GSAP proxy pattern for smooth scroll interpolation
 * - rAF-based render loop
 * - Lazy scene loading via dynamic import() keyed to scroll acts
 * - Crossfade between scenes via material opacity tweening
 *
 * Scroll acts (total: 36,000px):
 *   Act 1:  0–1200px     — scene-obsidian
 *   Act 2:  1200–2500px  — transition: obsidian → capital-chain
 *   Act 3:  2500–14000px — scene-capital-chain
 *   Act 4: 14000–21000px — transition: capital-chain → platforms
 *   Act 5: 21000–33000px — scene-platforms
 *   Act 6: 33000–36000px — scene-platforms holds (static)
 *
 * NOTE: Three.js color values (0x0A0A0A etc.) are raw hex — this is the
 * documented exception to the no-raw-hex rule. CSS always uses token variables.
 */

import type {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Group,
  Object3D,
  Material,
} from 'three'

import { SCROLL_HEIGHT_DESKTOP } from './useScrollHeight'

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

export interface CameraAct {
  id: string
  start: number
  end: number
  from: [number, number, number]
  to: [number, number, number]
  lookAt: [number, number, number]
}

export interface CameraPaths {
  acts: CameraAct[]
}

export interface ScrollSceneReturn {
  /** The live PerspectiveCamera — used by ScenePin for projection */
  camera: Ref<PerspectiveCamera | null>
  /** Cleanup function — call on unmount */
  dispose: () => void
}

// ---------------------------------------------------------------------------
// Module-level singleton state (one renderer, one scroll loop per app lifecycle)
// ---------------------------------------------------------------------------

let _isRunning = false
let _rafId = 0

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Linear interpolation between two numbers */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Clamp a number between min and max */
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

/** Interpolate a camera act's position from t=0 to t=1 and apply lookAt */
function interpolateAct(
  act: CameraAct,
  t: number,
  camera: PerspectiveCamera,
): void {
  const ct = clamp(t, 0, 1)
  // Interpolate camera position from act.from to act.to
  camera.position.set(
    lerp(act.from[0], act.to[0], ct),
    lerp(act.from[1], act.to[1], ct),
    lerp(act.from[2], act.to[2], ct),
  )
  // lookAt is constant per act (the scene pivot point)
  camera.lookAt(act.lookAt[0], act.lookAt[1], act.lookAt[2])
}

/**
 * Walk all objects in a group and set material opacity.
 * Also sets transparent=true to ensure opacity takes effect.
 */
function setGroupOpacity(group: Group, opacity: number): void {
  group.traverse((obj: Object3D) => {
    const mesh = obj as { material?: Material | Material[] }
    if (!mesh.material) return
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((mat: Material) => {
      mat.transparent = opacity < 1
      mat.opacity = opacity
      mat.needsUpdate = true
    })
  })
}

// ---------------------------------------------------------------------------
// Main composable
// ---------------------------------------------------------------------------

export const useScrollScene = (renderer: WebGLRenderer): ScrollSceneReturn => {
  if (!import.meta.client) {
    // SSR: return no-ops with typed null refs
    return {
      camera: ref<PerspectiveCamera | null>(null),
      dispose: () => {},
    }
  }

  // Reactive camera ref — exposed for ScenePin
  const cameraRef = ref<PerspectiveCamera | null>(null)

  // GSAP proxy — holds the smoothed scroll position
  const proxy = { p: 0 }

  // Camera paths from JSON
  let cameraPaths: CameraAct[] = []

  // Scene groups — one per act-scene loaded
  let sceneObsidianGroup: Group | null = null
  let sceneChainGroup: Group | null = null
  let scenePlatformsGroup: Group | null = null

  // Track what's been loaded
  const loaded = {
    obsidian: false,
    chain: false,
    platforms: false,
  }

  // Track active scene for crossfade management
  let currentSceneKey: 'obsidian' | 'chain' | 'platforms' = 'obsidian'
  // Prevent overlapping crossfades
  let isCrossfading = false

  // The main Three.js scene that holds all loaded groups
  let mainScene: Scene | null = null
  let camera: PerspectiveCamera | null = null
  let gsapInstance: { gsap: (typeof import('gsap'))['gsap'] } | null = null

  // Debounce handle for resize
  let resizeTimer: ReturnType<typeof setTimeout>

  // ---------------------------------------------------------------------------
  // Initialization — lazy load Three.js + GSAP + camera paths
  // ---------------------------------------------------------------------------

  async function init(): Promise<void> {
    // Dynamic imports — hits the named Vite chunks: 'three', 'gsap'
    const THREE = await import('three')
    // Dynamic import hits the 'gsap' Vite chunk
    const { gsap } = await import('gsap')
    gsapInstance = { gsap }

    // Load camera paths — inline fallback ensures this works with no network call.
    // The authoritative data lives in /data/camera-paths.json; we mirror it here
    // so the composable is fully self-contained at runtime (no fetch needed).
    // If the project adopts a server route for camera-paths, replace this block.
    cameraPaths = [
      { id: 'act1', start: 0, end: 1200, from: [0, 0, 6], to: [0, 0, 3], lookAt: [0, 0, 0] },
      { id: 'act2', start: 1200, end: 2500, from: [0, 0, 3], to: [2, 1, 4], lookAt: [0, 0, 0] },
      { id: 'act3', start: 2500, end: 14000, from: [2, 1, 4], to: [-2, 0.5, 3], lookAt: [0, 0.5, 0] },
      { id: 'act4', start: 14000, end: 21000, from: [-2, 0.5, 3], to: [0, 3, 6], lookAt: [0, 0, 0] },
      { id: 'act5', start: 21000, end: 33000, from: [0, 3, 6], to: [0, 1.5, 5], lookAt: [0, 0, 0] },
      { id: 'act6', start: 33000, end: 36000, from: [0, 1.5, 5], to: [0, 1.5, 5], lookAt: [0, 0, 0] },
    ]

    // Create the main scene + camera
    mainScene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.01,
      100,
    )

    // Start at act1 from position
    const act1 = cameraPaths.find(a => a.id === 'act1')
    if (act1) {
      camera.position.set(...act1.from)
      camera.lookAt(act1.lookAt[0], act1.lookAt[1], act1.lookAt[2])
    }

    cameraRef.value = camera

    // Immediately load act1 scene (visible at page load)
    await loadScene('obsidian')

    // Start scroll listener + rAF loop
    window.addEventListener('scroll', onScroll, { passive: true })
    startRaf()
  }

  // ---------------------------------------------------------------------------
  // GLB scene loading
  // ---------------------------------------------------------------------------

  async function loadScene(key: 'obsidian' | 'chain' | 'platforms'): Promise<void> {
    if (loaded[key]) return
    loaded[key] = true

    const THREE = await import('three')
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

    const urlMap: Record<string, string> = {
      obsidian: '/scenes/scene-obsidian.glb',
      chain: '/scenes/scene-capital-chain.glb',
      platforms: '/scenes/scene-platforms.glb',
    }

    const loader = new GLTFLoader()

    return new Promise((resolve) => {
      loader.load(
        urlMap[key],
        (gltf) => {
          const group = new THREE.Group()
          group.add(gltf.scene)

          // Start hidden — crossfade will reveal
          setGroupOpacity(group, key === 'obsidian' ? 1 : 0)
          group.visible = key === 'obsidian'

          if (mainScene) {
            mainScene.add(group)
          }

          if (key === 'obsidian') sceneObsidianGroup = group
          else if (key === 'chain') sceneChainGroup = group
          else if (key === 'platforms') scenePlatformsGroup = group

          resolve()
        },
        undefined,
        (error: unknown) => {
          // Log but don't crash — graceful degradation
          console.warn(`OCP WebGL: Failed to load ${urlMap[key]}:`, error)
          loaded[key] = false
          resolve()
        },
      )
    })
  }

  // ---------------------------------------------------------------------------
  // Crossfade between scenes
  // ---------------------------------------------------------------------------

  async function crossfadeTo(
    targetKey: 'obsidian' | 'chain' | 'platforms',
  ): Promise<void> {
    if (targetKey === currentSceneKey) return
    if (isCrossfading) return
    if (!gsapInstance) return

    isCrossfading = true

    // Update key optimistically so updateCamera() stops calling crossfadeTo again
    const prevKey = currentSceneKey
    currentSceneKey = targetKey

    // Ensure target is loaded before crossfading
    await loadScene(targetKey)

    const fromGroup = getGroupByKey(prevKey)
    const toGroup = getGroupByKey(targetKey)

    if (toGroup) {
      toGroup.visible = true
      setGroupOpacity(toGroup, 0)
    }

    const { gsap } = gsapInstance

    if (fromGroup) {
      const fromProxy = { opacity: 1 }
      gsap.to(fromProxy, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onUpdate: () => setGroupOpacity(fromGroup, fromProxy.opacity),
        onComplete: () => {
          fromGroup.visible = false
        },
      })
    }

    if (toGroup) {
      const toProxy = { opacity: 0 }
      gsap.to(toProxy, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
        onUpdate: () => setGroupOpacity(toGroup, toProxy.opacity),
        onComplete: () => {
          isCrossfading = false
        },
      })
    } else {
      isCrossfading = false
    }
  }

  function getGroupByKey(key: 'obsidian' | 'chain' | 'platforms'): Group | null {
    if (key === 'obsidian') return sceneObsidianGroup
    if (key === 'chain') return sceneChainGroup
    return scenePlatformsGroup
  }

  // ---------------------------------------------------------------------------
  // Scroll handler — GSAP proxy smoothing
  // ---------------------------------------------------------------------------

  function onScroll(): void {
    if (!gsapInstance) return

    // Normalize scrollY from the actual document scroll height to the
    // logical 36,000px camera-path coordinate space.
    // This ensures camera transitions fire at the correct visual moments
    // regardless of whether the scroll narrative is 24,000px (mobile),
    // 30,000px (tablet), or 36,000px (desktop).
    const actualMax = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1,
    )
    const progress = clamp(window.scrollY / actualMax, 0, 1)
    const normalizedY = progress * SCROLL_HEIGHT_DESKTOP

    const { gsap } = gsapInstance
    gsap.to(proxy, {
      p: normalizedY,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: true,
    })

    // Lazy-load upcoming scenes (thresholds are in logical 36,000px space)
    const PRELOAD_THRESHOLD = 800
    if (normalizedY > 1200 - PRELOAD_THRESHOLD && !loaded.chain) {
      loadScene('chain')
    }
    if (normalizedY > 14000 - PRELOAD_THRESHOLD && !loaded.platforms) {
      loadScene('platforms')
    }
  }

  // ---------------------------------------------------------------------------
  // Camera path update — called every frame
  // ---------------------------------------------------------------------------

  function updateCamera(): void {
    if (!camera || cameraPaths.length === 0) return

    const scrollY = proxy.p

    // Find the active act
    const act = cameraPaths.find(a => scrollY >= a.start && scrollY <= a.end)
      ?? cameraPaths[cameraPaths.length - 1]

    const range = act.end - act.start
    const t = range > 0 ? (scrollY - act.start) / range : 1

    // Determine which scene should be active based on act
    const targetScene = getSceneForAct(act.id)
    if (targetScene !== currentSceneKey) {
      crossfadeTo(targetScene)
    }

    // Apply camera position
    interpolateAct(act, t, camera)
  }

  function getSceneForAct(actId: string): 'obsidian' | 'chain' | 'platforms' {
    if (actId === 'act1' || actId === 'act2') return 'obsidian'
    if (actId === 'act3' || actId === 'act4') return 'chain'
    return 'platforms'
  }

  // ---------------------------------------------------------------------------
  // rAF render loop
  // ---------------------------------------------------------------------------

  function tick(): void {
    if (!_isRunning || !mainScene || !camera) return

    updateCamera()

    renderer.render(mainScene, camera)

    _rafId = requestAnimationFrame(tick)
  }

  function startRaf(): void {
    if (_isRunning) return
    _isRunning = true
    _rafId = requestAnimationFrame(tick)
  }

  function stopRaf(): void {
    _isRunning = false
    if (_rafId) {
      cancelAnimationFrame(_rafId)
      _rafId = 0
    }
  }

  // ---------------------------------------------------------------------------
  // Resize handler
  // ---------------------------------------------------------------------------

  function handleResize(): void {
    if (!camera || !renderer) return
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  const debouncedResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(handleResize, 100)
  }

  window.addEventListener('resize', debouncedResize)

  // ---------------------------------------------------------------------------
  // Dispose
  // ---------------------------------------------------------------------------

  function dispose(): void {
    stopRaf()
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', debouncedResize)
    clearTimeout(resizeTimer)
    cameraRef.value = null
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------

  init().catch((err: unknown) => {
    console.error('OCP WebGL: init failed:', err)
  })

  return {
    camera: cameraRef as Ref<PerspectiveCamera | null>,
    dispose,
  }
}
