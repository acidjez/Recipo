<script setup>
import {
  BIconHandThumbsUp,
  BIconHandThumbsDownFill,
} from "bootstrap-icons-vue";
</script>

<template>
  <div class="card" style="height: 90%">
    <div class="card-body">
      <img
        :src="recipeProp.imageURL"
        alt="recipe image"
        class="img-fluid rounded"
        style="margin-bottom: 12px"
      />

      <div class="icon-container">
        <h6 class="card-title">{{ recipeProp.name }}</h6>

        <div>
          <BIconHandThumbsDownFill style="color: #040c26" />
          {{ recipeProp.dislike }}
          <BIconHandThumbsUp style="margin-left: 6px; color: #040c26" />
          {{ recipeProp.like }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["recipeProp"],
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

.icon-container h6 {
  padding-top: 12px;
  color: #171717;
  font-weight: 400;
  flex: 1;
}

.card-body {
  cursor: pointer;
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
</style>
