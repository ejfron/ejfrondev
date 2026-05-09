<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      
      <!-- Close Button -->
      <button class="close-btn" @click="$emit('close')">
        ✕
      </button>



<h2 class="title">
  {{ project && project.DesStatushead ? project.DesStatushead : 'In Progress' }}
</h2>

<p class="message">
  This feature Project is currently
  {{ project && project.DesStatus ? project.DesStatus : 'in progress' }}.
  Please check back later!
</p>
      <p class="sub">
        Thank you for your patience.
      </p>

    </div>
  </div>
</template>

<script>

export default {
  name: "modalInprogress",
  emits: ["visit", "close"],
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  }
  //  components: {
  //   ProjectCom
  // }
}
</script>

<style scoped>
/* BACKDROP */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* MODAL BOX */
.modal-box {
  background: var(--card-bg, #fff);
  padding: 4rem 2rem;
  border-radius: 14px;
  width: 90%;
  display: flex;
  flex-direction: column;

  align-items: center;
  max-width: 400px;
  text-align: center;
  height: 40%;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: pop 0.2s ease;
}

/* CLOSE BUTTON */
.close-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  color: #10c010;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
}

/* ICON */
.icon-container {
  margin-bottom: 1rem;
}

.icon {
  width: 50px;
  height: 50px;
  color: #ef4444;
}

/* TEXT */
.title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color-head);
}

.message {
  font-size: 0.85rem;
  color: var(--text-color-pa);
  margin-bottom: 0.5rem;
}

.sub {
  font-size: 0.75rem;
  color: #6b7280;
}

/* ANIMATION */
@keyframes pop {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>