<script setup>
import {
  BIconTrash,
  BIconPencil,
  BIconHandThumbsUp,
} from "bootstrap-icons-vue";
</script>

<template>
  <div class="card" style="height: 90%">
    <div class="card-body">
      <router-link :to="'/recipe/' + recipeProp.id">
        <img
          :src="recipeProp.imageURL"
          alt="recipe image"
          class="img-fluid rounded"
          style="margin-bottom: 12px"
        />
      </router-link>
      <div class="icon-container">
        <router-link :to="'/recipe/' + recipeProp.id">
          <h6 class="card-title">{{ recipeProp.name }}</h6>
        </router-link>
        <div>
          <BIconTrash
            style="color: #e10000; cursor: pointer"
            @click="deleteRecipe"
          />
          <router-link :to="'/modifyrecipe/' + recipeProp.id">
            <BIconPencil style="margin-left: 9px; color: #224ee3" />
          </router-link>
          <BIconHandThumbsUp style="margin-left: 9px; color: #14161b" />
          {{ recipeProp.like }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getStorage,
  ref,
  // getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";

import db from "../firebase/init.js";

export default {
  props: ["recipeProp"],

  methods: {
    deleteRecipe() {
      if (!confirm("Are you sure you want to delete this recipe?")) return;

      const storage = getStorage();
      const storageRef = ref(storage, `images/` + this.recipeProp.id);

      deleteObject(storageRef)
        .then(() => {
          const docRef = doc(db, "recipes", this.recipeProp.id);
          return deleteDoc(docRef).catch((error) => {
            console.error("Error deleting document: ", error);
          });
        })
        .catch((error) => {
          console.error("Error deleting image: ", error);
        });
    },
  },
};
</script>

<style scoped>
.icon-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0px;
  flex-wrap: nowrap;
}

.icon-container a {
  padding-top: 12px;
  color: #171717;
  font-weight: 400;
  flex: 1;
}

.card {
  margin-bottom: 24px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.img-fluid {
  object-fit: cover;
  width: 100%;
  height: 24vh;
}

.card-body a {
  text-decoration: none;
}
</style>
