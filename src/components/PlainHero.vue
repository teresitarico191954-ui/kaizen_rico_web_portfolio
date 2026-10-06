<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { portfolioData } from '../data/portfolio'
</script>

<template>
  <section id="about" class="relative w-full min-h-[100dvh] bg-[#0b080c] pt-24 pb-16 flex items-center overflow-hidden">
    <!-- Ambient glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] bg-purple-600/15 blur-[160px] rounded-full pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Left: Content -->
      <div>
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs text-[#c2a4ff] font-medium mb-6">
          <span class="font-mono">&lt;/&gt;</span>
          <span>FULL STACK DEV</span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          <span class="text-white">Hi, I'm </span>
          <span class="text-[#c084fc]">Kaizen Rico</span>
        </h1>

        <h2 class="mt-3 text-xl sm:text-2xl font-bold text-[#c084fc]">
          {{ portfolioData.title }}
        </h2>

        <p class="mt-6 text-slate-400 leading-relaxed max-w-xl">
          {{ portfolioData.bio }}
        </p>

        <h3 class="mt-10 text-sm font-bold tracking-widest text-slate-200 uppercase">Skills & Technologies</h3>
        <div class="mt-4 flex flex-wrap gap-2.5">
          <span
            v-for="skill in ['JavaScript (ES6+)', 'HTML', 'Vue.js', 'React', 'Node.js', 'Tailwind CSS', 'Express.js', 'PostgreSQL', 'Git', 'VS Code', 'Figma']"
            :key="skill"
            class="text-xs px-3.5 py-1.5 rounded-full border border-purple-500/25 bg-purple-950/30 text-[#ddd6fe] font-medium"
          >
            {{ skill }}
          </span>
        </div>

        <!-- Code window -->
        <div class="mt-10 max-w-xl rounded-xl border border-purple-500/20 bg-[#130d1d]/90 overflow-hidden shadow-2xl shadow-purple-950/40">
          <div class="flex items-center gap-1.5 px-4 py-3 border-b border-purple-500/10">
            <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
          </div>
          <pre class="p-5 text-xs sm:text-sm font-mono leading-6 overflow-x-auto"><code><span class="text-slate-500">const</span> <span class="text-white">kaizen</span> = {
  <span class="text-sky-400">name</span>: <span class="text-green-400">"{{ portfolioData.name }}"</span>,
  <span class="text-sky-400">role</span>: <span class="text-green-400">"{{ portfolioData.title }}"</span>,
  <span class="text-sky-400">passion</span>: [<span class="text-green-400">"coding"</span>, <span class="text-green-400">"cars"</span>, <span class="text-green-400">"hacking"</span>]
};</code></pre>
          <div class="px-5 pb-4 text-[11px] text-slate-500 font-mono">// Building something great...</div>
        </div>
      </div>

      <!-- Right: Emblem -->
      <div class="hidden lg:flex items-center justify-center">
        <img src="/logo_dark.png" alt="Kaizen Rico logo" class="w-72 h-72 object-contain drop-shadow-[0_0_60px_rgba(168,124,255,0.35)]" />
      </div>
    </div>
  </section>
</template>
