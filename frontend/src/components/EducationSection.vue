<template>
  <section :class="$style.section">
    <h2 :class="$style.h2">Educations</h2>
    <div :class="$style.timeline">
      <div :class="$style.item">
        <div :class="[$style.dot, $style.blue]" />
        <div class="content">
          <h3 :class="$style.h3">Hosei University</h3>
          <p :class="$style.muted">Bachelor of Arts, BA</p>
          <p :class="$style.subtle">April 2024 - Present</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style module>
.section { margin-bottom: 40px; }
.h2 { font-size: 24px; font-weight: 500; margin-bottom: 16px; }
.timeline { border-left: 2px solid var(--border); padding-left: 24px; margin-left: 8px; }
.item { position: relative; margin-bottom: 18px; }
.dot { position: absolute; left: -35px; top: 6px; width: 12px; height: 12px; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 1px 2px rgba(0,0,0,.06); }
.blue { background: #3b82f6; }
.gray { background: #d1d5db; }
.h3 { font-size: 18px; margin: 0 0 4px; }
.muted { color: var(--muted); margin: 0 0 4px; }
.subtle { color: #9ca3af; margin: 0; font-size: 13px; }
</style>
