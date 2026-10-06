<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)

let scene, camera, renderer, animationFrameId
let characterGroup, headGroup, eyePupilLeft, eyePupilRight
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0

const initThree = () => {
  if (!container.value) return

  const width = container.value.clientWidth || 400
  const height = container.value.clientHeight || 420

  // 1. Scene
  scene = new THREE.Scene()

  // 2. Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 0.4, 4.6)

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.value.appendChild(renderer.domElement)

  // 4. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
  scene.add(ambientLight)

  const warmKeyLight = new THREE.DirectionalLight(0xfff4e6, 2.0)
  warmKeyLight.position.set(3, 4, 3)
  warmKeyLight.castShadow = true
  scene.add(warmKeyLight)

  const purpleRimLight = new THREE.PointLight(0xc2a4ff, 3.5, 12)
  purpleRimLight.position.set(-3, 2.5, -2)
  scene.add(purpleRimLight)

  const goldAccentLight = new THREE.PointLight(0xffd700, 2.0, 8)
  goldAccentLight.position.set(2, -1, 2)
  scene.add(goldAccentLight)

  // 5. Materials
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xffdfc4,
    roughness: 0.55,
    metalness: 0.05
  })

  const blushMat = new THREE.MeshBasicMaterial({
    color: 0xffa0a0,
    transparent: true,
    opacity: 0.45
  })

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x1c1722,
    roughness: 0.7,
    metalness: 0.1
  })

  const suitMat = new THREE.MeshStandardMaterial({
    color: 0x18171f,
    roughness: 0.6,
    metalness: 0.15
  })

  const shirtMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4
  })

  const tieMat = new THREE.MeshStandardMaterial({
    color: 0x8b263e,
    roughness: 0.4
  })

  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x161d2d,
    roughness: 0.6
  })

  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0x111115,
    roughness: 0.2,
    metalness: 0.8
  })

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xdfb15b,
    metalness: 0.85,
    roughness: 0.25
  })

  const sofaFabricMat = new THREE.MeshStandardMaterial({
    color: 0xefe9df,
    roughness: 0.85
  })

  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const irisMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.2 })
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x100b08 })
  const eyeGlossMat = new THREE.MeshBasicMaterial({ color: 0xffffff })

  // 6. Global Character & Sofa Root
  characterGroup = new THREE.Group()
  characterGroup.position.set(0, -0.3, 0)
  scene.add(characterGroup)

  // --- Ornate Luxury Sofa ---
  const sofaGroup = new THREE.Group()
  sofaGroup.position.set(0, -0.2, -0.1)
  characterGroup.add(sofaGroup)

  // Sofa Seat Cushion
  const seatGeo = new THREE.BoxGeometry(1.9, 0.45, 1.1)
  const seat = new THREE.Mesh(seatGeo, sofaFabricMat)
  seat.position.y = -0.1
  sofaGroup.add(seat)

  // Gold Trim Bottom Base
  const baseTrimGeo = new THREE.BoxGeometry(1.95, 0.08, 1.15)
  const baseTrim = new THREE.Mesh(baseTrimGeo, goldTrimMat)
  baseTrim.position.y = -0.33
  sofaGroup.add(baseTrim)

  // Sofa Backrest
  const backGeo = new THREE.BoxGeometry(1.9, 1.2, 0.35)
  const back = new THREE.Mesh(backGeo, sofaFabricMat)
  back.position.set(0, 0.65, -0.4)
  sofaGroup.add(back)

  // Gold Trim Backrest Top Crest
  const crestGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 32, Math.PI)
  const crest = new THREE.Mesh(crestGeo, goldTrimMat)
  crest.position.set(0, 1.25, -0.4)
  crest.rotation.z = Math.PI
  sofaGroup.add(crest)

  const crestTopBarGeo = new THREE.BoxGeometry(1.95, 0.08, 0.38)
  const crestTopBar = new THREE.Mesh(crestTopBarGeo, goldTrimMat)
  crestTopBar.position.set(0, 1.25, -0.4)
  sofaGroup.add(crestTopBar)

  // Sofa Armrests
  const armrestGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.1, 16)
  const armrestL = new THREE.Mesh(armrestGeo, sofaFabricMat)
  armrestL.rotation.x = Math.PI / 2
  armrestL.position.set(-0.95, 0.25, 0)
  sofaGroup.add(armrestL)

  const armrestR = new THREE.Mesh(armrestGeo, sofaFabricMat)
  armrestR.rotation.x = Math.PI / 2
  armrestR.position.set(0.95, 0.25, 0)
  sofaGroup.add(armrestR)

  // Gold Armrest Trim Caps
  const capGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 16)
  const capL = new THREE.Mesh(capGeo, goldTrimMat)
  capL.rotation.x = Math.PI / 2
  capL.position.set(-0.95, 0.25, 0.55)
  sofaGroup.add(capL)

  const capR = new THREE.Mesh(capGeo, goldTrimMat)
  capR.rotation.x = Math.PI / 2
  capR.position.set(0.95, 0.25, 0.55)
  sofaGroup.add(capR)

  // --- Chibi Body (Suit Jacket & Shirt) ---
  const bodyGroup = new THREE.Group()
  bodyGroup.position.set(0, 0.3, 0.05)
  characterGroup.add(bodyGroup)

  // Suit Torso
  const torsoGeo = new THREE.CylinderGeometry(0.36, 0.42, 0.75, 24)
  const torso = new THREE.Mesh(torsoGeo, suitMat)
  bodyGroup.add(torso)

  // White V-Neck Shirt Insert
  const shirtGeo = new THREE.BoxGeometry(0.26, 0.5, 0.15)
  const shirt = new THREE.Mesh(shirtGeo, shirtMat)
  shirt.position.set(0, 0.15, 0.3)
  shirt.rotation.x = 0.1
  bodyGroup.add(shirt)

  // Tie
  const tieGeo = new THREE.BoxGeometry(0.08, 0.32, 0.04)
  const tie = new THREE.Mesh(tieGeo, tieMat)
  tie.position.set(0, 0.08, 0.38)
  bodyGroup.add(tie)

  // Suit Collar Lapels
  const lapelGeo = new THREE.BoxGeometry(0.1, 0.4, 0.04)
  const lapelL = new THREE.Mesh(lapelGeo, suitMat)
  lapelL.position.set(-0.13, 0.15, 0.36)
  lapelL.rotation.z = -0.3
  bodyGroup.add(lapelL)

  const lapelR = new THREE.Mesh(lapelGeo, suitMat)
  lapelR.position.set(0.13, 0.15, 0.36)
  lapelR.rotation.z = 0.3
  bodyGroup.add(lapelR)

  // Boutonnière (Red/Gold Flower)
  const flowerGeo = new THREE.SphereGeometry(0.04, 12, 12)
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3 })
  const flower = new THREE.Mesh(flowerGeo, flowerMat)
  flower.position.set(-0.2, 0.22, 0.37)
  bodyGroup.add(flower)

  // --- Chibi Legs & Pants (Sitting pose) ---
  const legGeo = new THREE.CylinderGeometry(0.12, 0.11, 0.55, 16)
  const legL = new THREE.Mesh(legGeo, pantsMat)
  legL.rotation.x = Math.PI / 2
  legL.position.set(-0.22, -0.32, 0.3)
  characterGroup.add(legL)

  const legR = new THREE.Mesh(legGeo, pantsMat)
  legR.rotation.x = Math.PI / 2
  legR.position.set(0.22, -0.32, 0.3)
  characterGroup.add(legR)

  // Lower legs dropping down
  const lowerLegGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.45, 16)
  const lowerLegL = new THREE.Mesh(lowerLegGeo, pantsMat)
  lowerLegL.position.set(-0.22, -0.55, 0.55)
  characterGroup.add(lowerLegL)

  const lowerLegR = new THREE.Mesh(lowerLegGeo, pantsMat)
  lowerLegR.position.set(0.22, -0.55, 0.55)
  characterGroup.add(lowerLegR)

  // Loafers / Shoes
  const shoeGeo = new THREE.BoxGeometry(0.16, 0.12, 0.26)
  const shoeL = new THREE.Mesh(shoeGeo, shoeMat)
  shoeL.position.set(-0.22, -0.76, 0.6)
  characterGroup.add(shoeL)

  const shoeR = new THREE.Mesh(shoeGeo, shoeMat)
  shoeR.position.set(0.22, -0.76, 0.6)
  characterGroup.add(shoeR)

  // Arms resting casually on sofa/lap
  const armGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.55, 16)
  const armL = new THREE.Mesh(armGeo, suitMat)
  armL.position.set(-0.46, 0.2, 0.2)
  armL.rotation.z = -0.4
  armL.rotation.x = 0.5
  characterGroup.add(armL)

  const armR = new THREE.Mesh(armGeo, suitMat)
  armR.position.set(0.46, 0.2, 0.2)
  armR.rotation.z = 0.4
  armR.rotation.x = 0.5
  characterGroup.add(armR)

  // Hands
  const handGeo = new THREE.SphereGeometry(0.08, 16, 16)
  const handL = new THREE.Mesh(handGeo, skinMat)
  handL.position.set(-0.35, -0.05, 0.45)
  characterGroup.add(handL)

  const handR = new THREE.Mesh(handGeo, skinMat)
  handR.position.set(0.35, -0.05, 0.45)
  characterGroup.add(handR)

  // --- Chibi Head Group ---
  headGroup = new THREE.Group()
  headGroup.position.set(0, 1.15, 0.05)
  characterGroup.add(headGroup)

  // Large Chibi Head
  const headGeo = new THREE.SphereGeometry(0.58, 32, 32)
  const headMesh = new THREE.Mesh(headGeo, skinMat)
  headGroup.add(headMesh)

  // Cheeks / Blush
  const blushGeo = new THREE.SphereGeometry(0.1, 16, 16)
  const blushL = new THREE.Mesh(blushGeo, blushMat)
  blushL.position.set(-0.35, -0.1, 0.42)
  headGroup.add(blushL)

  const blushR = new THREE.Mesh(blushGeo, blushMat)
  blushR.position.set(0.35, -0.1, 0.42)
  headGroup.add(blushR)

  // Big Expressive Cartoon Eyes
  const eyeWhiteGeo = new THREE.SphereGeometry(0.14, 24, 24)
  const irisGeo = new THREE.SphereGeometry(0.09, 20, 20)
  const pupilGlossGeo = new THREE.SphereGeometry(0.035, 12, 12)

  // Left Eye
  const eyeWhiteL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat)
  eyeWhiteL.position.set(-0.2, 0.05, 0.47)
  headGroup.add(eyeWhiteL)

  eyePupilLeft = new THREE.Mesh(irisGeo, irisMat)
  eyePupilLeft.position.set(-0.2, 0.05, 0.54)
  headGroup.add(eyePupilLeft)

  const innerPupilL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), pupilMat)
  innerPupilL.position.set(0, 0, 0.05)
  eyePupilLeft.add(innerPupilL)

  const eyeGlossL = new THREE.Mesh(pupilGlossGeo, eyeGlossMat)
  eyeGlossL.position.set(0.03, 0.03, 0.075)
  eyePupilLeft.add(eyeGlossL)

  // Right Eye
  const eyeWhiteR = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat)
  eyeWhiteR.position.set(0.2, 0.05, 0.47)
  headGroup.add(eyeWhiteR)

  eyePupilRight = new THREE.Mesh(irisGeo, irisMat)
  eyePupilRight.position.set(0.2, 0.05, 0.54)
  headGroup.add(eyePupilRight)

  const innerPupilR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), pupilMat)
  innerPupilR.position.set(0, 0, 0.05)
  eyePupilRight.add(innerPupilR)

  const eyeGlossR = new THREE.Mesh(pupilGlossGeo, eyeGlossMat)
  eyeGlossR.position.set(0.03, 0.03, 0.075)
  eyePupilRight.add(eyeGlossR)

  // Smile
  const smileGeo = new THREE.TorusGeometry(0.07, 0.015, 12, 24, Math.PI)
  const smileMat = new THREE.MeshBasicMaterial({ color: 0x7c2d12 })
  const smile = new THREE.Mesh(smileGeo, smileMat)
  smile.position.set(0, -0.15, 0.55)
  smile.rotation.z = Math.PI
  smile.rotation.x = -0.2
  headGroup.add(smile)

  // Dark Parted Styled Hair
  const hairBaseGeo = new THREE.SphereGeometry(0.61, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55)
  const hairBase = new THREE.Mesh(hairBaseGeo, hairMat)
  hairBase.position.set(0, 0.06, -0.02)
  headGroup.add(hairBase)

  // Front Side-Parted Fringe Bangs
  const bangLGeo = new THREE.ConeGeometry(0.2, 0.45, 16)
  const bangL = new THREE.Mesh(bangLGeo, hairMat)
  bangL.position.set(-0.25, 0.35, 0.45)
  bangL.rotation.z = -Math.PI / 3
  bangL.rotation.x = -0.3
  headGroup.add(bangL)

  const bangRGeo = new THREE.ConeGeometry(0.24, 0.55, 16)
  const bangR = new THREE.Mesh(bangRGeo, hairMat)
  bangR.position.set(0.18, 0.32, 0.46)
  bangR.rotation.z = Math.PI / 3.5
  bangR.rotation.x = -0.3
  headGroup.add(bangR)

  // Gentle Floating Ring platform below
  const platformGeo = new THREE.CylinderGeometry(1.25, 1.35, 0.1, 32)
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x140e1b,
    metalness: 0.8,
    roughness: 0.3
  })
  const platform = new THREE.Mesh(platformGeo, platformMat)
  platform.position.y = -0.85
  characterGroup.add(platform)

  const ringGlowGeo = new THREE.RingGeometry(1.36, 1.42, 40)
  const ringGlowMat = new THREE.MeshBasicMaterial({ color: 0xc2a4ff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
  const ringGlow = new THREE.Mesh(ringGlowGeo, ringGlowMat)
  ringGlow.rotation.x = Math.PI / 2
  ringGlow.position.y = -0.82
  characterGroup.add(ringGlow)
}

const onMouseMove = (event) => {
  if (!container.value) return
  const mouseScreenX = (event.clientX / window.innerWidth) * 2 - 1
  const mouseScreenY = -(event.clientY / window.innerHeight) * 2 + 1

  targetX = mouseScreenX
  targetY = mouseScreenY
}

const onTouchMove = (event) => {
  if (event.touches.length > 0) {
    const touch = event.touches[0]
    targetX = (touch.clientX / window.innerWidth) * 2 - 1
    targetY = -(touch.clientY / window.innerHeight) * 2 + 1
  }
}

const animate = (time) => {
  animationFrameId = requestAnimationFrame(animate)

  // Smooth lerping
  currentX += (targetX - currentX) * 0.08
  currentY += (targetY - currentY) * 0.08

  const t = time * 0.002

  // Gentle idle breathing floating effect
  if (characterGroup) {
    characterGroup.position.y = -0.3 + Math.sin(t * 1.6) * 0.035
    characterGroup.rotation.y = currentX * 0.25
  }

  // Head tracks the cursor / mouse
  if (headGroup) {
    headGroup.rotation.y = currentX * 0.65
    headGroup.rotation.x = -currentY * 0.4
    headGroup.rotation.z = -currentX * 0.12
  }

  // Big cartoon pupils follow cursor precisely
  if (eyePupilLeft && eyePupilRight) {
    const pupilOffsetX = currentX * 0.025
    const pupilOffsetY = currentY * 0.025
    eyePupilLeft.position.x = -0.2 + pupilOffsetX
    eyePupilLeft.position.y = 0.05 + pupilOffsetY
    eyePupilRight.position.x = 0.2 + pupilOffsetX
    eyePupilRight.position.y = 0.05 + pupilOffsetY
  }

  renderer.render(scene, camera)
}

const handleResize = () => {
  if (!container.value || !renderer || !camera) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  initThree()
  animate(0)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('resize', handleResize)
  if (renderer && renderer.domElement && container.value) {
    container.value.removeChild(renderer.domElement)
    renderer.dispose()
  }
})
</script>

<template>
  <div class="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
    <!-- Ambient 3D character glow plate -->
    <div class="absolute inset-0 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
    <div ref="container" class="w-full h-full cursor-grab active:cursor-grabbing"></div>
  </div>
</template>
