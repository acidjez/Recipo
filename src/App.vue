<script setup>
import { RouterView } from "vue-router";
import SideNav from "./components/SideNav.vue";
</script>

<template>
  <div class="containerR">
    <SideNav />
    <RouterView />
  </div>
</template>

<style scoped>
.containerR {
  display: flex;
}
</style>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

body {
  background-color: #faf9fb;
}
</style>
