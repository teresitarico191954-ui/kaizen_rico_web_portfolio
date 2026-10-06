<script setup>
import { ref, onMounted } from 'vue'
import { portfolioData } from './data/portfolio'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Projects from './components/Projects.vue'
import Experience from './components/Experience.vue'
import Contact from './components/Contact.vue'
import Loader from './components/Loader.vue'

const hasLoaded = ref(false)
const viewMode = ref('3d')

const onLoaded = (mode) => {
  viewMode.value = mode || '3d'
  hasLoaded.value = true
}

onMounted(() => {
  // Always start at the top of the page (hero section)
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
})
</script>

<template>
  <div>
    <!-- Interactive Landing / Loader Screen -->
    <Loader @loaded="onLoaded" />

    <div 
      :class="[
        'min-h-screen flex flex-col justify-between bg-[#0b080c] text-[#eae5ec] selection:bg-[#a87cff]/30 selection:text-white transition-opacity duration-1000',
        hasLoaded ? 'opacity-100' : 'opacity-0'
      ]"
    >
      <Navbar :mode="viewMode" />
      <main class="flex-grow">
        <Hero :mode="viewMode" />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <footer class="py-8 border-t border-purple-500/10 text-center text-xs text-slate-500 bg-[#0b080c]">
        <div class="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {{ new Date().getFullYear() }} <span class="text-slate-300 font-medium">{{ portfolioData.name }}</span>. All rights reserved.
          </div>
          <div class="text-slate-500 text-[11px]">
            Designed with a modern dark theme & Vue 3
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
