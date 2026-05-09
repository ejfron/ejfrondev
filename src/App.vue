<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'

import Profile from '@/components/AboutProf/Prof.vue'
import NavCom from '@/components/AboutProf/nav.vue'
import Resize from '@/components/MainContentResize.vue'
import NotFound from '@/components/404.vue'
import LoadingPage from '@/components/AboutProf/loading.vue'
import Chatbox from './components/AboutProf/Chatbox.vue'

const router = useRouter()

/* =========================
   STATE
========================= */
const isSmallScreen = ref(window.innerWidth <= 1380)
const isLoading = ref(false)

const routerContainer = ref(null)
const mobileRouterContainer = ref(null)

/* =========================
   FIRST VISIT LOADING ONLY
========================= */
onMounted(() => {
  const hasVisited = sessionStorage.getItem('hasVisited')

  if (!hasVisited) {
    isLoading.value = true

    setTimeout(() => {
      isLoading.value = false
      sessionStorage.setItem('hasVisited', 'true')
    }, 7500)
  }else{
    isLoading.value = false
  }
})

/* =========================
   404 CHECK
========================= */
const isNotFound = computed(() => {
  return router.currentRoute.value.name === 'NotFound'
})

/* =========================
   RESIZE HANDLER
========================= */
const updateSize = () => {
  isSmallScreen.value = window.innerWidth <= 1380
}

/* =========================
   SCROLL RESET (DESKTOP)
========================= */
const scrollIfDesktop = () => {
  if (!isSmallScreen.value) {
    if (routerContainer.value) {
      routerContainer.value.scrollTop = 0
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

/* =========================
   WATCH ROUTE CHANGE
========================= */
watch(
  () => router.currentRoute.value.path,
  () => {
    nextTick(() => {
      scrollIfDesktop()
    })
  }
)

/* =========================
   WATCH 404 CHANGE
========================= */
watch(
  () => router.currentRoute.value.name,
  (name) => {
    if (name === 'NotFound') {
      isLoading.value = false
    }
  }
)

/* =========================
   LIFECYCLE
========================= */
onMounted(() => {
  window.addEventListener('resize', updateSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSize)
})
</script>

<template>
  <div id="app">
    <div class="chatmap" v-if="!isLoading" >
       <Chatbox />
    </div>
      

     <div v-if="isLoading" class="loading">
      <LoadingPage />
    </div>
    <div v-else class="contentloading">

      <div class="Catched" v-if="!isNotFound">
      <!-- Desktop layout -->
    <div class="Desktop" v-if="!isSmallScreen && !loading">
  
      <div class="groupPage">
        
          <NavCom />
       
        
        <Profile />
      </div>
      <router-view v-slot="{ Component }">
        <transition class="contentloading" >
          <div  class="Router" ref="routerContainer">
          <component class="contentloading" :is="Component" />
        </div>
        </transition>
        
      </router-view>
    </div>

    <!-- Mobile layout -->
    <div v-else class="ResizeGroup">
     
      <div class="groupPage">
        <NavCom />
        <Profile />
      </div>
      <div class="routerGroup" ref="mobileRouterContainer">
        <Resize class="Content" />
      </div>
    </div>
</div>
<div class="Catched404" v-else>
  <NotFound />
</div>

    </div>





  </div>


</template>




<style>



  *{
    font-family: "Poppins", sans-serif;
  }

 .visitor {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 30px;
  margin: 20px;
  border: 2px solid #ffff;
  z-index: 10;
  right: 1rem;
  bottom: 1rem;
  
  background: var(--bg-color-body);
  color: #fff;
  
  border-radius: 12px;

  
  font-family: 'Segoe UI', sans-serif;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.visitor h2 {
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

/* Hover effect */
.visitor:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
}

  .groupPage{
    display: flex;
     flex-direction: row;
  }

  .ResizeGroup{
    display: flex;
    flex-direction: column;
  }

  .Router{
       background-color: var(--bg-color);
       /* From https://css.glass */

box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(5px);
-webkit-backdrop-filter: blur(0px);
border: 1px solid rgba(255, 255, 255, 0.3);
    width: 100%;
    max-width: 650px;
    max-height: 520px;
    overflow-x: hidden;
    overflow-y: auto; 
    color: black;
    position: relative;
    
  }



  @media screen  and (max-width:1380px){

      #home,
  #resume,
  #works,
  #contact,
  #profCard{
    scroll-margin-top: 5rem; /* Adjust for mobile if needed */
  }
    /* .Router{
      width: 100%;
    } */

    .Desktop{
  display: flex ;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

    .groupPage{
      margin-bottom: 1rem;
      margin-left: -5.6rem;
    }
    .ResizeGroup{
      flex-direction: column;
    }


  }

    @media screen  and (max-width:1340px){
         .groupPage{
      margin-left: 0rem;
    }

   
    }

   @media screen and (max-width:780px){
    
        .routerGroup{
    width: 100%;
    margin-left: -1rem;
   }
  }

   @media screen  and (max-width:680px){
    .groupPage{
     flex-direction: column;
    }


  }

    @media screen  and (max-width:610px){
      .Content{
        width: 100%;
      }

        .routerGroup{
    width: 100%;
    margin-left: -3rem;
  }

  
  }



  

  



/* 1. Define Variables */

:root {
  --bg-color: #f0f0f0;      /* Light Grey background */
  --bg-color-body: linear-gradient(to bottom right,#50a3a2 0%,#78cc6d 100%);;      /* Light Grey background */
  --card-bg: #ffffffda;       /* White nav blocks */
  --text-color: #000000;
  --text-color-pa: #121312;
  --text-color-par: #34495e;
  --text-color-head: #111111cd;
  --text-color-head1: #111111ed;
  --icon-color1: #000000e8;
  --icon-color2: #000000e8;
  --border-color: #0000005a;
  --hover-prof: #0000005a;
  --line-span: #0000004c;
  --messageUser: #ffff;
  --Languegae: #22c55e33;
  --bubbles: #ffffff5f;
  --colortech: #22c55e;
         --profile: linear-gradient(to bottom,#ffffff 0%,#78cc6d 100%);
}

/* 2. Define Dark Mode Overrides */
.dark-mode {
   --messageUser: #ffff;
  --bg-color: #0b111e;  
   --bg-color-body: linear-gradient(145deg, #020617, #080d18);      /* Dark background */
  --card-bg: linear-gradient(145deg, #0f172a, #020617);   
  --text-color: #ffffff;
  --colortech: #22c55e;
    --Languegae: #111827;
  --text-color-pa: #ffffffc6;
  --text-color-par: #ffffffad;
  --text-color-head: #ffff;
  --text-color-head1: #eeeeeeed;
  --icon-color1: #ffffff;
  --icon-color2: #10c010;
   --border-color: #f4f4f4e8;
    --line-span: #10c010;
      --bubbles: #51fc9025;
         --profile: linear-gradient(to bottom,#01010125 0%,#ffff 100%);
}




.Desktop{
  display: flex ;
  align-items: center;
  justify-content: center;
}


body{
background: var(--bg-color-body);
}


.main-content {
    z-index: -1;
    transition: z-index 0.01s linear 0.5s;
    position: relative;
}

.resume-z-index-change {
    z-index: 0;
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* 1. Transition durations */

.contentloading > * {
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
}

.contentloading > *:nth-child(1) { animation-delay: 0.15s; }
.contentloading > *:nth-child(2) { animation-delay: 0.25s; }
.contentloading > *:nth-child(3) { animation-delay: 0.35s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
