/**
 * build-scenes.ts
 *
 * Generates three procedural Three.js GLB scene files for the Obsidian Capital
 * Partners WebGL layer. Run with Node 22+ (TypeScript strip mode):
 *
 *   node --experimental-strip-types scripts/build-scenes.ts
 *
 * Output: /public/scenes/scene-obsidian.glb
 *         /public/scenes/scene-capital-chain.glb
 *         /public/scenes/scene-platforms.glb
 *
 * NOTE: Three.js setHexColor calls use raw hex values (0xNNNNNN) as required by
 * the Three.js Color API. This is the documented exception to the no-raw-hex rule.
 * All CSS uses token variables. See /docs/handoff-phase-2-webgl.md.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.resolve(__dirname, '../public/scenes')

// ---------------------------------------------------------------------------
// Node.js polyfill for FileReader (used internally by GLTFExporter binary mode)
// Node 24 has Blob but no FileReader — we polyfill with Blob.arrayBuffer()
// ---------------------------------------------------------------------------

if (typeof globalThis.FileReader === 'undefined') {
  class NodeFileReader extends EventTarget {
    result: ArrayBuffer | string | null = null
    error: Error | null = null
    readyState: 0 | 1 | 2 = 0

    onload: ((evt: Event) => void) | null = null
    onerror: ((evt: Event) => void) | null = null
    onloadend: ((evt: Event) => void) | null = null

    readAsArrayBuffer(blob: Blob): void {
      this.readyState = 1
      blob.arrayBuffer().then((buf) => {
        this.result = buf
        this.readyState = 2
        const evt = new Event('load')
        this.onload?.(evt)
        this.dispatchEvent(evt)
        const endEvt = new Event('loadend')
        this.onloadend?.(endEvt)
        this.dispatchEvent(endEvt)
      }).catch((err: unknown) => {
        this.error = err instanceof Error ? err : new Error(String(err))
        this.readyState = 2
        const evt = new Event('error')
        this.onerror?.(evt)
        this.dispatchEvent(evt)
      })
    }

    readAsDataURL(_blob: Blob): void {
      throw new Error('readAsDataURL not implemented in Node polyfill')
    }

    readAsText(_blob: Blob, _encoding?: string): void {
      throw new Error('readAsText not implemented in Node polyfill')
    }

    abort(): void {
      this.readyState = 2
    }
  }

  // Assign to global scope so GLTFExporter can find it
  Object.assign(globalThis, { FileReader: NodeFileReader })
}

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true })

// Dynamic import Three.js (must be lazy for Vite chunk compliance — also correct
// for this build script since it runs in Node)
const THREE = await import('three')
const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js')

// ---------------------------------------------------------------------------
// Utility: export a scene to a GLB file
// ---------------------------------------------------------------------------

function exportSceneToGLB(scene: THREE.Scene, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter()
    exporter.parse(
      scene,
      (result: ArrayBuffer | object) => {
        if (result instanceof ArrayBuffer) {
          const outputPath = path.join(OUTPUT_DIR, filename)
          fs.writeFileSync(outputPath, Buffer.from(result))
          const sizeKB = Math.round(result.byteLength / 1024)
          console.log(`  ✓ ${filename} — ${sizeKB}KB`)
          resolve()
        } else {
          reject(new Error(`Expected ArrayBuffer from GLTFExporter binary mode, got object`))
        }
      },
      (error: unknown) => {
        reject(error instanceof Error ? error : new Error(String(error)))
      },
      { binary: true },
    )
  })
}

// ---------------------------------------------------------------------------
// Scene 1: scene-obsidian — Dark void with fractured obsidian geometry
// Target: ≤120KB
// ---------------------------------------------------------------------------

function buildSceneObsidian(): THREE.Scene {
  const scene = new THREE.Scene()

  // THREE.js hex colors (required by Three.js Color API — documented exception to no-raw-hex rule)
  const obsidianColor = 0x0A0A0A
  const goldColor = 0xB8965A

  // Obsidian shard geometry — shattered icosahedron facets
  // Use a flat-shaded icosahedron to get sharp, angular faces
  const baseGeom = new THREE.IcosahedronGeometry(0.5, 0)

  // Generate 16 shards from variations of the base geometry
  const shardCount = 16

  // Use a seeded pseudo-random sequence for reproducible output
  let seed = 42
  const rng = () => {
    seed = (seed * 16807 + 0) % 2147483647
    return (seed - 1) / 2147483646
  }

  for (let i = 0; i < shardCount; i++) {
    const scale = 0.15 + rng() * 0.45
    const geom = baseGeom.clone()

    // Displace vertices slightly for each shard to create unique fracture shapes
    const posAttr = geom.attributes['position'] as THREE.BufferAttribute
    for (let v = 0; v < posAttr.count; v++) {
      posAttr.setX(v, posAttr.getX(v) + (rng() - 0.5) * 0.08)
      posAttr.setY(v, posAttr.getY(v) + (rng() - 0.5) * 0.08)
      posAttr.setZ(v, posAttr.getZ(v) + (rng() - 0.5) * 0.08)
    }
    posAttr.needsUpdate = true
    geom.computeVertexNormals()

    // Obsidian material — near-black, rough
    const material = new THREE.MeshStandardMaterial({
      color: obsidianColor,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    })

    const mesh = new THREE.Mesh(geom, material)

    // Scatter shards in a cluster around origin
    const radius = 0.3 + rng() * 1.2
    const theta = rng() * Math.PI * 2
    const phi = (rng() - 0.5) * Math.PI
    mesh.position.set(
      radius * Math.cos(theta) * Math.cos(phi),
      radius * Math.sin(phi),
      radius * Math.sin(theta) * Math.cos(phi),
    )

    mesh.rotation.set(
      rng() * Math.PI * 2,
      rng() * Math.PI * 2,
      rng() * Math.PI * 2,
    )

    mesh.scale.setScalar(scale)

    scene.add(mesh)

    // Gold edge highlight
    const edgesGeom = new THREE.EdgesGeometry(geom)
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: goldColor,
      transparent: true,
      opacity: 0.6,
    })
    const edgeLines = new THREE.LineSegments(edgesGeom, edgeMaterial)
    // Copy transform from shard mesh
    edgeLines.position.copy(mesh.position)
    edgeLines.rotation.copy(mesh.rotation)
    edgeLines.scale.copy(mesh.scale)
    scene.add(edgeLines)
  }

  // Point light only (GLTFExporter supports directional, point, and spot — not ambient)
  const point = new THREE.PointLight(goldColor, 2, 8)
  point.position.set(0, 2, 2)
  scene.add(point)

  return scene
}

// ---------------------------------------------------------------------------
// Scene 2: scene-capital-chain — Interconnected node graph
// Target: ≤200KB
// ---------------------------------------------------------------------------

function buildSceneCapitalChain(): THREE.Scene {
  const scene = new THREE.Scene()

  // THREE.js hex colors (documented exception)
  const goldColor = 0xB8965A
  const parchmentColor = 0xF5F2EE
  const ruleColor = 0x2A2A2A

  // Node positions in 3D space — fixed layout forming a 3D network
  const nodePositions: [number, number, number][] = [
    [0, 0, 0],         // 0 — central hub
    [1.2, 0.3, 0.2],   // 1
    [-1.1, 0.4, -0.1], // 2
    [0.3, 1.2, 0.3],   // 3
    [-0.4, -1.1, 0.2], // 4
    [0.8, -0.8, 0.5],  // 5
    [-0.7, 0.7, 0.8],  // 6
    [0.1, 0.2, -1.3],  // 7
  ]

  // Node geometries
  nodePositions.forEach((pos, i) => {
    const isCentral = i === 0
    const radius = isCentral ? 0.14 : 0.08
    const geom = new THREE.SphereGeometry(radius, 16, 16)
    const color = isCentral ? parchmentColor : goldColor
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.7,
    })
    const mesh = new THREE.Mesh(geom, material)
    mesh.position.set(...pos)
    scene.add(mesh)
  })

  // Edges — 12 connections between nodes
  const edges: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 5], [1, 7], [2, 6], [2, 7],
    [3, 6], [4, 5], [5, 7], [3, 4],
  ]

  edges.forEach(([a, b]) => {
    const posA = nodePositions[a]
    const posB = nodePositions[b]

    const points = [
      new THREE.Vector3(...posA),
      new THREE.Vector3(...posB),
    ]
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: ruleColor,
      transparent: true,
      opacity: 0.8,
    })
    const line = new THREE.Line(geom, material)
    scene.add(line)
  })

  // Point light (GLTFExporter-supported type)
  const point = new THREE.PointLight(0xffffff, 1.5, 10)
  point.position.set(2, 2, 2)
  scene.add(point)

  return scene
}

// ---------------------------------------------------------------------------
// Scene 3: scene-platforms — Floating platform tiles in 3D space
// Target: ≤350KB total for all three scenes
// ---------------------------------------------------------------------------

function buildScenePlatforms(): THREE.Scene {
  const scene = new THREE.Scene()

  // THREE.js hex colors (documented exception)
  const steelColor = 0x1C2535
  const goldColor = 0xB8965A

  // Three platform tiles in a fan formation
  const tileConfigs: Array<{ x: number; y: number; z: number; rotY: number; rotX: number }> = [
    { x: -1.8, y: 0.3, z: -0.3, rotY: 0.2, rotX: -0.05 },
    { x: 0, y: 0, z: 0, rotY: 0, rotX: 0 },
    { x: 1.8, y: -0.3, z: -0.3, rotY: -0.2, rotX: 0.05 },
  ]

  tileConfigs.forEach((cfg) => {
    const geom = new THREE.PlaneGeometry(1.6, 1.0)
    const material = new THREE.MeshStandardMaterial({
      color: steelColor,
      roughness: 0.5,
      metalness: 0.3,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geom, material)
    mesh.position.set(cfg.x, cfg.y, cfg.z)
    mesh.rotation.set(cfg.rotX, cfg.rotY, 0)
    scene.add(mesh)

    // Gold border edges
    const edgesGeom = new THREE.EdgesGeometry(geom)
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: goldColor,
      transparent: true,
      opacity: 0.9,
    })
    const edgeLines = new THREE.LineSegments(edgesGeom, edgeMaterial)
    edgeLines.position.set(cfg.x, cfg.y, cfg.z + 0.001) // slight Z offset to avoid z-fighting
    edgeLines.rotation.set(cfg.rotX, cfg.rotY, 0)
    scene.add(edgeLines)
  })

  // Directional light (GLTFExporter-supported type)
  const directional = new THREE.DirectionalLight(0xffffff, 1.0)
  directional.position.set(2, 3, 2)
  scene.add(directional)

  return scene
}

// ---------------------------------------------------------------------------
// Main — build all scenes
// ---------------------------------------------------------------------------

console.log('Building OCP WebGL scenes...')

const sceneObsidian = buildSceneObsidian()
const sceneChain = buildSceneCapitalChain()
const scenePlatforms = buildScenePlatforms()

await exportSceneToGLB(sceneObsidian, 'scene-obsidian.glb')
await exportSceneToGLB(sceneChain, 'scene-capital-chain.glb')
await exportSceneToGLB(scenePlatforms, 'scene-platforms.glb')

console.log('Done. GLBs written to /public/scenes/')
