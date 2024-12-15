<script setup>
import RecipeCardComponent from "../components/RecipeCardComponent.vue";
import searchBarComponent from "../components/searchBarComponent.vue";
</script>

<template>
  <div class="container">
    <div class="row">
      <searchBarComponent
        :searchProp="parentSearch"
        :sortProp="parentCategory"
        @searchEvent="handleSearch"
        @sortEvent="handleSort"
      />
      <div class="header">
        <h3>Recipes</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-12" v-for="r in displayedRecipes">
        <router-link :to="'/recipe/' + r.id">
          <RecipeCardComponent :recipeProp="r" />
        </router-link>
      </div>
    </div>
    <div class="paginate">
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
import { collection, query, onSnapshot } from "firebase/firestore";
import db from "../firebase/init.js";
import Paginate from "vuejs-paginate-next";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLoginStore } from "../stores/loginStore.js";
const auth = getAuth();
export default {
  data() {
    return {
      recipes: [],
      filteredRecipes: [],
      parentSearch: "",
      parentCategory: "",
      currentPage: 1,
      itemsPerPage: 6,
    };
  },

  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        useLoginStore.userID = user.uid;
        useLoginStore.loggedIn = true;
        useLoginStore.userEmail = user.email;
      } else {
        useLoginStore.loggedIn = false;
        useLoginStore.userID = "";
        useLoginStore.userEmail = "";
      }
    });

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
      onSnapshot(query(collection(db, "recipes")), (snapshot) => {
        this.recipes = [];
        snapshot.forEach((doc) => {
          this.recipes.push({ id: doc.id, ...doc.data() });
        });
        this.filterRecipes();
      });
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
          this.filteredRecipes.sort((a, b) => b.like - a.like);
          break;
        case "A-Z":
          this.sortAlphabet();
          break;
        case "Newest":
          this.filteredRecipes.sort((a, b) => b.date - a.date);
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
        return 0;
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

    getCount: function () {
      return this.recipes.length;
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
}

.container {
  padding-right: 24px;
  padding-left: 24px;
}

.row a {
  text-decoration: none;
}

.pagination :deep() .currentPage a {
  background-color: rgb(203, 236, 247);
}
</style>
