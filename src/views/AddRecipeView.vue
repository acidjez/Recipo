<script setup>
import {
  BIconPlusSquareFill,
  BIconTrash,
  BIconPencil,
  BIconDot,
} from "bootstrap-icons-vue";
</script>

<template>
  <div class="container">
    <div v-if="loading" class="loading-spinner-container">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else>
      <div class="row">
        <div v-if="!editTitle" class="header-container">
          <h3>{{ recipeName }}</h3>
          <BIconPencil
            style="
              color: #224ee3;
              margin-right: 12px;
              min-width: 16px;
              min-height: 16px;
            "
            cursor="pointer"
            @click="editTitle = true"
          />
        </div>
        <div
          v-else
          class="header-container"
          style="margin-top: 24px; margin-bottom: 28px; margin-left: 12px"
        >
          <label for="recipeName" class="visually-hidden">Recipe Name</label>
          <input
            type="text"
            class="form-control"
            id="recipeName"
            v-model="recipeName"
            style="width: 35%; min-width: 80px"
          />
          <button
            @click="saveRecipeName"
            class="btn btn-primary"
            style="margin-left: 12px"
          >
            save
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-8 sm-12">
          <img
            :src="imageURL"
            alt="recipe"
            class="img-fluid rounded"
            style="margin-left: 10px; margin-bottom: 12px"
          />
          <div class="card">
            <div class="card-body">
              <label for="recipeImage">Image</label>
              <input
                type="file"
                class="form-control"
                id="recipeImage"
                @change="fileUpload"
              />
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <label for="recipeInstructions" class="h4 card-title"
                >Method</label
              >
              <div class="icon-container" style="margin-bottom: 12px">
                <textarea
                  v-model="newInstruction"
                  ref="newInstruction"
                  class="form-control autoExpand"
                  id="recipeInstructions"
                  style="
                    width: 100%;
                    overflow: hidden;
                    resize: none;
                    min-height: 1em;
                    line-height: 1;
                    margin-bottom: 24px;
                  "
                  @input="autoExpandEvent($event)"
                ></textarea>
                <BIconPlusSquareFill
                  font-size="36"
                  style="
                    margin-left: 18px;
                    margin-bottom: 24px;
                    color: #224ee3;
                    cursor: pointer;
                  "
                  @click="addInstruction"
                />
              </div>
              <div v-if="recipeInstructions.length !== 0">
                <div
                  v-for="(instruction, index) in recipeInstructions"
                  :key="instruction"
                  style="margin-bottom: 24px"
                >
                  <div class="list-container">
                    <BIconTrash
                      style="color: #e10000; margin-right: 4px; min-width: 16px"
                      cursor="pointer"
                      @click="deleteInstruction(index)"
                    />
                    <BIconPencil
                      style="
                        color: #224ee3;
                        margin-right: 12px;
                        min-width: 16px;
                      "
                      cursor="pointer"
                      @click="editInstruction(index)"
                    />

                    <div
                      v-if="editedInstruction.index == index"
                      class="icon-container"
                    >
                      <label for="editInstructions" class="visually-hidden"
                        >Edit Instruction</label
                      >
                      <textarea
                        v-model="editedInstruction.instruction"
                        :ref="'textarea-' + index"
                        class="form-control autoExpand"
                        id="editInstructions"
                        style="
                          width: 100%;
                          overflow: hidden;
                          resize: none;
                          line-height: 1.3;
                        "
                        @input="autoExpandEvent($event)"
                      ></textarea>
                      <button
                        @click="saveInstruction()"
                        class="btn btn-primary"
                        style="margin-left: 18px"
                      >
                        save
                      </button>
                    </div>
                    <div v-else>
                      <div style="color: #4b61f3" class="fs-6 fw-bold">
                        Step {{ index + 1 }}
                      </div>
                      <p style="white-space: pre-wrap">{{ instruction }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 sm-12">
          <div class="card">
            <div class="card-body">
              <label for="recipeIngredients" class="h4 card-title"
                >Ingredients</label
              >
              <div class="icon-container" style="margin-bottom: 24px">
                <input
                  type="text"
                  class="form-control"
                  id="recipeIngredients"
                  v-model="newIngredient"
                />
                <BIconPlusSquareFill
                  font-size="36"
                  style="margin-left: 18px; color: #224ee3; cursor: pointer"
                  @click="addIngredient"
                />
              </div>
              <div v-if="recipeIngredients.length !== 0">
                <div
                  v-for="(ingredient, index) in recipeIngredients"
                  :key="ingredient"
                  style="margin-bottom: 12px"
                >
                  <div class="list-container">
                    <BIconTrash
                      style="
                        color: #e10000;
                        margin-right: 4px;
                        min-width: 16px;
                        min-height: 16px;
                      "
                      cursor="pointer"
                      @click="deleteIngredient(index)"
                    />
                    <BIconPencil
                      style="
                        color: #224ee3;
                        margin-right: 0px;
                        min-width: 16px;
                        min-height: 16px;
                      "
                      cursor="pointer"
                      @click="editIngredient(index)"
                    />
                    <BIconDot
                      style="min-width: 16px; min-height: 16px; max-width: 16px"
                    />

                    <div
                      v-if="editedIngredient.index == index"
                      class="icon-container"
                    >
                      <label for="editIngredients" class="visually-hidden"
                        >Edit Ingredient</label
                      >
                      <input
                        type="text"
                        v-model="editedIngredient.ingredient"
                        class="form-control"
                        id="editIngredients"
                        style="width: 100%"
                      />
                      <button
                        @click="saveIngredient()"
                        class="btn btn-primary"
                        style="margin-left: 12px"
                      >
                        save
                      </button>
                    </div>
                    <div v-else>{{ ingredient }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <button
            type="submit"
            class="btn btn-primary"
            style="
              margin-top: 16px;
              max-width: 180px;
              margin-left: 24px;
              margin-bottom: 24px;
            "
            @click="addRecipe()"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from "../firebase/init.js";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useLoginStore } from "@/stores/loginStore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { nextTick } from "vue";
const recipesCollection = collection(db, "recipes");
const auth = getAuth();

export default {
  beforeRouteEnter(to, from, next) {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        useLoginStore.userID = user.uid;
        useLoginStore.loggedIn = true;
        useLoginStore.userEmail = user.email;
        next();
      } else {
        next("/login");
      }
    });
  },

  data() {
    return {
      recipeName: "Recipe",
      newIngredient: "",
      newInstruction: "",
      recipeIngredients: [],
      recipeInstructions: [],
      recipeImage: "",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/recipo-630fd.appspot.com/o/images%2Fdefault.jpg?alt=media&token=82632575-0311-455e-929c-048a02a6a739",
      editedIngredient: { index: null, ingredient: null },
      editedInstruction: { index: null, instruction: null },
      editTitle: false,
      loading: false,
    };
  },

  methods: {
    addRecipe() {
      if (
        !(
          this.recipeIngredients.length === 0 ||
          this.recipeInstructions.length === 0 ||
          this.recipeName === "" ||
          this.recipeImage === ""
        )
      ) {
        this.loading = true;
        let recipeRef;
        addDoc(recipesCollection, {
          name: this.recipeName,
          ingredients: this.recipeIngredients,
          instructions: this.recipeInstructions,
          userID: useLoginStore.userID,
          like: 0,
          dislike: 0,
          date: new Date().getTime(),
          readableDate: new Date(),
          imageURL: this.imageURL,
        })
          .then((ref) => {
            recipeRef = ref;
            return this.fileToBucket(ref.id);
          })
          .then(() => {
            return this.getImage(recipeRef.id);
          })
          .then((url) => {
            return updateDoc(doc(db, "recipes", recipeRef.id), {
              imageURL: url,
            });
          })
          .then(() => {
            this.loading = false;
            this.$router.push("/myrecipes");
          })
          .catch((e) => {
            this.loading = false;
            console.error("Error adding document: ", e);
          });
      } else {
        alert("Please fill in all fields");
      }
    },

    getImage(id) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/` + id);
      return getDownloadURL(storageRef)
        .then((url) => {
          return url;
        })
        .catch((error) => {
          console.error("Error getting image: ", error);
          return "https://firebasestorage.googleapis.com/v0/b/recipo-630fd.appspot.com/o/images%2Fdefault.jpg?alt=media&token=82632575-0311-455e-929c-048a02a6a739";
        });
    },

    autoExpand(textarea) {
      textarea.style.height = "inherit";
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    },

    autoExpandEvent(event) {
      const scrollY = window.scrollY;
      event.target.style.height = "inherit";
      event.target.style.height = `${event.target.scrollHeight + 2}px`;
      window.scrollTo({
        top: scrollY,
        behavior: "instant",
      });
    },

    addIngredient() {
      if (this.newIngredient !== "") {
        this.recipeIngredients.push(this.newIngredient);
        this.newIngredient = "";
      }
    },

    editIngredient(index) {
      this.editedIngredient.ingredient = this.recipeIngredients[index];
      this.editedIngredient.index = index;
    },

    deleteIngredient(index) {
      this.recipeIngredients.splice(index, 1);
    },

    saveIngredient() {
      if (this.editedIngredient.ingredient !== "") {
        this.recipeIngredients[this.editedIngredient.index] =
          this.editedIngredient.ingredient;
        this.editedIngredient.index = null;
        this.editedIngredient.ingredient = null;
      }
    },

    addInstruction() {
      if (this.newInstruction !== "") {
        this.recipeInstructions.push(this.newInstruction);
        this.newInstruction = "";
        nextTick(() => {
          this.autoExpand(this.$refs[`newInstruction`]);
        });
      }
    },

    editInstruction(index) {
      this.editedInstruction.instruction = this.recipeInstructions[index];
      this.editedInstruction.index = index;
      const scrollY = window.scrollY;
      nextTick(() => {
        this.autoExpand(this.$refs[`textarea-${index}`][0]);
        window.scrollTo({
          top: scrollY,
          behavior: "instant",
        });
      });
    },

    deleteInstruction(index) {
      this.recipeInstructions.splice(index, 1);
    },

    saveInstruction() {
      if (this.editedInstruction.instruction !== "") {
        this.recipeInstructions[this.editedInstruction.index] =
          this.editedInstruction.instruction;
        this.editedInstruction.index = null;
        this.editedInstruction.instruction = null;
      }
    },

    saveRecipeName() {
      this.editTitle = false;
    },

    fileUpload() {
      this.recipeImage = event.target.files[0];
      this.imageURL = URL.createObjectURL(this.recipeImage);
    },

    fileToBucket(id) {
      if (this.recipeImage != "") {
        const storage = getStorage();
        const imagesRef = ref(storage, "images/" + id);
        return uploadBytes(imagesRef, this.recipeImage).catch((error) => {
          console.error("Error uploading file: ", error);
        });
      } else {
        return Promise.resolve();
      }
    },
  },
};
</script>

<style scoped>
.container h3 {
  font-size: 28px;
  color: #224ee3;
  font-weight: 400;
  padding: 24px 160px 24px 48px;
}

.card {
  margin-left: 12px;
  margin-bottom: 12px;
  padding-left: 12px;
  padding-right: 6px;
  width: 100%;
}

.container {
  padding-right: 32px;
}

.icon-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
}

.list-container {
  display: flex;
  min-height: 38px;
  align-items: center;
}

.header-container {
  display: flex;
  align-items: center;
}

.header-container h3 {
  padding-right: 24px;
  padding-left: 36px;
}

.img-fluid {
  object-fit: cover;
  max-height: 40vh;
  width: 100%;
}

.autoExpand {
  transition: height 0.2s;
  padding-top: 8px;
}

.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #224ee3;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
