<script setup>
import MyRecipeCardComponent from "../components/MyRecipeCardComponent.vue";
import searchBarComponent from "../components/searchBarComponent.vue";
import { BIconJournalPlus } from "bootstrap-icons-vue";

import { ref, onMounted, onUnmounted } from "vue";

const isSmallScreen = ref(window.innerWidth < 800);

const updateWidth = () => {
  isSmallScreen.value = window.innerWidth < 800;
};

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>
<template>
  <div class="container">
    <searchBarComponent
      :searchProp="parentSearch"
      :sortProp="parentCategory"
      @searchEvent="handleSearch"
      @sortEvent="handleSort"
      style="margin-right: 24px"
    />
    <div class="row">
      <div class="header">
        <h3>My Recipes</h3>

        <router-link :to="'/addrecipe'">
          <button type="button" class="btn btn-primary add-btn">
            <div v-if="isSmallScreen">
              <BIconJournalPlus />
            </div>
            <div v-else>
              {{ addRecipe }}
            </div>
          </button>
        </router-link>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-12" v-for="r in displayedRecipes">
        <MyRecipeCardComponent :recipeProp="r" />
      </div>
    </div>
    <div class="paginate" v-if="filteredRecipes.length != 0">
      <Paginate
        :page-count="totalPages"
        :page-range="3"
        :margin-pages="1"
        :click-handler="clickCallback"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :active-class="'currentPage'"
      >
      </Paginate>
    </div>
  </div>
</template>

<script>
import { collection, query, where, onSnapshot } from "firebase/firestore";
import db from "../firebase/init.js";
import { useLoginStore } from "../stores/loginStore.js";
import Paginate from "vuejs-paginate-next";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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

  watch: {
    parentCategory: {
      handler() {
        this.filterRecipes();
      },
      deep: true,
    },
  },

  data() {
    return {
      recipes: [],
      filteredRecipes: [],
      parentSearch: "",
      parentCategory: "",
      currentPage: 1,
      itemsPerPage: 6,
      addRecipe: "Add Recipe +",
    };
  },

  created() {
    this.getRecipes();
  },

  computed: {
    displayedRecipes() {
      const current = this.currentPage * this.itemsPerPage;
      const start = current - this.itemsPerPage;
      return this.filteredRecipes.slice(start, current);
    },
    totalPages() {
      return Math.ceil(this.filteredRecipes.length / this.itemsPerPage);
    },
  },

  methods: {
    getRecipes() {
      onSnapshot(
        query(
          collection(db, "recipes"),
          where("userID", "==", useLoginStore.userID)
        ),
        (snapshot) => {
          this.recipes = [];
          snapshot.forEach((doc) => {
            this.recipes.push({ id: doc.id, ...doc.data() });
          });
          this.filterRecipes();
        }
      );
    },

    filterRecipes() {
      if (this.parentSearch === "") {
        this.filteredRecipes = this.recipes;
      } else {
        this.filteredRecipes = this.recipes.filter((recipe) =>
          recipe.name.toLowerCase().includes(this.parentSearch.toLowerCase())
        );
      }
      switch (this.parentCategory) {
        case "":
          this.sortAlphabet();
          break;
        case "Newest":
          this.filteredRecipes.sort((a, b) => b.date - a.date);
          break;
        case "A-Z":
          this.sortAlphabet();
          break;
        case "Likes":
          this.filteredRecipes.sort((a, b) => b.like - a.like);
          break;
        case "Dislikes":
          this.filteredRecipes.sort((a, b) => b.dislike - a.dislike);
          break;
      }
    },

    sortAlphabet() {
      this.filteredRecipes.sort((a, b) => {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0; // names must be equal
      });
    },

    handleSearch(payload) {
      this.parentSearch = payload;
      this.filterRecipes();
    },

    handleSort(payload) {
      this.parentCategory = payload;
      this.filterRecipes();
    },

    clickCallback: function (pageNum) {
      this.currentPage = Number(pageNum);
    },
  },
};
</script>

<style scoped>
.container h3 {
  font-size: 28px;
  color: #4b61f3;
  font-weight: 400;
  padding: 24px 0px 24px 24px;
}

.row button {
  max-width: 150px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.container {
  padding-right: 24px;
  padding-left: 24px;
}

.pagination :deep() .currentPage a {
  background-color: rgb(203, 236, 247);
}

@media (max-width: 400px) {
  .add-btn {
    max-width: 100px !important;
  }
}
</style>
