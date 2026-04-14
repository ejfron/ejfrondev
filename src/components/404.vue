<script setup>
import Chatbox from './AboutProf/Chatbox.vue';
</script>

<template>
  <div class="notfound">
    <div class="content">
      <h1>404</h1>
      <div class="divider"></div>
      <p>This page could not be found.</p>
    </div>
    <Chatbox />
  </div>

</template>

<style scoped>
.notfound {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
 
}

/* Layout */
.content {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 404 text */
h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

/* Vertical line */
.divider {
  width: 1px;
  height: 40px;
  background: #fff;
}

/* Message */
p {
  font-size: 14px;
  color: #fff;
  margin: 0;
}
</style>