<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { portfolioData } from '../data/portfolio'
import { Disc3, Radio, Coffee, Sparkles } from 'lucide-vue-next'

const container = ref(null)
const isPlayingLofi = ref(false)
const currentTrackName = ref('Midnight Chill - 72 BPM')
const isBlinking = ref(false)
const dialogVisible = ref(false)
const displayedDialog = ref('')
const gyroEnabled = ref(false)
const gyroSupported = ref(false)
const gyroActive = ref(false)

const onDeviceOrientation = (event) => {
  let gamma = event.gamma
  let beta = event.beta
  if (gamma === null || beta === null) return
  gyroActive.value = true

  // Adjust for landscape orientation if the phone is rotated
  if (window.innerWidth > window.innerHeight) {
    const temp = gamma
    gamma = beta
    beta = -temp
  }

  // gamma: left/right tilt, beta: front/back tilt around a comfortable hold angle
  targetMouseX = Math.max(-1, Math.min(1, gamma / 28))
  targetMouseY = Math.max(-1, Math.min(1, (45 - beta) / 28))
}

const enableGyroscope = async () => {
  try {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      const res = await DeviceOrientationEvent.requestPermission()
      if (res !== 'granted') return
    }
    window.addEventListener('deviceorientation', onDeviceOrientation)
    window.addEventListener('deviceorientationabsolute', onDeviceOrientation)
    gyroEnabled.value = true
  } catch (e) {
    console.warn('Gyroscope error:', e)
  }
}

const dialogTexts = [
  'Hi, I am Kaizen. Would you like to know about my hobbies?',
  'In this machine I just examined some UNIX authentication logs and WTMP logs on a machine that is trying to be brute forced and finding information about the attack and what is the IP address of the threat actor',
  'While in this challenge we had been given a machine to attack on, in this system I had discovered that it is vulnerable to a Server-side Template Injection (SSTI), I exploited those vulnerabilities to have create a payload that will grant me a change to perform a Remote Code Execution(RCE) to print out the flag.'
]
let dialogInterval = null

const startDialog = (text) => {
  displayedDialog.value = ''
  let i = 0
  clearInterval(dialogInterval)
  dialogInterval = setInterval(() => {
    displayedDialog.value += text[i]
    i++
    if (i >= text.length) clearInterval(dialogInterval)
  }, 28)
}

const dismissDialog = () => {
  clearInterval(dialogInterval)
  dialogVisible.value = false
}

let blinkTimeout = null

const triggerDoubleBlink = () => {
  // First blink - smooth close
  isBlinking.value = true
  setTimeout(() => {
    // First blink - smooth open
    isBlinking.value = false
    // Soft natural pause between the double blink
    setTimeout(() => {
      // Second blink - smooth close
      isBlinking.value = true
      setTimeout(() => {
        // Second blink - smooth open
        isBlinking.value = false
        scheduleNextBlink()
      }, 260)
    }, 180)
  }, 260)
}

const scheduleNextBlink = () => {
  // Blink every 2.5 to 3.5 seconds
  const nextInterval = 2500 + Math.random() * 1000
  blinkTimeout = setTimeout(triggerDoubleBlink, nextInterval)
}

let scene, camera, renderer, animationFrameId
let roomGroup, vinylDisc, deskLampLight, screenGlowLight, plantGroup, monitorGroup
let ambientLight, moonLight, themeObserver, rendererRef
let wallMatRef, floorMatRef, rugMatRef, windowMatRef
let lampBase = 3.3
const nightBg = new THREE.Color(0x0b080c)
const dayBg = new THREE.Color(0x9cc8ee)
let handsGroup, handFingers = []
let typingEndTime = 0
let handsRetract = 0
let typingCamWeight = 0
let baseCamZ = 0.85
let screenMaterial, screenCanvas, screenCtx, screenTexture
let mouseX = 0, mouseY = 0
let targetMouseX = 0, targetMouseY = 0
let baseCamY = 1.05

// Screen slideshow states:
// 0: Portfolio & Skills (10 seconds)
// 1: Brutus Solved Image (5 seconds)
// 2: Spookifier Solved Image (5 seconds)
let currentScreenSlide = 0
let screenSlideTimer = null

const brutusImg = new Image()
brutusImg.src = '/solved-brutus.png'

const spookifierImg = new Image()
spookifierImg.src = '/solved-spookifier.png'

const renderPortfolioSlide = (ctx) => {
  ctx.fillStyle = '#0b0811'
  ctx.fillRect(0, 0, 1024, 680)

  // Browser Header Bar
  ctx.fillStyle = '#171124'
  ctx.fillRect(0, 0, 1024, 52)
  ctx.strokeStyle = '#2d1b4e'
  ctx.lineWidth = 1
  ctx.strokeRect(0, 0, 1024, 52)

  // Window Controls (Red, Yellow, Green)
  ctx.fillStyle = '#ff5f56'; ctx.beginPath(); ctx.arc(30, 26, 7, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffbd2e'; ctx.beginPath(); ctx.arc(52, 26, 7, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#27c93f'; ctx.beginPath(); ctx.arc(74, 26, 7, 0, Math.PI * 2); ctx.fill()

  // URL Bar in Browser
  ctx.fillStyle = '#211833'
  ctx.roundRect ? ctx.roundRect(160, 12, 700, 28, 8) : ctx.fillRect(160, 12, 700, 28)
  ctx.fill()
  ctx.fillStyle = '#a78bfa'
  ctx.font = '13px "Courier New", monospace'
  ctx.fillText(`https://${portfolioData.name.toLowerCase().replace(/\s+/g, '')}.dev/`, 180, 31)

  // Top Nav Brand (K logo + name)
  ctx.strokeStyle = '#a855f7'
  ctx.lineWidth = 2
  ctx.strokeRect(48, 78, 38, 38)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 20px system-ui, sans-serif'
  ctx.fillText('K', 61, 104)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px system-ui, sans-serif'
  ctx.fillText(portfolioData.name.replace(/\s+/g, ''), 100, 102)

  ctx.fillStyle = '#a78bfa'
  ctx.font = '14px system-ui, sans-serif'
  ctx.fillText('•  Available for hire', 230, 100)

  ctx.fillStyle = '#e2e8f0'
  ctx.font = '14px system-ui, sans-serif'
  ctx.fillText('About     Projects     Skills     Experience     Contact', 660, 100)

  // Status Badge
  ctx.fillStyle = '#2a1a45'
  ctx.beginPath()
  if (ctx.roundRect) { ctx.roundRect(48, 150, 180, 30, 15) } else { ctx.rect(48, 150, 180, 30) }
  ctx.fill()
  ctx.strokeStyle = '#6d28d9'
  ctx.stroke()
  ctx.fillStyle = '#c2a4ff'
  ctx.font = '12px system-ui, sans-serif'
  ctx.fillText('</>  FULL STACK DEV', 70, 169)

  // Main Heading
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 40px system-ui, sans-serif'
  ctx.fillText(`Hi, I'm `, 48, 225)
  const hiWidth = ctx.measureText(`Hi, I'm `).width
  ctx.fillStyle = '#c084fc'
  ctx.fillText(portfolioData.name, 48 + hiWidth, 225)

  // Role subtitle
  ctx.fillStyle = '#c084fc'
  ctx.font = 'bold 20px system-ui, sans-serif'
  ctx.fillText(portfolioData.title, 48, 260)

  // Bio Paragraph (wrapped)
  ctx.fillStyle = '#94a3b8'
  ctx.font = '16px system-ui, sans-serif'
  const words = portfolioData.bio.split(' ')
  let line = ''
  let y = 280
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > 920 && n > 0) {
      ctx.fillText(line, 48, y)
      line = words[n] + ' '
      y += 24
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, 48, y)

  // Skills Section Header
  y += 48
  ctx.fillStyle = '#e2e8f0'
  ctx.font = 'bold 18px system-ui, sans-serif'
  ctx.fillText('SKILLS & TECHNOLOGIES', 48, y)

  // Skills Pills / Badges
  y += 20
  let pillX = 48
  let pillY = y
  const skills = ['JavaScript (ES6+)', 'HTML', 'Vue.js', 'React', 'Node.js', 'Tailwind CSS', 'Express.js', 'PostgreSQL', 'Git', 'VS Code', 'Figma']

  ctx.font = '14px system-ui, sans-serif'
  skills.forEach((skill) => {
    const textWidth = ctx.measureText(skill).width
    const pillWidth = textWidth + 28
    const pillHeight = 32

    if (pillX + pillWidth > 960) {
      pillX = 48
      pillY += 40
    }

    // Pill background
    ctx.fillStyle = '#1e1430'
    if (ctx.roundRect) {
      ctx.beginPath()
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 16)
      ctx.fill()
      ctx.strokeStyle = '#6d28d9'
      ctx.stroke()
    } else {
      ctx.fillRect(pillX, pillY, pillWidth, pillHeight)
    }

    // Pill text
    ctx.fillStyle = '#ddd6fe'
    ctx.fillText(skill, pillX + 14, pillY + 21)

    pillX += pillWidth + 12
  })

  // Code Snippet Box Preview at the bottom
  const boxY = Math.max(pillY + 54, 520)
  ctx.fillStyle = '#130d1d'
  if (ctx.roundRect) {
    ctx.beginPath()
    ctx.roundRect(48, boxY, 928, 150, 10)
    ctx.fill()
    ctx.strokeStyle = '#382559'
    ctx.stroke()
  } else {
    ctx.fillRect(48, boxY, 928, 150)
  }

  ctx.fillStyle = '#64748b'
  ctx.font = '13px monospace'
  ctx.fillText('// Building something great...', 820, boxY + 28)
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('1  const kaizen = {', 68, boxY + 28)
  ctx.fillStyle = '#38bdf8'
  ctx.fillText(`2    name: "${portfolioData.name}",`, 68, boxY + 52)
  ctx.fillStyle = '#38bdf8'
  ctx.fillText(`3    role: "${portfolioData.title}",`, 68, boxY + 76)
  ctx.fillStyle = '#c084fc'
  ctx.fillText('4    passion: ["coding", "cars", "hacking"]', 68, boxY + 100)
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('5  };', 68, boxY + 124)
}

const renderImageSlide = (ctx, img, titleUrl) => {
  ctx.fillStyle = '#0e0b16'
  ctx.fillRect(0, 0, 1024, 680)

  // Browser Top Bar
  ctx.fillStyle = '#171124'
  ctx.fillRect(0, 0, 1024, 52)
  ctx.strokeStyle = '#2d1b4e'
  ctx.lineWidth = 1
  ctx.strokeRect(0, 0, 1024, 52)

  // Window Controls (Red, Yellow, Green)
  ctx.fillStyle = '#ff5f56'; ctx.beginPath(); ctx.arc(30, 26, 7, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffbd2e'; ctx.beginPath(); ctx.arc(52, 26, 7, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#27c93f'; ctx.beginPath(); ctx.arc(74, 26, 7, 0, Math.PI * 2); ctx.fill()

  // URL Bar in Browser
  ctx.fillStyle = '#211833'
  ctx.roundRect ? ctx.roundRect(160, 12, 700, 28, 8) : ctx.fillRect(160, 12, 700, 28)
  ctx.fill()
  ctx.fillStyle = '#a78bfa'
  ctx.font = '13px "Courier New", monospace'
  ctx.fillText(titleUrl, 180, 31)

  // Draw image if loaded, scaled with letterboxing to preserve aspect ratio
  if (img && img.complete && img.naturalWidth > 0) {
    const availW = 1024
    const availH = 680 - 52
    const imgRatio = img.naturalWidth / img.naturalHeight
    const targetRatio = availW / availH

    let dw, dh, dx, dy
    if (imgRatio > targetRatio) {
      dw = availW
      dh = availW / imgRatio
      dx = 0
      dy = 52 + (availH - dh) / 2
    } else {
      dh = availH
      dw = availH * imgRatio
      dx = (availW - dw) / 2
      dy = 52
    }

    ctx.drawImage(img, dx, dy, dw, dh)
  } else {
    // Fallback if image still loading
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 24px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Loading Challenge Achievement...', 512, 340)
    ctx.textAlign = 'left'
  }
}

const updateScreenContent = () => {
  if (!screenCtx || !screenTexture) return

  if (currentScreenSlide === 0) {
    renderPortfolioSlide(screenCtx)
  } else if (currentScreenSlide === 1) {
    renderImageSlide(screenCtx, brutusImg, 'https://app.hackthebox.com/sherlocks/brutus/completed')
  } else if (currentScreenSlide === 2) {
    renderImageSlide(screenCtx, spookifierImg, 'https://app.hackthebox.com/challenges/spookifier/completed')
  }

  screenTexture.needsUpdate = true
}

const advanceScreenSlide = () => {
  currentScreenSlide = (currentScreenSlide + 1) % 3
  updateScreenContent()
  // Show the game-style dialog for every slide
  dialogVisible.value = true
  startDialog(dialogTexts[currentScreenSlide])
}

// Click / tap detection for the monitor
let pointerDownX = 0
let pointerDownY = 0

const onPointerDown = (event) => {
  pointerDownX = event.clientX
  pointerDownY = event.clientY
}

const onPointerUp = (event) => {
  const dx = event.clientX - pointerDownX
  const dy = event.clientY - pointerDownY
  // Ignore drags (used for looking around); only treat small movements as taps
  if (dx * dx + dy * dy > 64) return
  handleMonitorClick(event.clientX, event.clientY)
}

const applySceneTheme = () => {
  const isDark = document.documentElement.classList.contains('dark')
  rendererRef = renderer
  if (isDark) {
    scene.background = nightBg
    if (ambientLight) {
      ambientLight.color.set(0x2d1b4e)
      ambientLight.intensity = 1.3
    }
    if (moonLight) {
      moonLight.color.set(0xb49bff)
      moonLight.intensity = 2.4
      moonLight.position.set(-4, 5, 2)
    }
    lampBase = 3.3
    if (screenGlowLight) screenGlowLight.intensity = 2.6
    rendererRef.toneMappingExposure = 1.25
    if (floorMatRef) floorMatRef.color.set(0x181024)
    if (wallMatRef) wallMatRef.color.set(0x1d142b)
    if (rugMatRef) rugMatRef.color.set(0x542344)
    if (windowMatRef) {
      windowMatRef.color.set(0x68428d)
      windowMatRef.emissive.set(0x48227d)
      windowMatRef.emissiveIntensity = 0.8
    }
  } else {
    scene.background = dayBg
    if (ambientLight) {
      ambientLight.color.set(0xffe8c8)
      ambientLight.intensity = 1.6
    }
    if (moonLight) {
      moonLight.color.set(0xffcf8a)
      moonLight.intensity = 4.0
      // Shine sunlight through the window into the room
      moonLight.position.set(-2.5, 4.5, -2.2)
    }
    lampBase = 0.4
    if (screenGlowLight) screenGlowLight.intensity = 1.0
    rendererRef.toneMappingExposure = 1.35
    if (floorMatRef) floorMatRef.color.set(0x181024)
    if (wallMatRef) wallMatRef.color.set(0x1d142b)
    if (rugMatRef) rugMatRef.color.set(0x542344)
    if (windowMatRef) {
      windowMatRef.color.set(0xbfe3ff)
      windowMatRef.emissive.set(0x9ed0ff)
      windowMatRef.emissiveIntensity = 1.8
    }
  }
}

const isMonitorHit = (clientX, clientY) => {
  if (!container.value || !camera || !renderer || !monitorGroup) return false
  const rect = renderer.domElement.getBoundingClientRect()
  const ndc = new THREE.Vector2(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1
  )
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(ndc, camera)
  return raycaster.intersectObject(monitorGroup, true).length > 0
}

const handleMonitorClick = (clientX, clientY) => {
  if (isMonitorHit(clientX, clientY)) {
    advanceScreenSlide()
    // Trigger the typing animation on the keyboard for ~2.5 seconds
    typingEndTime = performance.now() + 2500
  }
}

// Ambient Lofi Chords Generator using Web Audio API
let audioCtx = null
let lofiInterval = null

const toggleLofiAudio = () => {
  if (isPlayingLofi.value) {
    if (audioCtx) {
      audioCtx.close()
      audioCtx = null
    }
    clearInterval(lofiInterval)
    isPlayingLofi.value = false
    return
  }

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioCtx = new AudioContext()
    isPlayingLofi.value = true

    // Nostalgic jazz lofi chords (Fmaj7 - Em7 - Dm7 - Cmaj7)
    const chords = [
      [174.61, 220.00, 261.63, 329.63],
      [164.81, 196.00, 246.94, 293.66],
      [146.83, 174.61, 220.00, 261.63],
      [130.81, 164.81, 196.00, 246.94]
    ]

    let chordIdx = 0

    const playChord = () => {
      if (!audioCtx || audioCtx.state === 'closed') return
      const currentChord = chords[chordIdx]
      chordIdx = (chordIdx + 1) % chords.length

      currentChord.forEach(freq => {
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        const filter = audioCtx.createBiquadFilter()

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(450 + Math.random() * 80, audioCtx.currentTime)

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime)

        gain.gain.setValueAtTime(0.001, audioCtx.currentTime)
        gain.gain.linearRampToValueAtTime(0.035, audioCtx.currentTime + 0.8)
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.8)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(audioCtx.destination)

        osc.start()
        osc.stop(audioCtx.currentTime + 4.0)
      })
    }

    playChord()
    lofiInterval = setInterval(playChord, 3800)
  } catch (e) {
    console.warn('Audio error:', e)
  }
}

// Procedural Screen Texture (Rendered as a sleek dark portfolio site or challenge achievements)
const createScreenTexture = () => {
  screenCanvas = document.createElement('canvas')
  screenCanvas.width = 1024
  screenCanvas.height = 680
  screenCtx = screenCanvas.getContext('2d')

  screenTexture = new THREE.CanvasTexture(screenCanvas)
  screenTexture.minFilter = THREE.LinearFilter
  screenTexture.generateMipmaps = false

  // Render the first (about me) slide now that the texture exists
  updateScreenContent()
  return screenTexture
}

const initThree = () => {
  if (!container.value) return

  const width = container.value.clientWidth || 500
  const height = container.value.clientHeight || 460

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0b080c)

  // Responsive FOV & camera distance based on aspect ratio
  const aspect = width / height
  const fov = aspect < 1 ? 75 : aspect < 1.4 ? 65 : 55
  const camZ = aspect < 1 ? 1.05 : 0.85
  const camY = aspect < 1 ? 1.15 : 1.05
  baseCamY = camY

  // POV Sitting right at the desk
  camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100)
  baseCamZ = camZ
  camera.position.set(0, camY, camZ)
  camera.lookAt(0, 0.98, -0.6)

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.value.appendChild(renderer.domElement)

  // Lighting
  ambientLight = new THREE.AmbientLight(0x2d1b4e, 1.3)
  scene.add(ambientLight)

  moonLight = new THREE.DirectionalLight(0xb49bff, 2.4)
  moonLight.position.set(-4, 5, 2)
  moonLight.castShadow = true
  moonLight.shadow.mapSize.set(2048, 2048)
  moonLight.shadow.camera.left = -5
  moonLight.shadow.camera.right = 5
  moonLight.shadow.camera.top = 5
  moonLight.shadow.camera.bottom = -5
  moonLight.shadow.camera.near = 0.5
  moonLight.shadow.camera.far = 20
  moonLight.target.position.set(1.0, 0, 0.8)
  scene.add(moonLight.target)
  scene.add(moonLight)

  deskLampLight = new THREE.PointLight(0xffb366, 3.6, 6)
  deskLampLight.position.set(-0.8, 1.1, -0.4)
  deskLampLight.castShadow = true
  scene.add(deskLampLight)

  screenGlowLight = new THREE.PointLight(0xa87cff, 2.6, 5)
  screenGlowLight.position.set(0.1, 0.75, -0.1)
  scene.add(screenGlowLight)

  const warmRim = new THREE.PointLight(0xff77aa, 1.8, 6)
  warmRim.position.set(2, 0.8, 1.5)
  scene.add(warmRim)

  // Materials
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x382823, roughness: 0.45, metalness: 0.1 })
  floorMatRef = new THREE.MeshStandardMaterial({ color: 0x181024, roughness: 0.6, metalness: 0.2 })
  const floorMat = floorMatRef
  wallMatRef = new THREE.MeshStandardMaterial({ color: 0x1d142b, roughness: 0.8 })
  const wallMat = wallMatRef
  rugMatRef = new THREE.MeshStandardMaterial({ color: 0x542344, roughness: 0.85 })
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x222228, roughness: 0.35, metalness: 0.8 })
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.7 })
  const lampShadeMat = new THREE.MeshStandardMaterial({ color: 0xffaa44, roughness: 0.2, emissive: 0x884411, emissiveIntensity: 0.6 })
  const plantPotMat = new THREE.MeshStandardMaterial({ color: 0xdf8d71, roughness: 0.7 })
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x4e8d69, roughness: 0.4 })
  const cupMat = new THREE.MeshStandardMaterial({ color: 0xeee4db, roughness: 0.3 })
  const coffeeLiquidMat = new THREE.MeshStandardMaterial({ color: 0x3a1f14, roughness: 0.2 })

  roomGroup = new THREE.Group()
  scene.add(roomGroup)

  // Room Floor
  const floorGeo = new THREE.BoxGeometry(7.0, 0.2, 6.0)
  const floorMesh = new THREE.Mesh(floorGeo, floorMat)
  floorMesh.position.set(0, -0.1, 0)
  floorMesh.receiveShadow = true
  roomGroup.add(floorMesh)

  // Rug
  const rugGeo = new THREE.BoxGeometry(4.2, 0.02, 3.2)
  const rugMat = rugMatRef
  const rugMesh = new THREE.Mesh(rugGeo, rugMat)
  rugMesh.position.set(0, 0.01, 0.3)
  rugMesh.receiveShadow = true
  roomGroup.add(rugMesh)

  // Back Wall
  const backWallGeo = new THREE.BoxGeometry(7.0, 4.4, 0.15)
  const backWall = new THREE.Mesh(backWallGeo, wallMat)
  backWall.position.set(0, 2.1, -2.9)
  backWall.receiveShadow = true
  roomGroup.add(backWall)

  // Left Side Wall
  const sideWallGeo = new THREE.BoxGeometry(0.15, 4.4, 6.0)
  const sideWall = new THREE.Mesh(sideWallGeo, wallMat)
  sideWall.position.set(-3.45, 2.1, 0)
  sideWall.receiveShadow = true
  roomGroup.add(sideWall)

  // Right Side Wall
  const rightWall = new THREE.Mesh(sideWallGeo, wallMat)
  rightWall.position.set(3.45, 2.1, 0)
  rightWall.receiveShadow = true
  roomGroup.add(rightWall)

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.15, 6.0), wallMat)
  ceiling.position.set(0, 4.3, 0)
  roomGroup.add(ceiling)

  // Ceiling Grid / Trim Accent
  const trimGeo = new THREE.BoxGeometry(7.0, 0.08, 0.08)
  const trimMesh = new THREE.Mesh(trimGeo, darkMetalMat)
  trimMesh.position.set(0, 4.25, -2.85)
  roomGroup.add(trimMesh)

  // Window
  const windowGeo = new THREE.BoxGeometry(2.4, 1.8, 0.06)
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x68428d,
    emissive: 0x48227d,
    emissiveIntensity: 0.8,
    roughness: 0.1
  })
  windowMatRef = windowMat
  const windowMesh = new THREE.Mesh(windowGeo, windowMat)
  windowMesh.position.set(-1.2, 2.1, -2.82)
  roomGroup.add(windowMesh)

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x120a1c, roughness: 0.5 })
  const hBar = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.04, 0.08), frameMat)
  hBar.position.set(-1.2, 2.1, -2.78)
  roomGroup.add(hBar)
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.84, 0.08), frameMat)
  vBar.position.set(-1.2, 2.1, -2.78)
  roomGroup.add(vBar)

  // Desk
  const deskTopGeo = new THREE.BoxGeometry(2.6, 0.1, 1.2)
  const deskTop = new THREE.Mesh(deskTopGeo, deskMat)
  deskTop.position.set(0, 0.65, -0.4)
  deskTop.castShadow = true
  deskTop.receiveShadow = true
  roomGroup.add(deskTop)

  const legPositions = [
    [-1.2, 0.3, -0.9],
    [1.2, 0.3, -0.9],
    [-1.2, 0.3, 0.1],
    [1.2, 0.3, 0.1]
  ]
  legPositions.forEach(([x, y, z]) => {
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 12)
    const legMesh = new THREE.Mesh(legGeo, darkMetalMat)
    legMesh.position.set(x, y, z)
    legMesh.castShadow = true
    roomGroup.add(legMesh)
  })

  // Monitor
  monitorGroup = new THREE.Group()
  monitorGroup.position.set(0, 0.7, -0.55)
  roomGroup.add(monitorGroup)

  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 24), darkMetalMat)
  standBase.position.y = 0.01
  monitorGroup.add(standBase)

  const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 16), darkMetalMat)
  standPole.position.set(0, 0.15, -0.05)
  monitorGroup.add(standPole)

  const screenTex = createScreenTexture()
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex })

  const screenBezel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.72, 0.04), darkMetalMat)
  screenBezel.position.set(0, 0.42, 0)
  screenBezel.castShadow = true
  monitorGroup.add(screenBezel)

  const screenDisplay = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 0.66), screenMat)
  screenDisplay.position.set(0, 0.42, 0.022)
  monitorGroup.add(screenDisplay)

  // Desk Mat & Peripherals
  const deskMatPad = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.01, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x221a2e, roughness: 0.8 })
  )
  deskMatPad.position.set(0, 0.706, -0.32)
  deskMatPad.receiveShadow = true
  roomGroup.add(deskMatPad)

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.03, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x161220, roughness: 0.4 })
  )
  keyboard.position.set(-0.05, 0.72, -0.28)
  keyboard.castShadow = true
  roomGroup.add(keyboard)

  const mouse = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.025, 0.13),
    new THREE.MeshStandardMaterial({ color: 0xc2a4ff, roughness: 0.3 })
  )
  mouse.position.set(0.46, 0.72, -0.28)
  roomGroup.add(mouse)

  // Typing Hands (animate when the monitor is clicked)
  handsGroup = new THREE.Group()
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd9a077, roughness: 0.6 })

  const createHand = (x, isLeft) => {
    const hand = new THREE.Group()
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.15), skinMat)
    palm.position.y = 0.025
    palm.castShadow = true
    hand.add(palm)

    for (let i = 0; i < 4; i++) {
      const finger = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 0.09), skinMat)
      finger.position.set(-0.056 + i * 0.037, 0.028, -0.105)
      finger.castShadow = true
      hand.add(finger)
      handFingers.push({ mesh: finger, restY: 0.028, phase: i * 1.3 + (isLeft ? 0 : 0.7) })
    }

    const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 0.06), skinMat)
    thumb.position.set(isLeft ? 0.085 : -0.085, 0.028, -0.01)
    thumb.rotation.y = isLeft ? -0.6 : 0.6
    hand.add(thumb)

    // Forearm extending back toward the camera
    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, 0.42), skinMat)
    forearm.position.set(isLeft ? 0.03 : -0.03, 0.02, 0.26)
    forearm.rotation.y = isLeft ? 0.12 : -0.12
    forearm.castShadow = true
    hand.add(forearm)

    hand.position.set(x, 0.735, -0.21)
    hand.rotation.x = -0.15
    return hand
  }

  handsGroup.add(createHand(-0.18, true))
  handsGroup.add(createHand(0.10, false))
  handsGroup.visible = false
  roomGroup.add(handsGroup)

  // Desk Lamp
  const lampGroup = new THREE.Group()
  lampGroup.position.set(-0.95, 0.7, -0.55)
  roomGroup.add(lampGroup)

  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 20), brassMat)
  lampBase.position.y = 0.01
  lampGroup.add(lampBase)

  // Vertical pole
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 12), brassMat)
  lampPole.position.set(0, 0.235, 0)
  lampGroup.add(lampPole)

  // Horizontal arm (angled back so it doesn't block the monitor)
  const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 12), brassMat)
  lampArm.position.set(-0.12, 0.45, -0.1)
  lampArm.rotation.z = -Math.PI / 2.4
  lampArm.rotation.y = 0.5
  lampGroup.add(lampArm)

  // Hanging shade (wide opening faces the desk)
  const lampCone = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.14, 20, 1, true), lampShadeMat)
  lampCone.position.set(-0.24, 0.4, -0.16)
  lampGroup.add(lampCone)

  // Bulb inside the shade
  const lampBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffeedd })
  )
  lampBulb.position.set(-0.24, 0.34, -0.16)
  lampGroup.add(lampBulb)

  // Vinyl / Lo-Fi Record Player
  const turntableGroup = new THREE.Group()
  turntableGroup.position.set(0.85, 0.7, -0.38)
  roomGroup.add(turntableGroup)

  const playerBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.08, 0.44),
    new THREE.MeshStandardMaterial({ color: 0x2b1e1a, roughness: 0.5 })
  )
  playerBody.position.y = 0.04
  playerBody.castShadow = true
  turntableGroup.add(playerBody)

  const vinylGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.01, 32)
  const vinylMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.15, metalness: 0.9 })
  vinylDisc = new THREE.Mesh(vinylGeo, vinylMat)
  vinylDisc.position.set(-0.06, 0.085, 0)
  turntableGroup.add(vinylDisc)

  const vinylLabel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.012, 24),
    new THREE.MeshStandardMaterial({ color: 0xdf8d71, roughness: 0.5 })
  )
  vinylLabel.position.set(-0.06, 0.086, 0)
  turntableGroup.add(vinylLabel)

  const armPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 12), brassMat)
  armPivot.position.set(0.15, 0.09, -0.12)
  turntableGroup.add(armPivot)

  const tonearmBar = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.22), brassMat)
  tonearmBar.position.set(0.08, 0.1, -0.02)
  tonearmBar.rotation.y = -0.35
  turntableGroup.add(tonearmBar)

  // Coffee Cup ☕
  const cupGroup = new THREE.Group()
  cupGroup.position.set(-0.55, 0.7, -0.22)
  roomGroup.add(cupGroup)

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.09, 20), cupMat)
  cup.position.y = 0.045
  cup.castShadow = true
  cupGroup.add(cup)

  const coffeeLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.01, 20), coffeeLiquidMat)
  coffeeLiquid.position.y = 0.085
  cupGroup.add(coffeeLiquid)

  // Plant
  plantGroup = new THREE.Group()
  plantGroup.position.set(-1.05, 0.7, -0.15)
  roomGroup.add(plantGroup)

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.14, 20), plantPotMat)
  pot.position.y = 0.07
  pot.castShadow = true
  plantGroup.add(pot)

  for (let i = 0; i < 5; i++) {
    const leafGeo = new THREE.SphereGeometry(0.07, 8, 8)
    leafGeo.scale(1.2, 0.2, 0.6)
    const leaf = new THREE.Mesh(leafGeo, leafMat)
    leaf.position.set(
      Math.cos((i * Math.PI * 2) / 5) * 0.06,
      0.15 + (i * 0.02),
      Math.sin((i * Math.PI * 2) / 5) * 0.06
    )
    leaf.rotation.set(0.3, (i * Math.PI * 2) / 5, 0.4)
    plantGroup.add(leaf)
  }

  // Wall Shelf with Books
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.04, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x382823, roughness: 0.5 })
  )
  shelf.position.set(1.2, 2.2, -2.7)
  roomGroup.add(shelf)

  const bookColors = [0xdf8d71, 0xc2a4ff, 0x4e8d69, 0xfacc15, 0x60a5fa]
  bookColors.forEach((color, idx) => {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.28, 0.22),
      new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
    )
    book.position.set(0.75 + idx * 0.08, 2.36, -2.68)
    roomGroup.add(book)
  })

  // Floating Ambient Lo-Fi Particles
  const particleCount = 65
  const particleGeo = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 5
    particlePositions[i + 1] = Math.random() * 3.5 + 0.2
    particlePositions[i + 2] = (Math.random() - 0.5) * 4
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  const particleMat = new THREE.PointsMaterial({
    color: 0xc2a4ff,
    size: 0.025,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  })
  const particles = new THREE.Points(particleGeo, particleMat)
  roomGroup.add(particles)
}

const onMouseMove = (event) => {
  if (!container.value) return
  const mouseScreenX = (event.clientX / window.innerWidth) * 2 - 1
  const mouseScreenY = -(event.clientY / window.innerHeight) * 2 + 1

  targetMouseX = mouseScreenX
  targetMouseY = mouseScreenY

  // Show a pointer cursor when hovering the monitor
  if (container.value) {
    container.value.style.cursor = isMonitorHit(event.clientX, event.clientY) ? 'pointer' : ''
  }
}

const onTouchMove = (event) => {
  if (!container.value || event.touches.length === 0) return
  const touch = event.touches[0]
  targetMouseX = (touch.clientX / window.innerWidth) * 2 - 1
  targetMouseY = -(touch.clientY / window.innerHeight) * 2 + 1
}

const animate = (time) => {
  animationFrameId = requestAnimationFrame(animate)

  // Smooth lerp mouse coordinates
  mouseX += (targetMouseX - mouseX) * 0.05
  mouseY += (targetMouseY - mouseY) * 0.05

  const t = time * 0.001

  // First-person seated head movement & look-around
  const isTyping = performance.now() < typingEndTime
  typingCamWeight += ((isTyping ? 1 : 0) - typingCamWeight) * 0.08
  if (camera) {
    camera.rotation.y = -mouseX * 0.55 + Math.sin(t * 0.3) * 0.015
    camera.rotation.x = mouseY * 0.35 - typingCamWeight * 0.14 + (isTyping ? Math.sin(t * 16) * 0.004 : 0)
    camera.position.x = mouseX * 0.12
    camera.position.y = baseCamY + mouseY * 0.08 - typingCamWeight * 0.06 + (isTyping ? Math.sin(t * 16) * 0.002 : 0)
    camera.position.z = baseCamZ - typingCamWeight * 0.1
  }

  if (vinylDisc) {
    vinylDisc.rotation.y += isPlayingLofi.value ? 0.04 : 0.015
  }

  if (deskLampLight) {
    deskLampLight.intensity = lampBase + Math.sin(t * 8) * (lampBase * 0.05) + (Math.random() - 0.5) * (lampBase * 0.02)
  }

  if (plantGroup) {
    plantGroup.rotation.z = Math.sin(t * 1.5) * 0.02
  }

  // Typing animation on the keyboard while typingEndTime is in the future
  if (handsGroup) {
    if (isTyping) {
      handsGroup.visible = true
      handsRetract = 0
      handsGroup.position.z = 0
      handsGroup.position.y = Math.sin(t * 14) * 0.004
    } else if (handsGroup.visible) {
      // Retract the arms: slide toward the camera and down until hidden
      handsRetract += 0.035
      handsGroup.position.z = handsRetract * 0.55
      handsGroup.position.y = -handsRetract * 0.25
      if (handsRetract >= 1) {
        handsGroup.visible = false
        handsGroup.position.z = 0
        handsGroup.position.y = 0
        handsRetract = 0
      }
    }
  }
  handFingers.forEach((f) => {
    if (isTyping) {
      const press = Math.max(0, Math.sin(t * 16 + f.phase))
      f.mesh.position.y = f.restY - press * 0.018
    } else {
      f.mesh.position.y = f.restY
    }
  })

  renderer.render(scene, camera)
}

const handleResize = () => {
  if (!container.value || !renderer || !camera) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  const aspect = width / height
  camera.aspect = aspect
  camera.fov = aspect < 1 ? 75 : aspect < 1.4 ? 65 : 55
  camera.position.z = aspect < 1 ? 1.05 : 0.85
  baseCamZ = aspect < 1 ? 1.05 : 0.85
  baseCamY = aspect < 1 ? 1.15 : 1.05
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  initThree()
  animate(0)
  scheduleNextBlink()
  // Show the intro dialog on the about-me slide right away
  dialogVisible.value = true
  startDialog(dialogTexts[0])
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('resize', handleResize)
  if (renderer && renderer.domElement) {
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
  }
  applySceneTheme()
  themeObserver = new MutationObserver(applySceneTheme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  window.addEventListener('themechange', applySceneTheme)

  gyroSupported.value = 'ontouchstart' in window && 'DeviceOrientationEvent' in window
  // Auto-enable on Android (no permission prompt needed)
  if (gyroSupported.value && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', onDeviceOrientation)
    window.addEventListener('deviceorientationabsolute', onDeviceOrientation)
    gyroEnabled.value = true
  }

  // Auto-play Lo-Fi on the first interaction (unlocks Web Audio from the loader's Enter click)
  const startAudioOnce = () => {
    if (!isPlayingLofi.value) toggleLofiAudio()
    window.removeEventListener('click', startAudioOnce)
    window.removeEventListener('touchend', startAudioOnce)
  }
  window.addEventListener('click', startAudioOnce)
  window.addEventListener('touchend', startAudioOnce)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  clearInterval(dialogInterval)
  if (blinkTimeout) {
    clearTimeout(blinkTimeout)
  }
  if (screenSlideTimer) {
    clearTimeout(screenSlideTimer)
  }
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('deviceorientation', onDeviceOrientation)
  window.removeEventListener('deviceorientationabsolute', onDeviceOrientation)
  if (renderer && renderer.domElement) {
    renderer.domElement.removeEventListener('pointerdown', onPointerDown)
    renderer.domElement.removeEventListener('pointerup', onPointerUp)
  }
  if (themeObserver) themeObserver.disconnect()
  window.removeEventListener('themechange', applySceneTheme)
  if (audioCtx) {
    audioCtx.close()
  }
  clearInterval(lofiInterval)
  if (renderer && renderer.domElement && container.value) {
    container.value.removeChild(renderer.domElement)
    renderer.dispose()
  }
})
</script>

<template>
  <div class="relative w-full h-full min-h-[100dvh] flex items-center justify-center select-none overflow-hidden">
    <!-- Ambient Lofi Neon Glows -->
    <div class="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-violet-600/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Lofi Beats Music Control Widget -->
    <div class="absolute top-24 sm:top-6 right-4 sm:right-10 z-30 transition-all duration-300 transform hover:scale-105">
      <button
        @click="toggleLofiAudio"
        class="flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-2xl bg-[#140d1e]/90 hover:bg-[#1b1128] border border-purple-500/30 text-white shadow-xl shadow-purple-950/50 backdrop-blur-md transition-all group touch-manipulation"
      >
        <div class="relative flex items-center justify-center">
          <Disc3 :class="['w-4 h-4 text-[#c2a4ff] transition-transform duration-700', isPlayingLofi ? 'animate-spin' : '']" />
          <span v-if="isPlayingLofi" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <div class="text-left">
          <div class="text-[10px] font-mono uppercase tracking-wider text-[#c2a4ff] flex items-center gap-1.5">
            <span>LO-FI RADIO</span>
            <span class="w-1.5 h-1.5 rounded-full" :class="isPlayingLofi ? 'bg-emerald-400' : 'bg-slate-500'"></span>
          </div>
          <div class="text-xs font-medium text-slate-200">
            {{ isPlayingLofi ? 'Pause Beats' : 'Play Ambient Lo-Fi' }}
          </div>
        </div>
      </button>
    </div>

    <div
      v-if="gyroEnabled"
      class="absolute top-36 right-4 sm:top-auto sm:right-auto sm:bottom-6 sm:left-56 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#140d1e]/70 text-[10px] text-slate-300 border border-purple-500/20 backdrop-blur-md"
    >
      <span class="w-1.5 h-1.5 rounded-full" :class="gyroActive ? 'bg-emerald-400' : 'bg-slate-500'"></span>
      <span>{{ gyroActive ? 'Gyroscope active' : 'Waiting for motion data...' }}</span>
    </div>

    <!-- Gyroscope Enable Button (iOS requires a tap) -->
    <button
      v-if="gyroSupported && !gyroEnabled"
      @click="enableGyroscope"
      class="absolute top-24 left-4 sm:top-auto sm:left-auto sm:right-auto sm:bottom-6 sm:left-4 z-30 flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#140d1e]/90 text-white border border-purple-500/30 shadow-xl backdrop-blur-md text-xs touch-manipulation"
    >
      <Radio class="w-4 h-4 text-[#c2a4ff]" />
      <span>{{ gyroActive ? 'Motion active' : 'Enable motion view' }}</span>
      <span v-if="gyroActive" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
    </button>

    <!-- 3D Three.js Canvas Container -->
    <div ref="container" class="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 touch-pan-y"></div>

    <!-- Game-style Dialog Box -->
    <div
      v-if="dialogVisible"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl cursor-pointer"
      @click="dismissDialog"
    >
      <div class="bg-[#0e0916]/90 border-2 border-purple-500/40 rounded-xl p-3 sm:p-5 shadow-2xl shadow-purple-950/60 backdrop-blur-md font-mono">
        <div class="flex items-center justify-between mb-1.5 sm:mb-2">
          <div class="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#c2a4ff]">KAIZEN · SYSTEM LOG</div>
          <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
        <p class="text-xs sm:text-base text-slate-200 leading-relaxed sm:min-h-[3.5rem]">
          {{ displayedDialog }}<span class="inline-block w-2 h-3 sm:h-4 bg-[#c2a4ff] align-middle animate-pulse"></span>
        </p>
        <div class="text-right text-[9px] sm:text-[10px] text-slate-500 mt-1.5 sm:mt-2">CLICK TO DISMISS ✕</div>
      </div>
    </div>

    <!-- First-Person POV Eyelid Blinking Overlay -->
    <div class="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <!-- Upper Eyelid -->
      <div 
        class="absolute top-0 left-0 right-0 h-1/2 bg-[#08050e] transition-all duration-[260ms] ease-out origin-top pointer-events-none"
        :class="isBlinking ? 'translate-y-0 opacity-100 shadow-[0_40px_80px_rgba(0,0,0,0.95)]' : '-translate-y-full opacity-0'"
      ></div>
      <!-- Lower Eyelid -->
      <div 
        class="absolute bottom-0 left-0 right-0 h-1/2 bg-[#08050e] transition-all duration-[260ms] ease-out origin-bottom pointer-events-none"
        :class="isBlinking ? 'translate-y-0 opacity-100 shadow-[0_-40px_80px_rgba(0,0,0,0.95)]' : 'translate-y-full opacity-0'"
      ></div>
    </div>
  </div>
</template>