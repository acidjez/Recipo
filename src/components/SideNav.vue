<script setup>
import { RouterLink } from "vue-router";
import { useLoginStore } from "@/stores/loginStore";
import {
  BIconHouse,
  BIconBook,
  BIconCardChecklist,
  BIconPersonCircle,
} from "bootstrap-icons-vue";

import { ref, onMounted, onUnmounted } from "vue";

const isSmallScreen = ref(window.innerWidth < 1080);

const updateWidth = () => {
  isSmallScreen.value = window.innerWidth < 1080;
};

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>

<template>
  <div class="lContainer">
    <div v-if="!isSmallScreen">
      <h2>Recipo</h2>
    </div>
    <div v-if="isSmallScreen">
      <RouterLink to="/" title="Home"> <BIconHouse /></RouterLink>
    </div>
    <div v-else class="linkcontainer">
      <BIconHouse />
      <RouterLink to="/"> Home</RouterLink>
    </div>
    <div v-if="isSmallScreen">
      <RouterLink to="/myrecipes" title="My Recipies">
        <BIconBook
      /></RouterLink>
    </div>
    <div v-else class="linkcontainer">
      <BIconBook />
      <RouterLink to="/myrecipes">My Recipies</RouterLink>
    </div>
    <div v-if="isSmallScreen">
      <RouterLink to="/shoppinglist" title="Shopping List">
        <BIconCardChecklist
      /></RouterLink>
    </div>
    <div v-else class="linkcontainer">
      <BIconCardChecklist />
      <RouterLink to="/shoppinglist">Shopping List</RouterLink>
    </div>

    <div v-if="loading"></div>
    <div class="linkcontainer loginlink" v-else>
      <div v-if="isSmallScreen">
        <RouterLink to="/login" title="Sign In"
          ><BIconPersonCircle
            :class="{ blueText: useLoginStore.loggedIn }"
            style="font-size: 20px; margin-top: auto"
        /></RouterLink>
      </div>
      <div v-else>
        <RouterLink to="/login" style="display: flex; align-items: center"
          ><BIconPersonCircle
            :class="{ blueText: useLoginStore.loggedIn }"
            style="font-size: 20px; margin-right: 10px"
          />

          <div v-if="!useLoginStore.loggedIn">Login</div>
          <div v-else class="blueText" style="font-size: 14px">
            {{ useLoginStore.userEmail }}
          </div></RouterLink
        >
      </div>
    </div>
  </div>
</template>

<script>
import "@/firebase/init.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
export default {
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        useLoginStore.loggedIn = true;
      } else {
        useLoginStore.loggedIn = false;
      }
      this.loading = false;
    });
  },

  data() {
    return {
      loading: true,
    };
  },
};
</script>

<style scoped>
.lContainer {
  display: flex;
  flex-direction: column;
  gap: 50px;
  background-color: white;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  padding: 24px 90px 24px 48px;
  min-height: 100vh;
}

.lContainer a {
  text-decoration: none;
  color: black;
  font-size: 20px;
  white-space: nowrap;
}

.lContainer h2 {
  font-size: 32px;
  /* color: blue; */
  color: #4b61f3;
  font-weight: 400;
}

.loginlink {
  margin-top: auto;
  position: fixed;
  bottom: 0;
  margin-bottom: 24px;
}

.linkcontainer {
  display: flex;
  gap: 10px;
  align-items: center;
}

.blueText {
  color: rgb(55, 55, 241);
}

@media (max-width: 1080px) {
  .lContainer {
    padding: 24px 24px 24px 24px;
  }
}

@media (max-width: 400px) {
  .lContainer {
    padding: 24px 12px 24px 12px;
  }
}
</style>
