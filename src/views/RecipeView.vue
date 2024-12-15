<script setup>
import {
  BIconHandThumbsUp,
  BIconHandThumbsDownFill,
  BIconPlusCircleFill,
} from "bootstrap-icons-vue";
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
          alt="recipe image"
          class="img-fluid rounded"
          style="margin-left: 10px; margin-bottom: 12px"
        />
        <div class="icon-container">
          <div title="Dislike">
            <BIconHandThumbsDownFill
              style="cursor: pointer; margin-right: 3px"
              @click="addDislike"
            />

            {{ dislike }}
          </div>
          <div title="Like">
            <BIconHandThumbsUp
              style="margin-left: 12px; margin-right: 3px; cursor: pointer"
              @click="addLike"
            />
          </div>
          {{ like }}
        </div>
        <div class="card">
          <div class="card-body">
            <h4 class="card-title" style="margin-bottom: 24px">Method</h4>
            <div
              v-for="(step, index) in recipe.instructions"
              :key="step"
              style="margin-bottom: 24px"
            >
              <p class="card-text" style="white-space: pre-wrap"></p>
              <div style="color: #4b61f3" class="fs-6 fw-bold">
                Step {{ index + 1 }}
              </div>
              {{ step }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 sm-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title" style="margin-bottom: 24px">Ingredients</h4>
            <div
              v-for="ingredient in recipe.ingredients"
              :key="ingredient"
              style="margin-bottom: 12px"
            >
              <div style="display: flex; align-items: center">
                <div title="Add to shopping list">
                  <BIconPlusCircleFill
                    style="margin-right: 12px; color: #4157f3"
                    cursor="pointer"
                    @click="addIngredientToList(ingredient)"
                  />
                </div>
                {{ ingredient }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from "../firebase/init.js";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { useLoginStore } from "@/stores/loginStore.js";
import { onAuthStateChanged, getAuth } from "firebase/auth";
const auth = getAuth();

export default {
  props: ["id"],
  beforeRouteEnter(to, from, next) {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        useLoginStore.userID = user.uid;
        useLoginStore.loggedIn = true;
        useLoginStore.userEmail = user.email;
        next();
      } else {
        useLoginStore.loggedIn = false;
        next();
      }
    });
  },
  data() {
    return {
      like: 0,
      dislike: 0,
      imageURL: "",
      recipe: {},
    };
  },

  created() {
    this.getRecipe();
  },

  methods: {
    getRecipe() {
      getDoc(doc(db, "recipes", this.id))
        .then((recipeDoc) => {
          this.recipe = recipeDoc.data();
          this.like = this.recipe.like;
          this.dislike = this.recipe.dislike;
          this.imageURL = this.recipe.imageURL;
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    },

    async voteOnRecipe(userId, recipeId) {
      const voteRef = doc(db, "votes", `${userId}_${recipeId}`);
      const recipeRef = doc(db, "recipes", recipeId);

      const docSnapshot = await getDoc(voteRef);
      if (docSnapshot.exists()) {
        alert("You have already voted on this recipe.");
      } else {
        try {
          await setDoc(voteRef, {
            voted: true,
          });
          await setDoc(
            recipeRef,
            {
              like: this.recipe.like + 1,
            },
            { merge: true }
          );
          this.like += 1;
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    },

    async downVoteOnRecipe(userId, recipeId) {
      const voteRef = doc(db, "votes", `${userId}_${recipeId}`);
      const recipeRef = doc(db, "recipes", recipeId);

      const docSnapshot = await getDoc(voteRef);
      if (docSnapshot.exists()) {
        alert("You have already voted on this recipe.");
      } else {
        await setDoc(voteRef, {
          voted: true,
        });
        await setDoc(
          recipeRef,
          {
            dislike: this.recipe.dislike + 1,
          },
          { merge: true }
        );
        this.dislike += 1;
      }
    },

    addIngredientToList(ingredient) {
      if (!useLoginStore.loggedIn) {
        alert("You must be logged in to add ingredients to your shopping list");
        return;
      }
      this.pushToList(ingredient);
    },

    async pushToList(item) {
      try {
        await setDoc(
          doc(db, "shoppingList", useLoginStore.userID),
          {
            shoppingList: arrayUnion(item),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    },

    addLike() {
      if (useLoginStore.loggedIn) {
        this.voteOnRecipe(useLoginStore.userID, this.id);
      } else {
        alert("You must be logged in to like a recipe");
      }
    },
    addDislike() {
      if (useLoginStore.loggedIn) {
        this.downVoteOnRecipe(useLoginStore.userID, this.id);
      } else {
        alert("You must be logged in to dislike a recipe");
      }
    },
  },
};
</script>

<style scoped>
.container h3 {
  font-size: 28px;
  color: #4b61f3;
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
  max-height: 40vh;
  width: 100%;
}
</style>
