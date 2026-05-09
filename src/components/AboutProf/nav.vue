<script>
import { User, List, Eye, Send, Moon, Menu, Download, Sun } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: "NavCom",
  components: {
    User, List, Eye, Send, Moon, Menu, Download, Sun
  },

  setup() {
    const isDark = ref(false)

    const isSmallScreen = ref(window.innerWidth <= 1380)
    const useTeleport = ref(window.innerWidth <= 1380) // ✅ FIXED (true when <= 1380)
    const iconColor = computed(() => (isDark.value ? 'white' : 'black'))
    const isBottomNavOpen = ref(false)
    const activeNav = ref('about')

    const router = useRouter()
    const route = useRoute()

    const toggleBottomNav = () => {
      isBottomNavOpen.value = !isBottomNavOpen.value
    }

    const handleNavClick = (navItem = null) => {
      if (navItem) activeNav.value = navItem

      if (isSmallScreen.value) {
        isBottomNavOpen.value = false
        setTimeout(() => scrollToSection(), 100)
      }
    }

    const setActiveNavFromRoute = () => {
      const routeMap = {
        '/': 'about',
        '/resume': 'resume',
        '/works': 'works',
        '/contact': 'contact'
      }
      activeNav.value = routeMap[route.path] || 'about'
    }

    const scrollToSection = () => {
      const currentPath = router.currentRoute.value.path

      const scrollTargets = {
        '/': '#home',
        '/resume': '#resume',
        '/works': '#works',
        '/contact': '#contact'
      }

      const targetSelector = scrollTargets[currentPath]

      if (targetSelector) {
        setTimeout(() => {
          const el = document.querySelector(targetSelector)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }, 150)
      }
    }

    const updateTheme = () => {
      if (isDark.value) {
        document.documentElement.classList.add('dark-mode')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark-mode')
        localStorage.setItem('theme', 'light')
      }
    }

    const toggleDarkMode = () => {
      isDark.value = !isDark.value
      updateTheme()
    }

    const updateSize = () => {
      const w = window.innerWidth

      isSmallScreen.value = w <= 1380
      useTeleport.value = w <= 1380

      if (!isSmallScreen.value) {
        isBottomNavOpen.value = false
      }
    }

    const handleClickOutside = (event) => {
      const nav = document.querySelector('.bottom-navi')
      const menuButton = document.querySelector('.humber')

      if (
        nav &&
        menuButton &&
        !nav.contains(event.target) &&
        !menuButton.contains(event.target) &&
        isBottomNavOpen.value
      ) {
        isBottomNavOpen.value = false
      }
    }

    const handleLogoClick = () => {
      if (isSmallScreen.value) {
        isBottomNavOpen.value = false
        router.push('/profCard')

        setTimeout(() => {
          const el = document.querySelector('#profCard')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 200)
      }
    }

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme')

      window.addEventListener('resize', updateSize)
      document.addEventListener('click', handleClickOutside)

      setActiveNavFromRoute()

      if (!savedTheme) {
        isDark.value = true
      } else {
        isDark.value = savedTheme === 'dark'
      }
      updateTheme()

      watch(() => route.path, setActiveNavFromRoute)

      router.afterEach((to) => {
        if (isSmallScreen.value) {
          setTimeout(() => {
            if (to.hash) {
              const el = document.querySelector(to.hash)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }
          }, 200)
        }
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateSize)
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isDark,
      toggleDarkMode,
      isSmallScreen,
      isBottomNavOpen,
      toggleBottomNav,
      handleNavClick,
      handleLogoClick,
      activeNav,
      useTeleport, 
      iconColor
    }
  }
}
</script>

<template>
  <div class="navigation">

    <!-- 🔥 TELEPORT WHOLE SIDEBAR -->
    <Teleport to="body" v-if="useTeleport">

      <div class="map-Navi">

        <!-- TOP NAV -->
        <div class="top-navi">

          <div class="logo" v-if="isSmallScreen">
            EjFron
          </div>

          <div class="topRight_navi">
            <div class="humber" @click="toggleBottomNav">
              <Menu :size="20" :color="iconColor" />
            </div>

            <div class="DarkmodeToglle" @click="toggleDarkMode">
              <Sun v-if="isDark" :size="20" :color="iconColor"/>
              <Moon v-else :size="20" :color="iconColor" />
            </div>
          </div>
        </div>

        <!-- BOTTOM NAV -->
        <div class="bottom-navi" :class="{ active: isBottomNavOpen }">

          <router-link to="/" @click="handleNavClick('about')" :class="{ ActiveNav: activeNav==='about' }">
            <div class="user"><User :color="iconColor" :size="20"/><div class="BottomIconName">About</div></div>
          </router-link>

          <router-link to="/resume" @click="handleNavClick('resume')" :class="{ ActiveNav: activeNav==='resume' }">
            <div class="list"><List :color="iconColor" :size="20"  /><div class="BottomIconName">Resume</div></div>
          </router-link>

          <router-link to="/works" @click="handleNavClick('works')" :class="{ ActiveNav: activeNav==='works' }">
            <div class="eye"><Eye :color="iconColor" :size="20" /><div class="BottomIconName">Projects</div></div>
          </router-link>

          <router-link to="/contact" @click="handleNavClick('contact')" :class="{ ActiveNav: activeNav==='contact' }">
            <div class="airplane"><Send :color="iconColor" :size="20"/><div class="BottomIconName">Contact</div></div>
          </router-link>

        </div>

      </div>

    </Teleport>

    <!-- 🔥 FALLBACK (NO TELEPORT) -->
    <div v-else class="map-Navi">

      <div class="top-navi">
        <div class="logo" v-if="isSmallScreen">EjFron</div>

        <div class="topRight_navi">
          <div class="humber" @click="toggleBottomNav">
            <Menu :size="20" :color="iconColor"/>
          </div>

          <div class="DarkmodeToglle" @click="toggleDarkMode">
            <Sun v-if="isDark" :size="20" :color="iconColor"/>
            <Moon v-else :size="20" :color="iconColor"/>
          </div>
        </div>
      </div>

      <div class="bottom-navi" :class="{ active: isBottomNavOpen }">

        <router-link to="/" @click="handleNavClick('about')" class="text" :class="{ ActiveNav: activeNav==='about' }">
          <div class="user"><User class="Icon" :size="20"  :color="iconColor"/><div class="BottomIconName">About</div></div>
        </router-link>

        <router-link to="/resume" @click="handleNavClick('resume')" class="text" :class="{ ActiveNav: activeNav==='resume' }">
          <div class="list"><List class="Icon" :size="20"  :color="iconColor" /><div class="BottomIconName">Resume</div></div>
        </router-link>

        <router-link to="/works" @click="handleNavClick('works')" class="text" :class="{ ActiveNav: activeNav==='works' }">
          <div class="eye"><Eye class="Icon" :size="20"  :color="iconColor" /><div class="BottomIconName">Projects</div></div>
        </router-link>

        <router-link to="/contact" @click="handleNavClick('contact')" class="text" :class="{ ActiveNav: activeNav==='contact' }">
          <div class="airplane"><Send class="Icon" :size="20" :color="iconColor"/><div class="BottomIconName">Contact</div></div>
        </router-link>

      </div>

    </div>

  </div>
</template>



<style scoped>

.ActiveNav {
  background-color: green;
  width: 100%;
  border-radius: 5px;
}

/* =========================
   GLOBAL NAV WRAPPER
========================= */
.navigation {
  height: 100%;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.text{
  text-decoration: none;
  color: var(--text-color);
}

/* =========================
   SIDEBAR CONTAINER
========================= */
.map-Navi {
  width: 5rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 3rem 0rem;
  transition: all 0.3s ease;
}

/* =========================
   TOP NAV
========================= */
.top-navi {
  width: 100%;
  border-radius: 5px;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: var(--bg-color);
}

/* logo */
.logo {
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-color);
}

/* =========================
   NAV ITEMS
========================= */
.user,
.list,
.eye,
.airplane {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem 0;
}

.user,
.list,
.eye {
  border-bottom: 1px solid var(--border-color);
}

/* icon label */
.BottomIconName {
  font-size: 0.80rem;
  color: var(--text-color);
}

/* =========================
   TOP RIGHT ACTIONS
========================= */
.topRight_navi {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* clickable icons */
.humber,
.DarkmodeToglle {
  width: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

/* =========================
   BOTTOM NAV (BASE)
========================= */
.bottom-navi {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
  border-radius: 5px;
  background-color: var(--bg-color);
  transition: all 0.3s ease;
  text-decoration: none;
  color: #fff;
}


/* links */
.bottom-navi a {
  text-decoration: none;
  cursor: pointer;
    width: 100%;
  display: flex;
}

/* =========================
   ACTIVE NAV STATE
========================= */
.ActiveNav {
  background-color: #0d800d;
  width: 100%;
  animation: highlight 0.25s ease-in-out;
}

@keyframes highlight {
  from {
    background-color: transparent;
  }
  to {
    background-color: #0d800d;
  }
}

/* =========================
   SMALL FIXES
========================= */
#no-underline {
  text-decoration: none;
  width: 100%;
}

/* =========================
   DESKTOP / SIDEBAR MODE (<=1380px)
========================= */
@media screen and (max-width: 1380px) {

  .navigation {
    margin-left: 5rem;
  }

  .map-Navi {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 9999;
    margin-left: 11rem;
  }

  .logo {
    display: none;
  }

  .ActiveNav {
    width: 5rem;
  }

  .top-navi,
  .bottom-navi {
    position: relative;
  }
}

@media screen and (max-width: 1320px){
  .map-Navi {
    margin-left: 10rem;
  }
}

@media screen and (max-width: 1285px){
  .map-Navi {
    margin-left: 9rem;
  }
}
/* =========================
   MID BREAKPOINT
========================= */
@media screen and (max-width: 1240px) {
  .map-Navi {
    height: 100%;
    margin-left: 8rem;
  }
}

@media screen and (max-width: 1200px) {
  .map-Navi {

    margin-left: 7rem;
  }
}

@media screen and (max-width: 1170px) {
  .map-Navi {

    margin-left: 6rem;
  }
}

@media screen and (max-width: 1130px) {
  .map-Navi {

    margin-left: 5rem;
  }
}

@media screen and (max-width: 1090px) {
  .map-Navi {

    margin-left: 4rem;
  }
}

@media screen and (max-width: 1070px) {
  .map-Navi {

    margin-left: 3rem;
  }
}

@media screen and (max-width: 1020px) {
  .map-Navi {

    margin-left: 2rem;
  }
}
/* =========================
   MOBILE MODE
========================= */
@media screen and (max-width: 790px) {

  .map-Navi {
    width: 100%;
    height: 0;
    padding: 0;
    margin-left: 0;
    top: 0;
  }

  .top-navi {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 5rem;
    padding: 1rem 2rem;
    border-radius: 0;
  }

  .topRight_navi {
    flex-direction: row;
    gap: 1rem;
    transform: scaleX(-1);
  }

  .logo {
    display: flex;
  }

  /* bottom nav becomes mobile bar */
  .bottom-navi {

    top: 0;
    left: 0;
    width: 100%;
    height: 4rem;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 0;
    border-top: 2px solid #fff;
    z-index: 5;
    margin-top: -10px;
    opacity: 0;
    display: none;
  }

  .bottom-navi.active {
    display: flex;
    opacity: 1;
  }

  .ActiveNav {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .BottomIconName {
    font-size: 0.50rem;
  }

  .user,
  .list,
  .eye {
    border-bottom: none;
    gap: 0.5rem;
  }
}

</style>