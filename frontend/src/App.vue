<template>
  <div :class="$style.page">
    <HeroSection />
    <main :class="$style.main">
      <EducationSection />
      <ExperienceSection />
    </main>
  </div>
  
</template>

<script setup>
import HeroSection from './components/HeroSection.vue'
import EducationSection from './components/EducationSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
</script>

<style>
:root {
  --fg: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  --bg: #ffffff;
}
* { box-sizing: border-box; }
html, body, #app { height: 100%; }
body { margin: 0; background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
</style>

<style module>
.page { max-width: 880px; margin: 0 auto; padding: 24px 20px 64px; }
.main { max-width: 720px; margin: 0 auto; }
</style>
