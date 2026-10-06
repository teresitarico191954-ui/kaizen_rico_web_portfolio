<script setup>
import { ref } from 'vue'
import { portfolioData } from '../data/portfolio'
import { ExternalLink, Github, Layers, ChevronDown } from 'lucide-vue-next'

const expandedIndex = ref(null)

const toggleProject = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

const isHoverCapable = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

const onCardEnter = (index) => {
  if (isHoverCapable()) expandedIndex.value = index
}

const onCardLeave = () => {
  if (isHoverCapable()) expandedIndex.value = null
}
</script>

<template>
  <section id="projects" class="py-20 border-t border-purple-500/10 relative">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <span class="text-xs font-semibold tracking-widest text-[#c2a4ff] uppercase">PORTFOLIO SHOWCASE</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
            Featured Projects
          </h2>
        </div>
        <p class="text-slate-400 text-sm max-w-sm">
          Selected works focusing on scalable backend architecture, interactive UI, and high-performance web systems.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <div
          v-for="(project, index) in portfolioData.projects"
          :key="index"
          class="group flex flex-col p-6 rounded-2xl border border-purple-500/20 bg-[#120d15]/80 hover:bg-[#16101a] hover:border-purple-500/50 shadow-lg hover:shadow-purple-900/20 transition-all duration-300 cursor-pointer"
          @click="toggleProject(index)"
          @mouseenter="onCardEnter(index)"
          @mouseleave="onCardLeave"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-[#c2a4ff] group-hover:scale-105 transition-transform shrink-0">
              <Layers class="w-5 h-5" />
            </div>
            <ChevronDown
              class="w-5 h-5 text-slate-500 group-hover:text-[#c2a4ff] transition-transform duration-300"
              :class="{ 'rotate-180': expandedIndex === index }"
            />
          </div>

          <h3 class="text-xl font-bold text-white group-hover:text-[#c2a4ff] transition-colors mt-4 mb-2">
            {{ project.title }}
          </h3>
          <p class="text-slate-400 text-sm leading-relaxed">
            {{ project.description }}
          </p>

          <!-- Expandable Details -->
          <div
            class="grid transition-all duration-300 ease-out"
            :class="expandedIndex === index ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0'"
          >
            <div class="overflow-hidden">
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  v-for="tag in project.tech"
                  :key="tag"
                  class="text-xs px-2.5 py-1 rounded-md bg-purple-950/40 border border-purple-500/20 text-[#c2a4ff] font-medium"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="flex items-center gap-4 text-sm font-medium pt-3 border-t border-purple-500/10" @click.stop>
                <a
                  :href="project.demoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-[#c2a4ff] hover:text-white transition"
                >
                  <span>Live Demo</span>
                  <ExternalLink class="w-3.5 h-3.5" />
                </a>
                <a
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition"
                >
                  <span>Source</span>
                  <Github class="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
