<script setup>
import { BIconSearch, BIconFilter } from "bootstrap-icons-vue";
import { ref, onMounted, onUnmounted, computed } from "vue";

const isSmallScreen = ref(window.innerWidth < 600);

const updateWidth = () => {
  isSmallScreen.value = window.innerWidth < 600;
};

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

const searchPlaceHolder = computed(() =>
  isSmallScreen.value ? "Whats cooking?" : "Whats on the menu tonight?"
);
</script>

<template>
  <div class="input-group input-group-lg">
    <select
      id="category search"
      v-model="selectedCategory"
      class="form-control"
      style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
      @change="doSort"
    >
      <option disabled value="">Sort by</option>
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
    <label for="category search" class="visually-hidden">Category</label>

    <input
      type="text"
      id="search"
      class="form-control"
      aria-label="Large"
      aria-describedby="inputGroup-sizing-sm"
      :placeholder="searchPlaceHolder"
      v-model="search"
      @keyup.enter="doSearch"
      @input="doEmptySearch"
    />
    <label for="search" class="visually-hidden">Search</label>
    <button
      type="button"
      class="btn btn-primary"
      style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
      @click="doSearch"
    >
      <BIconSearch />
    </button>
  </div>
</template>

<script>
export default {
  props: ["searchProp, sortProp"],

  data() {
    return {
      search: "",
      selectedCategory: "",
      categories: ["A-Z", "Newest", "Likes", "Dislikes"],
    };
  },

  methods: {
    doSearch() {
      this.$emit("searchEvent", this.search);
    },

    doEmptySearch() {
      if (this.search === "") {
        this.$emit("searchEvent", this.search);
      }
    },

    doSort() {
      this.$emit("sortEvent", this.selectedCategory);
    },
  },
};
</script>

<style scoped>
.input-group {
  margin-top: 24px;
}

.input-group select {
  max-width: 105px;
}

.input-group input {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
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

@media (max-width: 600px) {
  .input-group select {
    max-width: 10px;
  }
}
</style>
