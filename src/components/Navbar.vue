<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Sun, Moon, Menu, X } from 'lucide-vue-next'

const props = defineProps({
  mode: { type: String, default: '3d' }
})

const isDark = ref(true)
const isScrolledPastHero = ref(false)
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
  window.dispatchEvent(new Event('themechange'))
}

const handleScroll = () => {
  // Always show the navbar on the plain portfolio; on the 3D world, only after scrolling past the hero
  if (props.mode === 'plain') {
    isScrolledPastHero.value = true
    return
  }
  const threshold = window.innerHeight * 0.65
  isScrolledPastHero.value = window.scrollY > threshold
}

onMounted(() => {
  // Always start in dark mode, regardless of any saved preference
  isDark.value = true
  document.documentElement.classList.add('dark')
  localStorage.setItem('theme', 'dark')

  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(() => props.mode, handleScroll)
</script>

<template>
  <header 
    :class="[
      'fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-4 py-4 backdrop-blur-md bg-[#0b080c]/80 border-b border-purple-500/10 transition-all duration-500 ease-in-out',
      isScrolledPastHero 
        ? 'translate-y-0 opacity-100 pointer-events-auto' 
        : '-translate-y-full opacity-0 pointer-events-none'
    ]"
  >
    <nav class="w-full max-w-5xl flex items-center justify-between">
      <a href="#" class="flex items-center gap-2 font-bold text-lg tracking-tight text-white group">
        <img v-if="isDark" src="/logo_dark.png" alt="Logo" class="w-9 h-9 object-contain group-hover:scale-110 transition-transform" />
        <img v-else src="/logo_light.png" alt="Logo" class="w-9 h-9 object-contain rounded-lg group-hover:scale-110 transition-transform" />
        <span>Kaizen<span class="text-[#c2a4ff]">Rico</span></span>
      </a>

      <div class="flex items-center gap-6">
        <ul class="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-300">
          <li><a href="#about" class="hover:text-[#c2a4ff] transition-colors">About</a></li>
          <li><a href="#projects" class="hover:text-[#c2a4ff] transition-colors">Projects</a></li>
          <li><a href="#skills" class="hover:text-[#c2a4ff] transition-colors">Skills</a></li>
          <li><a href="#experience" class="hover:text-[#c2a4ff] transition-colors">Experience</a></li>
          <li><a href="#contact" class="hover:text-[#c2a4ff] transition-colors">Contact</a></li>
        </ul>

        <button
          @click="toggleDarkMode"
          aria-label="Toggle dark mode"
          class="p-2.5 rounded-full border border-purple-500/20 bg-purple-950/40 text-slate-300 hover:text-[#c2a4ff] hover:border-purple-500/40 transition-all focus:outline-none touch-manipulation"
        >
          <Sun v-if="isDark" class="w-4 h-4" />
          <Moon v-else class="w-4 h-4" />
        </button>

        <button
          @click="toggleMobileMenu"
          aria-label="Toggle navigation menu"
          class="sm:hidden p-2.5 rounded-full border border-purple-500/20 bg-purple-950/40 text-slate-300 hover:text-[#c2a4ff] hover:border-purple-500/40 transition-all focus:outline-none touch-manipulation"
        >
          <X v-if="mobileMenuOpen" class="w-4 h-4" />
          <Menu v-else class="w-4 h-4" />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div
      v-show="mobileMenuOpen"
      class="sm:hidden w-full max-w-5xl mt-4 pb-2"
    >
      <ul class="flex flex-col gap-1 text-sm font-medium text-slate-300 bg-[#120d15]/95 border border-purple-500/20 rounded-2xl p-3 shadow-2xl shadow-purple-950/40">
        <li><a href="#about" @click="closeMobileMenu" class="block px-4 py-3 rounded-xl hover:bg-purple-950/50 hover:text-[#c2a4ff] transition-colors">About</a></li>
        <li><a href="#projects" @click="closeMobileMenu" class="block px-4 py-3 rounded-xl hover:bg-purple-950/50 hover:text-[#c2a4ff] transition-colors">Projects</a></li>
        <li><a href="#skills" @click="closeMobileMenu" class="block px-4 py-3 rounded-xl hover:bg-purple-950/50 hover:text-[#c2a4ff] transition-colors">Skills</a></li>
        <li><a href="#experience" @click="closeMobileMenu" class="block px-4 py-3 rounded-xl hover:bg-purple-950/50 hover:text-[#c2a4ff] transition-colors">Experience</a></li>
        <li><a href="#contact" @click="closeMobileMenu" class="block px-4 py-3 rounded-xl hover:bg-purple-950/50 hover:text-[#c2a4ff] transition-colors">Contact</a></li>
      </ul>
    </div>
  </header>
</template>
