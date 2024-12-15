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
    <div class="row">
      <div class="header">
        <h3>Shopping List</h3>
      </div>
    </div>

    <div class="card">
      <div class="card-body"></div>
      <div class="icon-container" style="margin-bottom: 12px">
        <label for="newItem" class="visually-hidden">New Item</label>
        <input
          type="text"
          class="form-control"
          id="newItem"
          v-model="newItem"
        />
        <BIconPlusSquareFill
          font-size="36"
          style="margin-left: 12px; color: #224ee3; cursor: pointer"
          @click="addItem"
        />
      </div>
      <div v-if="listItems !== 0">
        <div v-for="(item, index) in listItems" :key="item">
          <div class="list-container">
            <BIconTrash
              style="
                color: #e10000;
                margin-right: 4px;
                min-width: 16px;
                min-height: 16px;
              "
              cursor="pointer"
              @click="deleteItem(index)"
            />
            <BIconPencil
              style="
                color: #224ee3;
                margin-right: 6px;
                min-width: 16px;
                min-height: 16px;
              "
              cursor="pointer"
              @click="editItem(index, item)"
            />
            <BIconDot style="margin-right: 6px" />

            <div v-if="editedItem.index == index" class="icon-container">
              <label for="editItem" class="visually-hidden">Edit Item</label>
              <input
                type="text"
                v-model="editedItem.item"
                class="form-control"
                id="editItem"
                style="width: 100%"
              />
              <button
                @click="saveItem"
                class="btn btn-primary"
                style="margin-left: 12px"
              >
                save
              </button>
            </div>
            <div v-else>{{ item }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useLoginStore } from "../stores/loginStore.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import db from "../firebase/init.js";
import { onAuthStateChanged, getAuth } from "firebase/auth";
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

  created() {
    this.loadList();
  },

  data() {
    return {
      newItem: "",
      listItems: [],
      editedItem: { index: null, item: null },
    };
  },
  methods: {
    loadList() {
      getDoc(doc(db, "shoppingList", useLoginStore.userID))
        .then((recipeDoc) => {
          if (recipeDoc.exists()) {
            this.listItems = recipeDoc.data().shoppingList;
          }
        })
        .catch((error) => {
          console.error("Error loading list: ", error);
        });
    },

    pushToList() {
      setDoc(doc(db, "shoppingList", useLoginStore.userID), {
        shoppingList: this.listItems,
      }).catch((e) => {
        console.error("Error adding list item: ", e);
      });
    },

    addItem() {
      if (this.newItem === "") return;
      this.listItems.push(this.newItem);
      this.newItem = "";
      this.pushToList();
    },
    deleteItem(index) {
      this.listItems.splice(index, 1);
      this.pushToList();
    },
    editItem(index, item) {
      this.editedItem.index = index;
      this.editedItem.item = item;
    },

    saveItem() {
      this.listItems[this.editedItem.index] = this.editedItem.item;
      this.editedItem.index = null;
      this.editedItem.item = null;
      this.pushToList();
    },
  },
};
</script>

<style scoped>
.container {
  padding-left: 0px;
  padding-right: 0px;
}
.card {
  margin-left: 24px;
  margin-right: 24px;
  margin-top: 24px;
  padding: 0px 24px 18px 24px;
}

.container h3 {
  font-size: 28px;
  color: #4b61f3;
  font-weight: 400;
  padding: 24px 0px 24px 48px;
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
