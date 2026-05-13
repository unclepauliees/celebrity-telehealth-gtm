# Phase 2 Handoff — webgl-scene-engineer

**Agent:** `webgl-scene-engineer`
**Date:** 2026-05-12
**Build phase:** Phase 2 — WebGL Layer
**Hands off to:** `narrative-content-architect` (Phase 3), `brand-compliance-auditor` (Phase 2 audit)

---

## Component API

### `WebGLCanvas.vue`

```typescript
// Props: none
// Emits: none
// Slots: none
```

**Behavior:**
- Mounts on `onMounted` — never during SSR
- Creates `WebGLRenderer({ antialias: true, alpha: true })`
- Appends renderer canvas to `#webgl-canvas-mount` in the layout
- Calls `useScrollScene(renderer)` to start the scroll driver
- Calls `setSceneCamera(cam)` to expose the camera for `ScenePin`
- If `useReducedMotion()` returns true: renders one static frame only (no rAF loop)
- Dev-only FPS counter via `import.meta.dev` (bottom-left, 14px Space Mono, gold 60% opacity)

**Three.js hex color note:** `setClearColor(0x0A0A0A, 1)` uses a raw hex numeric literal. This is the documented exception to the no-raw-hex rule — Three.js Color API requires `0xNNNNNN` format. All CSS in this component uses token variables only.

---

### `ScenePin.vue`

```typescript
interface Props {
  /** Three.js world-space coordinates [x, y, z] */
  worldPos: [number, number, number]
  /** scrollY value at which the pin starts appearing */
  activeFrom: number
  /** scrollY value at which the pin stops appearing */
  activeTo: number
}
// Emits: none
// Slots: default — content positioned at the projected 2D coordinate
```

**Behavior:**
- Runs a rAF loop on mount
- Reads camera from `useSceneCamera()` (shared composable, set by WebGLCanvas)
- Projects `worldPos` via `Vector3.project(camera)` → NDC → CSS percentages
- `opacity: 0` outside `[activeFrom, activeTo]` scroll range
- Full-viewport `position: fixed` overlay container
- All CSS transitions use `var(--ease-ocp)` and `--duration-*` tokens

**Usage:**
```vue
<ScenePin :world-pos="[0, 1, 0]" :active-from="2500" :active-to="14000">
  <div class="label">Capital Chain</div>
</ScenePin>
```

---

### `ScenePreloader.vue`

```typescript
// Props: none
// Emits: { complete: [] }
// Slots: none
```

**Behavior:**
- Fetches the three GLB files and tracks byte progress via `fetch + ReadableStream`
- Falls back to a 700ms simulated progress per file if `content-length` is unavailable
- Displays `"LOADING — 00%"` with zero-padded counter in Space Mono / gold
- Pauses 300ms at 100%, then fades out over `var(--duration-section)`
- Emits `complete` after fade-out finishes
- Background: `var(--color-obsidian)`, Text: `var(--color-gold)`
- No spinner, no border-radius, no box-shadow

---

## Composable Signatures

### `useScrollScene` — `/composables/useScrollScene.ts`

```typescript
export const useScrollScene = (renderer: WebGLRenderer): ScrollSceneReturn

export interface ScrollSceneReturn {
  camera: Ref<PerspectiveCamera | null>
  dispose: () => void
}
```

- SSR-safe: guards with `import.meta.client`
- GSAP proxy smoothing: `proxy = { p: 0 }`, tween on each scroll event
- rAF render loop: `tick()` → `updateCamera()` → `renderer.render(mainScene, camera)`
- Dynamic imports: `import('three')` and `import('gsap')` hit Vite chunks `three` and `gsap`
- Scene loading: `import('three/examples/jsm/loaders/GLTFLoader.js')` per scene
- Crossfade: GSAP tween on material opacity (transparent=true), 500ms `power2.inOut`
- Returns camera ref for ScenePin projection

### `useSceneCamera` — `/composables/useSceneCamera.ts`

```typescript
// Write: called by WebGLCanvas
export function setSceneCamera(cam: PerspectiveCamera | null): void

// Read: called by ScenePin
export function useSceneCamera(): Ref<PerspectiveCamera | null>
```

Module-level singleton pattern — no Vue inject needed.

---

## Scroll Act Ranges

| Act | ID | ScrollY Range | Height | Scene | Description |
|---|---|---|---|---|---|
| 1 | `act1` | 0 – 1,200px | 1,200px | `scene-obsidian` | Dark void entry |
| 2 | `act2` | 1,200 – 2,500px | 1,300px | `scene-obsidian` | Transition: obsidian → chain |
| 3 | `act3` | 2,500 – 14,000px | 11,500px | `scene-capital-chain` | Capital chain network flythrough |
| 4 | `act4` | 14,000 – 21,000px | 7,000px | `scene-capital-chain` | Transition: chain → platforms |
| 5 | `act5` | 21,000 – 33,000px | 12,000px | `scene-platforms` | Platform companies reveal |
| 6 | `act6` | 33,000 – 36,000px | 3,000px | `scene-platforms` | Platforms hold, UI overlay |

**Scene switching rule:**
- Acts 1–2 → `scene-obsidian` (active from scroll start)
- Acts 3–4 → `scene-capital-chain` (crossfade triggers at act3 boundary)
- Acts 5–6 → `scene-platforms` (crossfade triggers at act5 boundary)

---

## `camera-paths.json` Format

File: `/data/camera-paths.json`

```typescript
interface CameraAct {
  id: string                       // "act1" through "act6"
  start: number                    // scrollY start (px)
  end: number                      // scrollY end (px)
  from: [number, number, number]   // camera position at act start (Three.js Y-up world units)
  to: [number, number, number]     // camera position at act end
  lookAt: [number, number, number] // constant lookAt target for the entire act
}

interface CameraPaths {
  acts: CameraAct[]
}
```

**Note:** The composable `useScrollScene.ts` embeds the act data inline (mirroring the JSON) to avoid a runtime fetch. If act values change, update both `/data/camera-paths.json` (source of truth) and the inline fallback in `useScrollScene.ts`.

---

## GLB Scenes

### Files
| File | Location | Size |
|---|---|---|
| `scene-obsidian.glb` | `/public/scenes/` | ~86KB |
| `scene-capital-chain.glb` | `/public/scenes/` | ~110KB |
| `scene-platforms.glb` | `/public/scenes/` | ~6KB |

### Regenerating GLBs

Run the build script with Node 22+ (TypeScript strip mode):

```bash
node --experimental-strip-types scripts/build-scenes.ts
```

Output goes to `/public/scenes/`. The script:
1. Polyfills `FileReader` for Node's `GLTFExporter` compatibility
2. Builds three procedural scenes using Three.js geometry primitives
3. Exports as GLB via `GLTFExporter({ binary: true })`

### Scene descriptions

**`scene-obsidian`** — 16 icosahedral shards with displaced vertices, obsidian material (`#0A0A0A`, roughness 0.9, metalness 0.1), gold edge highlights (`#B8965A`). Point light at [0, 2, 2].

**`scene-capital-chain`** — 8 node spheres (central hub at radius 0.14, outer nodes at 0.08), 12 connecting edge lines. Node color: gold (`#B8965A`), hub color: parchment (`#F5F2EE`), edges: dark rule (`#2A2A2A`).

**`scene-platforms`** — 3 platform tiles (`PlaneGeometry(1.6, 1.0)`) in fan formation, steel material (`#1C2535`), gold border edges (`#B8965A`). Slight Y and rotation offsets for depth.

---

## Raw Hex Exception — Three.js Color API

Three.js `Color`, `setClearColor`, `MeshStandardMaterial.color`, `PointLight.color`, and `LineBasicMaterial.color` all accept `0xNNNNNN` numeric hex values. This is a hard requirement of the Three.js API — these values cannot be CSS variables.

**Documented values used:**
| Constant | Value | Token equivalent |
|---|---|---|
| Obsidian Black | `0x0A0A0A` | `--color-obsidian` |
| Gold | `0xB8965A` | `--color-gold` |
| Parchment | `0xF5F2EE` | `--color-parchment` |
| Forge Steel | `0x1C2535` | `--color-forge-steel` |
| Rule Dark | `0x2A2A2A` | `--color-rule-dark` |

All CSS properties in Vue components use `var(--color-*)` token variables. Only Three.js material/geometry/light code uses raw hex.

---

## Known Dev Constraints

1. **GLTFExporter in Node.js** requires a `FileReader` polyfill. The build script provides one via `Object.assign(globalThis, { FileReader: NodeFileReader })`. Node 24+ has `Blob` natively, so the polyfill works via `Blob.arrayBuffer()`.

2. **SSR safety**: `useScrollScene`, `WebGLCanvas`, and `ScenePin` all guard against SSR with `import.meta.client` or `onMounted`. Three.js and GSAP are never imported at the module level — always via `await import(...)` inside client-only paths.

3. **Reduced motion**: When `prefers-reduced-motion: reduce` is active, `WebGLCanvas` renders one static dark frame and stops. No GLBs are loaded. The preloader still shows briefly.

4. **Scene crossfade guards**: `isCrossfading` flag prevents overlapping crossfades if the user scrolls the scene boundary rapidly back and forth.

5. **Pixel ratio cap**: `Math.min(window.devicePixelRatio, 2)` — prevents excessive rendering cost on high-DPI screens.

6. **Camera path continuity**: The lookAt vector is constant per act. At act boundaries, lookAt jumps between acts (e.g., act2 uses `[0,0,0]` and act3 uses `[0,0.5,0]`). The 0.5px Y difference is subtle enough not to be jarring given the 500ms crossfade.

7. **Vite chunk names**: The build config in `nuxt.config.ts` routes `node_modules/three` → chunk `three`, `node_modules/gsap` → chunk `gsap`, and `components/WebGLCanvas` → chunk `webgl-canvas`. All Three.js imports in composables must remain dynamic (`await import('three')`) to benefit from this splitting.

---

## Phase 2 Done-Criteria Checklist

- [x] `data/camera-paths.json` — populated with all 6 acts
- [x] `scripts/build-scenes.ts` — runnable with `node --experimental-strip-types`
- [x] GLBs generated: `scene-obsidian.glb` (86KB), `scene-capital-chain.glb` (110KB), `scene-platforms.glb` (6KB)
- [x] `components/WebGLCanvas.vue` — renderer mounts, scroll scene starts, FPS counter in dev
- [x] `composables/useScrollScene.ts` — GSAP proxy, rAF loop, lazy scene loading, crossfade
- [x] `composables/useSceneCamera.ts` — module-level camera singleton for ScenePin
- [x] `components/ScenePin.vue` — Vector3.project, NDC→CSS, opacity gate
- [x] `components/ScenePreloader.vue` — fetch+ReadableStream progress, Space Mono, gold
- [x] `pages/index.vue` — six-act scroll structure with section theme registration
- [x] No raw hex in CSS/Vue templates (Three.js hex values documented and excepted)
- [x] No border-radius anywhere
- [x] No box-shadow anywhere
- [x] All CSS transitions use `var(--ease-ocp)` and `--duration-*` tokens
- [x] Three.js in dynamic import (lazy) hitting the `three` Vite chunk
- [x] `#webgl-canvas-mount` remains `aria-hidden="true"` (set in layout, not modified)
- [x] TypeScript strict mode — no `any` types

---

## What Phase 3 Agents Inherit

### `narrative-content-architect` receives:
- Six `<section>` elements in `pages/index.vue` with `data-section="actN"` attributes
- Section theme registration already wired (all dark)
- `ScenePin` available for attaching 3D-pinned labels to world coordinates
- `ScenePreloader` fires `@complete` event — overlay can be shown after preloader exits

### `ui-component-craftsman` receives:
- `ScenePin` component for any 3D-pinned UI elements
- Camera-projection pattern established in `useSceneCamera.ts`
- All act heights and scroll ranges documented above

### `brand-compliance-auditor` receives:
- Three.js hex exception documented and justified
- No CSS raw hex values
- No border-radius, no box-shadow
- All motion tokens used correctly
