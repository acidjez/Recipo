<script setup>
import {
  BIconHandThumbsUp,
  BIconHandThumbsDownFill,
  BIconPlusCircleFill,
} from "bootstrap-icons-vue";

import { useShoppingListStore } from "../stores/shoppingList.js";
// const shoppingListStore = useShoppingListStore();

// const addIngredientToList = (ingredient) => {
//   shoppingListStore.pushToList(ingredient);
// };
</script>

<template>
  <div class="container">
    <div class="row">
      <h3>{{ recipe.name }}</h3>
    </div>
    <div class="row">
      <div class="col-lg-8 sm-12">
        <img
          :src="imageURL"
          alt="recipe"
          class="img-fluid rounded"
          style="margin-left: 10px; margin-bottom: 12px"
        />
        <div class="icon-container">
          <BIconHandThumbsDownFill
            style="cursor: pointer; margin-right: 3px"
            @click="addDislike"
          />
          {{ dislike }}

          <BIconHandThumbsUp
            style="margin-left: 12px; margin-right: 3px; cursor: pointer"
            @click="addLike"
          />
          {{ like }}
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Method</h5>
            <div
              v-for="(step, index) in recipe.instructions"
              :key="step"
              style="margin-bottom: 6px"
            >
              <p class="card-text">{{ index + 1 }}. {{ step }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 sm-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Ingredients</h5>
            <div v-for="ingredient in recipe.ingredients" :key="ingredient">
              <div style="display: flex; align-items: center">
                <BIconPlusCircleFill
                  style="margin-right: 12px; color: #1f39f1"
                  cursor="pointer"
                  @click="addIngredientToList(ingredient)"
                />
                <div v-if="hover">Add to Shopping List</div>
                {{ ingredient }}fdsfds
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- {{ recipe.name }} -->
</template>

<script>
import db from "../firebase/init.js";
import { doc, collection, addDoc, getDoc, query } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useShoppingListStore } from "../stores/shoppingList.js";

export default {
  props: ["id"],

  data() {
    return {
      like: 0,
      dislike: 0,
      imageURL: "",
      recipe: {},
      hover: true,
    };
  },

  created() {
    this.getRecipe();
    this.getImage();
  },

  methods: {
    async getRecipe() {
      try {
        const recipeDoc = await getDoc(doc(db, "recipes", this.id));
        if (recipeDoc.exists()) {
          this.recipe = recipeDoc.data();
        }
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    },

    async getImage() {
      const storage = getStorage();
      const storageRef = ref(storage, `images/` + this.id);

      getDownloadURL(storageRef)
        .then((url) => {
          this.imageURL = url;
          // console.log("Image URL: ", url);
        })
        .catch((error) => {
          // console.error("Error getting image: ", error);
          const storageRef = ref(storage, `images/default.jpg`);
          getDownloadURL(storageRef).then((url) => {
            this.imageURL = url;
          });
        });
    },

    addIngredientToList(ingredient) {
      useShoppingListStore.pushToList(ingredient);
    },

    addLike() {
      this.like += 1;
    },
    addDislike() {
      this.dislike += 1;
    },
  },
};
</script>

<style scoped>
.container h3 {
  font-size: 28px;
  color: blue;
  font-weight: 400;
  padding: 24px 160px 24px 48px;
}

.card {
  margin-left: 12px;
  margin-bottom: 12px;
  padding-left: 12px;
  padding-right: 12px;

  width: 100%;
}

.container {
  /* margin-right: 24px; */
  padding-right: 32px;
}

.icon-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;

  align-items: center;
}
.img-fluid {
  object-fit: cover;
  height: 57vh;
  min-height: 1400px;
  width: 100%;
}
</style>
