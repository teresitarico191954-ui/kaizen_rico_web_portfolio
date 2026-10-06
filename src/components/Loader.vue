<script setup>
import { ref, onMounted } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const emit = defineEmits(['loaded'])

const mouseX = ref('50%')
const mouseY = ref('50%')
const progress = ref(0)
const isLoaded = ref(false)
const isEntering = ref(false)
const isHidden = ref(false)

const handleMouseMove = (e) => {
  mouseX.value = `${e.clientX}px`
  mouseY.value = `${e.clientY}px`
}

const handleEnter = (mode) => {
  if (!isLoaded.value || isEntering.value) return
  isEntering.value = true
  setTimeout(() => {
    isHidden.value = true
    emit('loaded', mode)
  }, 900)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  
  const timer = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.floor(Math.random() * 8) + 4
      if (progress.value > 100) progress.value = 100
    } else {
      clearInterval(timer)
      setTimeout(() => {
        isLoaded.value = true
      }, 300)
    }
  }, 50)
})
</script>

<template>
  <div 
    v-if="!isHidden"
    :class="[
      'fixed inset-0 z-[999999] flex flex-col items-center justify-between transition-all duration-700 select-none overflow-hidden',
      isEntering ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 bg-[#0b080c]'
    ]"
    :style="{
      '--mouse-x': mouseX,
      '--mouse-y': mouseY
    }"
  >
    <!-- Top Bar -->
    <div class="w-full max-w-6xl px-6 py-8 flex items-center justify-between text-[10px] sm:text-xs tracking-widest text-[#c2a4ff]/70 font-mono uppercase">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#a87cff] animate-ping"></span>
        <span>INITIALIZING ENVIRONMENT</span>
      </div>
      <div>{{ progress }}%</div>
    </div>

    <!-- Center Interaction / Button -->
    <div class="flex flex-col items-center justify-center relative">
      <!-- Glow hover effect -->
      <div 
        class="pointer-events-none absolute w-[300px] h-[300px] rounded-full bg-[#a87cff]/10 blur-[90px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        :style="{ left: mouseX, top: mouseY }"
      ></div>

      <!-- Pill Buttons -->
      <div class="flex flex-col items-center gap-4">
        <!-- 3D World -->
        <div
          @click="handleEnter('3d')"
          :class="[
            'relative px-8 py-4 rounded-full border transition-all duration-500 flex items-center gap-4 group cursor-pointer overflow-hidden backdrop-blur-md touch-manipulation',
            isLoaded
              ? 'border-purple-500/50 bg-[#140e18] hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,124,255,0.4)] hover:scale-105'
              : 'border-purple-500/20 bg-[#0f0a13] cursor-wait'
          ]"
        >
          <div
            v-if="isLoaded"
            class="absolute inset-0 bg-gradient-to-r from-transparent via-[#a87cff]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          ></div>

          <div class="flex items-center gap-3 font-mono text-sm tracking-widest uppercase z-10">
            <span v-if="!isLoaded" class="text-slate-400 flex items-center gap-2">
              <span>LOADING ASSETS</span>
              <span class="inline-block w-1.5 h-4 bg-[#c2a4ff] animate-pulse"></span>
            </span>
            <span v-else class="text-white font-semibold flex items-center gap-2 group-hover:text-[#c2a4ff] transition-colors">
              <span>3D WORLD</span>
              <ArrowRight class="w-4 h-4 text-[#c2a4ff] group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        <!-- Plain Portfolio -->
        <div
          v-if="isLoaded"
          @click="handleEnter('plain')"
          class="relative px-8 py-3.5 rounded-full border transition-all duration-500 flex items-center gap-4 group cursor-pointer overflow-hidden backdrop-blur-md touch-manipulation border-purple-500/30 bg-[#120d15]/80 hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,124,255,0.3)] hover:scale-105"
        >
          <div class="flex items-center gap-3 font-mono text-sm tracking-widest uppercase">
            <span class="text-white font-semibold flex items-center gap-2 group-hover:text-[#c2a4ff] transition-colors">
              <span>PLAIN PORTFOLIO</span>
              <ArrowRight class="w-4 h-4 text-[#c2a4ff] group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>

      <div class="mt-4 text-xs font-mono text-slate-500 tracking-wider">
        {{ isLoaded ? 'CHOOSE HOW TO VIEW' : 'PLEASE WAIT...' }}
      </div>
    </div>

    <!-- Bottom Marquee Ticker -->
    <div class="w-full overflow-hidden py-6 border-t border-purple-500/10 opacity-30 text-xs font-mono tracking-widest text-[#c2a4ff] uppercase whitespace-nowrap">
      <div class="inline-block animate-marquee">
        KAIZEN RICO • FULL STACK DEVELOPER • VUE.JS • SPRING BOOT • MODERN UI/UX • SCALABLE SYSTEMS • KAIZEN RICO • FULL STACK DEVELOPER • VUE.JS • SPRING BOOT • MODERN UI/UX • SCALABLE SYSTEMS •
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 25s linear infinite;
}
</style>
