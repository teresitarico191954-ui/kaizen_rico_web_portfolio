<script setup>
import { ref } from 'vue'
import { portfolioData } from '../data/portfolio'
import { Mail, CheckCircle, Send, MessageSquare, Facebook, Instagram, Github } from 'lucide-vue-next'

const formSubmitted = ref(false)
const formData = ref({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = () => {
  if (!formData.value.name || !formData.value.email || !formData.value.message) return
  formSubmitted.value = true
}
</script>

<template>
  <section id="contact" class="py-20 border-t border-purple-500/10 relative">
    <div class="max-w-xl mx-auto px-4 sm:px-6 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs text-[#c2a4ff] font-medium mb-3">
        <MessageSquare class="w-3.5 h-3.5" />
        <span>LET'S CONNECT</span>
      </div>

      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
        Get In Touch
      </h2>
      <p class="text-slate-400 mb-8 text-sm sm:text-base leading-relaxed">
        Have a project in mind or interested in collaboration? Leave a message or write to 
        <a :href="`mailto:${portfolioData.email}`" class="text-[#c2a4ff] hover:underline font-medium">
          {{ portfolioData.email }}
        </a>.
      </p>

      <div v-if="formSubmitted" class="p-6 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-[#c2a4ff] flex items-center justify-center gap-3">
        <CheckCircle class="w-5 h-5 text-emerald-400" />
        <span class="font-medium text-slate-200">Thanks for reaching out! I'll get back to you promptly.</span>
      </div>

      <!-- Social Buttons -->
      <div class="grid grid-cols-3 gap-3 mb-8">
        <a :href="portfolioData.socials.facebook" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-purple-500/20 bg-[#120d15]/80 hover:border-purple-500/50 hover:bg-purple-950/30 transition-all">
          <Facebook class="w-5 h-5 text-[#c2a4ff]" />
          <span class="text-xs font-medium text-slate-300">Facebook</span>
        </a>
        <a :href="portfolioData.socials.instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-purple-500/20 bg-[#120d15]/80 hover:border-purple-500/50 hover:bg-purple-950/30 transition-all">
          <Instagram class="w-5 h-5 text-[#c2a4ff]" />
          <span class="text-xs font-medium text-slate-300">Instagram</span>
        </a>
        <a :href="portfolioData.socials.github" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-purple-500/20 bg-[#120d15]/80 hover:border-purple-500/50 hover:bg-purple-950/30 transition-all">
          <Github class="w-5 h-5 text-[#c2a4ff]" />
          <span class="text-xs font-medium text-slate-300">GitHub</span>
        </a>
      </div>

      <form @submit.prevent="handleSubmit" v-if="!formSubmitted" class="space-y-4 text-left p-6 sm:p-8 rounded-2xl border border-purple-500/20 bg-[#120d15]/80 backdrop-blur-sm shadow-xl">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Name</label>
          <input 
            v-model="formData.name" 
            type="text" 
            placeholder="Your name"
            required 
            class="w-full px-4 py-3 rounded-xl border border-purple-500/20 bg-[#0b080c] text-slate-100 placeholder-slate-600 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 focus:outline-none transition text-base sm:text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Email</label>
          <input 
            v-model="formData.email" 
            type="email" 
            placeholder="you@example.com"
            required 
            class="w-full px-4 py-3 rounded-xl border border-purple-500/20 bg-[#0b080c] text-slate-100 placeholder-slate-600 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 focus:outline-none transition text-base sm:text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Message</label>
          <textarea 
            v-model="formData.message" 
            rows="4" 
            placeholder="Tell me about your project or idea..."
            required 
            class="w-full px-4 py-3 rounded-xl border border-purple-500/20 bg-[#0b080c] text-slate-100 placeholder-slate-600 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 focus:outline-none transition text-base sm:text-sm resize-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
        >
          <span>Send Message</span>
          <Send class="w-4 h-4" />
        </button>
      </form>
    </div>
  </section>
</template>
