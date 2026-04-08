<script setup>
import loadingChat from './loadingChat.vue'
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { UserRound } from 'lucide-vue-next'
import ProfileMessage from '@/components/AboutProf/image/df1de514-29bd-4f30-bd84-990509e46e6b-removebg-preview.png'

const chatBody = ref(null)
const messages = ref([])
const input = ref('')
const isOpen = ref(false)

// Flag to track if quick buttons have been shown
let buttonsShown = false

/* ========================= LOAD ========================= */
onMounted(() => {
  const saved = localStorage.getItem('chatMessages')
  if (saved) {
    messages.value = JSON.parse(saved)
  } else {
    // Default welcome message with quick buttons
    messages.value.push({
      text: "Hey there! 👋 Thanks for dropping by. Feel free to ask me about my projects, skills, or background. I’m here to help and share more about myself!",
      sender: 'bot',
      avatar: ProfileMessage,
      avatarType: 'image',
      buttons: [
        'Tell me about yourself',
        "What's your tech stack?",
        "Are you open to work?"
      ]
    })
  }
  scrollToBottom()
})

/* ========================= SCROLL ========================= */
function scrollToBottom() {
  nextTick(() => {
    const el = chatBody.value
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}

watch(messages, async () => {
  await nextTick()
  scrollToBottom()
}, { deep: true })

watch(isOpen, (val) => {
  if (val) setTimeout(scrollToBottom, 50)
})

/* ========================= STORAGE ========================= */
function saveMessages() {
  localStorage.setItem('chatMessages', JSON.stringify(messages.value))
}

/* ========================= LOGIC ========================= */
function cleanMessage(msg) {
  return msg.toLowerCase().replace(/[^\w\s]/g, '').trim()
}

function hasKeyword(msg, keywords) {
  const words = msg.split(' ')
  return keywords.some(word => words.includes(word))
}

function generateReply(rawMsg) {
  const msg = cleanMessage(rawMsg)

  if (hasKeyword(msg, ['hello', 'hi', 'hey']))
    return "Hi there! 👋 Thanks for visiting. You can ask me about my work, skills, or experience. I’m happy to share and help you learn more about what I do!"

  if (hasKeyword(msg, ['tech stack', 'stack', 'technologies', 'tools', 'frameworks', 'libraries', 'languages', 'programming languages', 'what do you use', 'what technologies do you use', 'what tools do you use', 'what frameworks do you use', 'what libraries do you use', 'what programming languages do you use', 'what languages do you use', 'what is your tech stack', 'what technologies do you specialize in', 'what tools do you specialize in', 'what frameworks do you specialize in', 'what libraries do you specialize in', 'what programming languages do you specialize in', 'what languages do you specialize in']))
    return "I specialize in modern web technologies. My core tech stack includes Vue.js for dynamic front-end, Tailwind CSS for responsive designs, and JavaScript for interactive functionality."

  if (hasKeyword(msg, ['about yourself', 'who are you', 'yourself', 'what is your name', 'tell me about yourself', 'background', 'experience', 'bio', 'biography', 'introduce yourself', 'who are you?', 'what is your background', 'what is your experience', 'what is your bio', 'what is your biography', 'can you introduce yourself', 'can you tell me about yourself']))
    return "I’m Edgar, a dedicated full stack developer with a passion for turning ideas into fully functional web applications. I focus on clean code, optimized performance, and practical solutions."

  if (hasKeyword(msg, ['projects', 'work', 'portfolio', 'examples', 'show me your work', 'what projects have you worked on', 'can you show me your projects', 'can you tell me about your projects', 'what have you worked on', 'what is your portfolio', 'can you show me your portfolio']))
    return "I have worked on various web projects, from interactive websites to practical applications. You can see detailed examples in my portfolio."

  if (hasKeyword(msg, ['contact', 'email', 'reach you', 'how can i contact you', 'how can i reach you', 'what is your email', 'can i contact you', 'can i reach you', 'can i email you']))
    return "You can reach me at ejfron.dev@gmail.com for professional inquiries or collaboration opportunities."

  if (hasKeyword(msg, ['skills', 'abilities', 'expertise', 'what are your skills', 'what skills do you have', 'what are your abilities', 'what is your expertise', 'can you tell me about your skills', 'can you tell me about your abilities', 'can you tell me about your expertise']))
    return "My main skills include Vue.js, JavaScript, and Node.js. I continuously learn frameworks and best practices in modern web development. I’m also proficient in responsive design, API integration, and version control with Git."

  return "I’m sorry, I didn’t catch that. Could you rephrase your question or ask about my skills, projects, or contact info?"
}

/* ========================= SEND ========================= */
function sendMessage() {
  if (!input.value.trim()) return

  const userInput = input.value

  // Remove buttons from previous messages
  messages.value.forEach(msg => {
    msg.buttons = []
  })

  // Add user message
  messages.value.push({
    text: userInput,
    sender: 'user',
    avatar: UserRound,
    avatarType: 'component'
  })

  // Loading bot message
  const loadingMsg = {
    sender: 'bot',
    loading: true,
    avatar: ProfileMessage,
    avatarType: 'image'
  }
  messages.value.push(loadingMsg)
  input.value = ''

  setTimeout(() => {
    const reply = generateReply(userInput)
    const index = messages.value.indexOf(loadingMsg)
    if (index !== -1) {
      messages.value[index] = {
        text: reply,
        sender: 'bot',
        avatar: ProfileMessage,
        avatarType: 'image',
        buttons: !buttonsShown ? [
          'Tell me about yourself',
          "What's your tech stack?",
          "Are you open to work?"
        ] : []
      }
      buttonsShown = true
    }

    saveMessages()
    scrollToBottom()
  }, 1000)
}

/* ========================= QUICK BUTTONS ========================= */
function handleQuickButton(btn) {
  // Remove buttons immediately when clicked
  messages.value.forEach(msg => {
    if (msg.buttons) msg.buttons = []
  })

  input.value = btn
  sendMessage()
}

const latestButtons = computed(() => {
  const latestBot = [...messages.value].reverse().find(msg => msg.sender === 'bot' && msg.buttons?.length)
  return latestBot?.buttons || []
})
</script>

<template>
  <div class="chat-wrapper">
    <!-- Toggle Button -->
    <button class="chat-toggle" v-if="!isOpen" @click="isOpen = true">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="lucide lucide-message-circle-icon"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>
      <div class="notif">1</div>
    </button>

    <!-- Chat Box -->
    <div v-if="isOpen" class="chat-box">
      <!-- Header -->
      <div class="chat-header">
        <div class="profile">
          <img src="./image/df1de514-29bd-4f30-bd84-990509e46e6b-removebg-preview.png" alt="">
        </div>
        <div class="name">Edgar Jugado</div>
        <span class="activeDot"></span>
        <div class="iconClose" @click="isOpen = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="lucide lucide-x-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </div>
      </div>

      <!-- Chat Body -->
      <div class="chat-body" ref="chatBody">
        <div v-for="(msg, i) in messages" :key="i" :class="['message-row', msg.sender]">
          <!-- Avatar -->
          <div class="avatar">
            <component v-if="msg.avatarType === 'component'" :is="msg.avatar" width="28" height="28" color="#fff"/>
            <img v-else :src="msg.avatar"/>
          </div>
          <!-- Message Bubble -->
          <div class="bubble">
            <loadingChat v-if="msg.loading"/>
            <div v-else>{{ msg.text }}</div>
          </div>
        </div>

        <!-- Quick Buttons -->
        <div class="quick-buttons" v-if="latestButtons.length">
          <button v-for="(btn, index) in latestButtons" :key="index" @click="handleQuickButton(btn)">
            {{ btn }}
          </button>
        </div>
      </div>

      <!-- Chat Footer -->
      <div class="chat-footer">
        <div class="input-wrapper">
          <input type="text" placeholder="Type your message..." v-model="input" @keyup.enter="sendMessage"/>
          <button class="send-btn" @click="sendMessage">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" class="lucide lucide-send-icon"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
:root {
  --bg-color: #1c1c1e;
  --bg-color-body: #2c2c2e;
  --messageUser: #f1f5f9;
}

/* Wrapper */
.chat-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}

/* Toggle button */
.chat-toggle {
  background: var(--bg-color-body);
  color: white;
  border: none;
  padding: 14px 18px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
}

.notif {
  position: absolute;
  top: -5px;
  right: 0;
  font-size: 12px;
  background-color: red;
  padding: 2px 9px;
  border-radius: 50%;
}

/* Chat Box */
.chat-box {
  width: 320px;
  height: 420px;
  background: var(--bg-color);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px;
  background: var(--bg-color-body);
  color: #fff;
  position: relative;
}

.profile {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #fff;
}

.profile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name {
  font-size: 14px;
  font-weight: 600;
}

.activeDot {
  width: 8px;
  height: 8px;
  background-color: #4cd137;
  border-radius: 50%;
 
}

.iconClose {
  position: absolute;
  right: 10px;
  cursor: pointer;
}

/* Body */
.chat-body {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 10px 12px;
  border-radius: 12px;
  max-width: 75%;
  word-wrap: break-word;
}

.message.user {
  background: var(--messageUser);
  color: #000;
  align-self: flex-end;
}

.message.bot {
  background: var(--bg-color-body);
  color: #fff;
  align-self: flex-start;
  font-size: 13px;
  position: relative;
}

/* Quick buttons under bot message */
.quick-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
}

.quick-buttons button {
  background: #ffffff;
  border: none;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  color: #000;
  cursor: pointer;
  transition: background 0.2s;
  width: 80%;

}

.quick-buttons button:hover {
  background: var(--bg-color-body);
  color: #fff;
}

/* Footer */
.chat-footer {
  bottom: 20px;
  background: transparent;
}

.input-wrapper {
  display: flex;
  align-items: center;
  width: 95%;
  gap: 8px;
  background: #f1f5f9;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid #b7f8b7;
  margin: 10px 10px;
}

.input-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 8px;
  font-size: 14px;
}

.send-btn {
  background: var(--bg-color-body);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* MESSAGE ROW */
.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

/* ALIGNMENT */
.message-row.user {
  flex-direction: row-reverse;
}

.message-row.bot {
  justify-content: flex-start;
}

/* AVATAR */
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

/* BUBBLE */
.bubble {
  max-width: 70%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 13px;
}

/* BOT STYLE */
.message-row.bot .bubble {
  background: var(--bg-color-body);
  color: #fff;
}

/* USER STYLE */
.message-row.user .bubble {
  background: #e2e2e2;
  color: black;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-color-body); /* optional for icons */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;

   background: #ccc;
  
}
</style>


