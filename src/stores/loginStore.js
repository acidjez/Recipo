import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";

export const useLoginStore = defineStore("shoppingList", () => {
  const loggedIn = ref(false);
  const userID = ref("");
  const userEmail = ref("");

  return { loggedIn, userID, userEmail };
});
