<script>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import modalInprogress from './AboutProf/modalInprogress.vue';
export default {
  name: "Works",
  data() {
    return {
      activeTab: "All",
       showInProgressModal: false,
       selectedProject: null,
      projects: [
        {
          title: "Resume Builder",
          desc: "ATS-friendly resume builder with customizable templates.",
          category: "Personal",
          status: "completed",
          tech: ["Nuxt.js", "Tailwind", "TypeScript"],
          link: "https://resume-builder-v1-0-1-three.vercel.app/"
        },
        // {
        //   title: "Capstone Generator",
        //   desc: "Generate IT/CS capstone ideas using AI.",
        //   category: "Academic",
        //   status: "completed",
        //   tech: ["Nuxt.js", "OpenAI", "Tailwind"],
        //   link: "#"
        // },
        {
          title: "Food App Scanner",
          desc: "Scan food items and get nutritional information.",
          category: "Freelance",
          status: "completed",
          tech: ["Vue.js", "Regex", "Tailwind", "Capacitor"],
          link: "#",
           DesStatushead: "Private App project",
           DesStatus: "not available to view"
        },
        {
          title: "CraftLearn",
          desc: "Custom e-learning platform for craft skills.",
          category: "Freelance",
          status: "completed",
          tech: ["Vue.js", "Vue Router", "Tailwind"],
          link: "https://demosite-craftlearn-urs.vercel.app/"
        },
        {
          title: "TicTacToe Explosion",
          desc: "Multiplayer chain-reaction tic-tac-toe.",
          category: "Academic",
          status: "completed",
          tech: ["Vanilla JS", "Express", "Tailwind"],
          link: "https://tictactoe-explosions.vercel.app/",
          

        },
         {
          title: "Ticketing Management System",
          desc: "Manage and track support tickets efficiently.",
          category: "Academic",
          status: "completed",
          tech: ["Nuxt.js", "Express", "Tailwind", "postgreSQL"],
          link: "#",
           DesStatushead: "Not available",
           DesStatus: "not available to view"
        },
        {
          title: "Water Management System",
          desc: "Manage and track water usage and quality.",
          category: "Freelance",
          status: "completed",
          tech: ["Nuxt.js", "Tailwind", "postgreSQL", "Supabase"],
          link: "https://hydrix-solution.vercel.app/",
  
        }
      ]
    };
  },
  components: {
    modalInprogress
  },

  methods: {
handleStatusClick(project) {
  const invalidLink = !project.link || project.link === "#";

  if (project.status === "in-progress" || invalidLink) {
    this.selectedProject = project; // ✅ STORE PROJECT
    this.showInProgressModal = true;
    return;
  }

  window.open(project.link, "_blank");
}
  },
  computed: {
    filteredProjects() {
      if (this.activeTab === "All") return this.projects;
      return this.projects.filter(p => p.category === this.activeTab);
    }
  }
};
</script>

<template>
  <div class="works">

    <!-- ✅ CONTAINER (THIS FIXES WIDTH) -->
    <div class="works-container">

      <!-- HEADER -->
      <div class="header">
        <h1><span>A</span>ll Projects</h1>

        <div class="tabs">
          <button 
            v-for="tab in ['All','Academic','Freelance','Personal']"
            :key="tab"
            :class="{active: activeTab === tab}"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- GRID -->
      <div class="grid">
        <div 
          v-for="(project, index) in filteredProjects" 
          :key="index"
          class="card"
        >
          <!-- LEFT -->
          <div class="card-left">
            <h3>{{ project.title }}</h3>
            <p>{{ project.desc }}</p>

            <div class="tech">
              <span v-for="(t,i) in project.tech" :key="i">{{ t }}</span>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="card-right">
            <span 
              class="status"
              :class="project.status"
             
            >
              {{ project.status }}
            </span>
            <div   >
              <a
                  :class="{ disabled: project.status === 'in-progress' || !project.link || project.link === '#' }"
               @click.prevent="handleStatusClick(project)"
                  href="#"
                  class="visit"
                >
                  Visit →
                </a>
            </div>
            
          </div>
        </div>
      </div>
      <teleport to="body" >

        <modalInprogress  :project="selectedProject"   v-if="showInProgressModal" 
  @close="showInProgressModal = false"/>
      </teleport>

    </div>
  </div>
</template>

<style scoped>

/* 🔥 OUTER (full background) */
.works {
  width: 100%;
  background: var(--bg-color);
  overflow: hidden;
  min-height: 100vh;
  margin: auto;
}

/* ✅ THIS MATCHES YOUR RESUME WIDTH */
.works-container {
  padding: 1.5rem;
  color: #e5e7eb;
  width: 100vw;
}

/* HEADER */
.header h1 {
 font-size: 1rem;
    font-weight: 700;
    color: var(--text-color-head);
    padding-bottom: 1.4rem;
}

.header h1 span {
  color: #22c55e;
  font-weight: 700;
}

/* TABS */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
}

.tabs button {
  background: transparent;
  border: 1px solid #1f2937;
  color: var(--text-color-pa);
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: 0.2s;
}

.tabs button.active {
  border-color: #22c55e;
  color: #22c55e;
}

/* GRID */
.grid {
  display: grid;
  gap: 1rem;
  width: 100%;
}

/* CARD */
.card {
  display: flex;
  justify-content: space-between;
  background: var(--card-bg);

  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  max-width: 600px;
  transition: 0.25s;
}

.card:hover {
  transform: translateY(-3px);
  border-color: #22c55e;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.2);
}

/* LEFT */
.card-left h3 {
  font-size: 0.85rem;
  margin-bottom: 0.2rem;
  color: var(--text-color-pa);
  font-weight: 500;
}

.card-left p {
  font-size: 0.7rem;
  color: var(--text-color-pa);
  margin-bottom: 0.6rem;
}

/* TECH */
.tech {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tech span {
  background: var(--Languegae) ;
  padding: 3px 6px;
  font-size: 0.65rem;
  border-radius: 5px;
  color: var(--colortech);
}

/* RIGHT */
.card-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

/* STATUS */
.status {
  font-size: 0.65rem;
  padding: 3px 8px;
  border-radius: 20px;
  text-transform: capitalize;
}

.status.completed {
  background: #22c55e33;
  color: #22c55e;
}

.status.in-progress {
  background: rgba(239,68,68,0.2);
  color: #ef4444;
}

/* BUTTON */
.visit {
  font-size: 0.7rem;
  color: #22c55e;
  text-decoration: none;
}



@media screen and (max-width: 1300px) {
  .works-container{
    width: 100%;
  }

  .card {

  width: 100%;
 max-width: 100%;
}
}

/* RESPONSIVE */
@media (max-width: 700px) {
  .card {
    flex-direction: column;
    gap: 1rem;
  }

  .card-right {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
}

</style>
