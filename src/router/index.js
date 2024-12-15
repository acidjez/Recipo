import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AddRecipeView from "@/views/AddRecipeView.vue";
import LoginView from "@/views/LoginView.vue";
import MyRecipiesView from "@/views/MyRecipiesView.vue";
import RecipeView from "@/views/RecipeView.vue";
import ShoppingListView from "@/views/ShoppingListView.vue";
import SignUpView from "@/views/SignUpView.vue";

import ModifyRecipeView from "@/views/ModifyRecipeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/recipe/:id",
      name: "recipe",
      component: RecipeView,
      props: true,
    },
    {
      path: "/addrecipe",
      name: "addrecipe",
      component: AddRecipeView,
    },
    {
      path: "/modifyrecipe/:id",
      name: "modifyrecipe",
      component: ModifyRecipeView,
      props: true,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/myrecipes",
      name: "myrecipes",
      component: MyRecipiesView,
    },
    {
      path: "/shoppinglist",
      name: "shoppinglist",
      component: ShoppingListView,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUpView,
    },
  ],
});

export default router;
