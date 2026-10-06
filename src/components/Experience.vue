<script setup>
import { portfolioData } from '../data/portfolio'
import { Briefcase, Cpu } from 'lucide-vue-next'
</script>

<template>
  <section id="experience" class="py-20 border-t border-purple-500/10 relative">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Skills -->
      <div id="skills" class="space-y-6">
        <div class="flex items-center gap-2.5">
          <span class="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[#c2a4ff]">
            <Cpu class="w-5 h-5" />
          </span>
          <div>
            <span class="text-xs font-semibold tracking-widest text-[#c2a4ff] uppercase">EXPERTISE</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Skills & Technologies
            </h2>
          </div>
        </div>

        <p class="text-slate-400 text-sm leading-relaxed">
          Technologies and tools I utilize daily to build robust, scalable and secure software architectures.
        </p>

        <div class="flex flex-wrap gap-2.5 pt-2">
          <span 
            v-for="skill in portfolioData.skills" 
            :key="skill"
            class="px-4 py-2 rounded-xl border border-purple-500/20 bg-[#120d15]/80 hover:border-purple-500/50 hover:bg-purple-950/30 text-sm font-medium text-slate-200 transition-all cursor-default"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Experience -->
      <div class="space-y-6">
        <div class="flex items-center gap-2.5">
          <span class="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[#c2a4ff]">
            <Briefcase class="w-5 h-5" />
          </span>
          <div>
            <span class="text-xs font-semibold tracking-widest text-[#c2a4ff] uppercase">CAREER PATH</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Work Experience
            </h2>
          </div>
        </div>

        <div class="space-y-6 pt-2">
          <div 
            v-for="(job, index) in portfolioData.experience" 
            :key="index"
            class="relative pl-6 border-l-2 border-purple-500/40 space-y-2 group"
          >
            <span class="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-[#a87cff] ring-4 ring-[#0b080c]"></span>
            <h3 class="text-lg font-bold text-white group-hover:text-[#c2a4ff] transition-colors">
              {{ job.role }}
            </h3>
            <div class="text-xs font-semibold text-[#c2a4ff]/80">
              {{ job.company }} <span class="text-slate-500">•</span> {{ job.period }}
            </div>
            <p class="text-sm text-slate-400 leading-relaxed pt-1">
              {{ job.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
