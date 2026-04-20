<template>
  <div class="loadermap">
    <div class="terminal-loader">
      <div class="terminal-header">
        <div class="terminal-controls">
          <div class="control close"></div>
          <div class="control minimize"></div>
          <div class="control maximize"></div>
        </div>
        <div class="terminal-title">PS C:\ejfrondev\portfolio</div>
        <div class="terminal-status">
          <span class="status-led"></span>
          <span>ACTIVE</span>
        </div>
      </div>

      <div class="terminal-content">
        <!-- Completed lines -->
        <div v-for="(line, idx) in displayedLines" :key="idx" class="terminal-line">
          <span class="line-text">{{ line }}</span>
        </div>

        <!-- Line currently being typed (only commands) -->
        <div v-if="!allComplete && currentPartialLine" class="terminal-line active-line">
          <span class="line-text">{{ currentPartialLine }}</span>
          <span class="cursor-blink">█</span>
        </div>

        <!-- Final waiting cursor -->
        <div v-if="allComplete" class="terminal-line">
          <span class="cursor-blink">█</span>
        </div>
      </div>
      <div class="scanline"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'


const commands = [
  {
    text: "$ cd ejfrondev",
    result: null,
    delayAfter: 0
  },
  {
    text: "$ npm install ejfron-portfolio@4.0.0",
    result: "  ✔ Installed successfully (2 packages from contributors)",
    delayAfter: 1100
  },
  {
    text: "$ npm run build",
    result: "  ✔ Build completed in 2.3s",
    delayAfter: 800
  }
]

const TYPING_SPEED = 35
const RESTART_DELAY = 3000

// Reactive state
const displayedLines = ref([])
const currentPartialLine = ref('')
const allComplete = ref(false)
let currentCmdIndex = 0
let currentCharPos = 0
let typingTimer = null
let resultTimer = null
let restartTimer = null

function typeCommand() {
  if (allComplete.value) return
  if (currentCmdIndex >= commands.length) {
    finishSequence()
    return
  }

  const cmd = commands[currentCmdIndex]
  const fullCmd = cmd.text

  if (currentCharPos < fullCmd.length) {
    currentPartialLine.value += fullCmd[currentCharPos]
    currentCharPos++
    typingTimer = setTimeout(typeCommand, TYPING_SPEED)
  } else {
    // Command fully typed → add to displayed lines
    displayedLines.value.push(currentPartialLine.value)
    currentPartialLine.value = ''
    currentCharPos = 0

    if (cmd.result && cmd.delayAfter > 0) {
      resultTimer = setTimeout(() => {
        displayedLines.value.push(cmd.result)
        currentCmdIndex++
        typingTimer = setTimeout(typeCommand, TYPING_SPEED)
      }, cmd.delayAfter)
    } else {
      currentCmdIndex++
      typingTimer = setTimeout(typeCommand, TYPING_SPEED)
    }
  }
}

function finishSequence() {
  // Add the final line instantly (no typing)
  displayedLines.value.push("✨ Portfolio ready! ✨")
  allComplete.value = true
  currentPartialLine.value = ''
  restartTimer = setTimeout(() => {
    resetAndRestart()
  }, RESTART_DELAY)
}

function resetAndRestart() {
  if (typingTimer) clearTimeout(typingTimer)
  if (resultTimer) clearTimeout(resultTimer)
  if (restartTimer) clearTimeout(restartTimer)

  displayedLines.value = []
  currentPartialLine.value = ''
  allComplete.value = false
  currentCmdIndex = 0
  currentCharPos = 0

  typingTimer = setTimeout(typeCommand, 150)
}

onMounted(() => {
  resetAndRestart() // start the loop
})

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer)
  if (resultTimer) clearTimeout(resultTimer)
  if (restartTimer) clearTimeout(restartTimer)
})
</script>

<style scoped>
/* Same polished styles – unchanged from your request */
:root {
  --bg-color-body: #0a0c0f;
  --terminal-bg: #0c0f14;
  --terminal-border: #2a2f3f;
  --terminal-header: #161a22;
  --text-green: #4afc7c;
  --text-dim: #8b9bb0;
}

.loadermap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #0c0f14;
  font-family: 'Courier New', 'Fira Code', 'JetBrains Mono', monospace;
}

.terminal-loader {
  width: 550px;
  height: 350px;
  background: #0a0c0f;
  border: 1px solid var(--terminal-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 35px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(74, 252, 124, 0.1) inset;
}

.terminal-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #343434;
  padding: 10px 16px;
  border-bottom: 1px solid var(--terminal-border);
}

.terminal-controls {
  display: flex;
  gap: 8px;
}

.control {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  cursor: default;
}
.control.close { background-color: #ff5f56; }
.control.minimize { background-color: #ffbd2e; }
.control.maximize { background-color: #27c93f; }

.terminal-title {
  color: #cbd5e6;
  font-size: 0.85rem;
}

.terminal-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: #8b9bb0;
  background: #10131c;
  padding: 4px 8px;
  border-radius: 20px;
}

.status-led {
  width: 8px;
  height: 8px;
  background-color: #4afc7c;
  border-radius: 50%;
  animation: pulseLed 1.5s infinite;
}

@keyframes pulseLed {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.terminal-content {
  padding: 18px 16px;
  background: #0c0f14;
  min-height: 280px;
  max-height: 380px;
  overflow-y: auto;
}

.terminal-line {
  font-size: 0.9rem;
  line-height: 1.55;
  color: #4afc7c;
  margin-bottom: 6px;
  white-space: pre-wrap;
  word-break: break-word;
}

.active-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.cursor-blink {
  display: inline-block;
  color: #4afc7c;
  animation: blinkCursor 1s step-end infinite;
}

@keyframes blinkCursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.scanline {
  position: relative;
  pointer-events: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(74, 252, 124, 0.2), transparent);
  width: 100%;
  opacity: 0.3;
  animation: scanMove 8s linear infinite;
}

@keyframes scanMove {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(380px); }
}

@media (max-width: 550px) {
  .terminal-line { font-size: 0.70rem; }

  
.terminal-loader {
  width: 350px;
}

}
</style>