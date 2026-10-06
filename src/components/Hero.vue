<script setup>
import CustomAvatar from './CustomAvatar.vue'
import PlainHero from './PlainHero.vue'
import { ChevronDown, Sparkles } from 'lucide-vue-next'

defineProps({
  mode: { type: String, default: '3d' }
})
</script>

<template>
  <PlainHero v-if="mode !== '3d'" />
  <section v-else id="about" class="relative w-full h-[100dvh] min-h-[100dvh] pt-12 pb-6 md:pt-16 md:pb-8 flex flex-col justify-between overflow-hidden">
    <!-- 3D Lofi Interactive Room Background (Full Hero) -->
    <div v-if="mode === '3d'" class="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <CustomAvatar />
    </div>
       <!-- Plain Portfolio Hero Image -->
   
    <!-- Ambient Radial Glows -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] bg-purple-600/15 blur-[160px] rounded-full pointer-events-none"></div>

    <!-- Hero Overlay UI Layer -->
    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-between pointer-events-none">
      
      <!-- Top / Upper Bar Layout: Quick Hint -->
      <div v-if="mode === '3d'" class="flex justify-start sm:justify-end items-start pt-4">
        <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0e0916]/70 backdrop-blur-md border border-purple-500/20 text-[11px] sm:text-xs text-slate-300 shadow-lg pointer-events-auto max-w-[60%] sm:max-w-none">
          <Sparkles class="w-4 h-4 text-[#c2a4ff] animate-pulse" />
          <span class="hidden sm:inline">Move your mouse to explore · Click the monitor to change screens</span>
          <span class="sm:hidden">Drag to explore · Tap the monitor</span>
        </div>
      </div>

      <!-- Bottom Bar: Centered Scroll hint -->
      <div class="relative flex items-center justify-center pt-8 pb-1">
        <a
          href="#projects"
          class="pointer-events-auto hidden sm:flex absolute right-0 items-center gap-2 text-xs font-mono text-slate-400 hover:text-[#c2a4ff] transition-colors bg-[#0e0916]/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-purple-500/20"
        >
          <span>SCROLL DOWN</span>
          <ChevronDown class="w-4 h-4 animate-bounce" />
        </a>
      </div>

    </div>
  </section>
</template>
