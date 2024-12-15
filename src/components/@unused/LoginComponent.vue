<script setup>
import { useLoginStore } from "../../stores/loginStore.js";
</script>

<template>
  <main class="form-signin m-auto">
    <div v-if="!loading">
      <div v-if="!useLoginStore.loggedIn">
        <div>
          <div class="h3 mb-3 fw-normal text-primary">Welcome Back!</div>

          <div class="form-floating">
            <input
              type="email"
              class="form-control"
              id="emailInput"
              placeholder="name@example.com"
              v-model="email"
              required
            />
            <label for="emailInput">Email address</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
              v-model="password"
              required
            />
            <label for="password">Password</label>
          </div>
          <button
            class="btn btn-primary w-100 py-2"
            style="margin-bottom: 10px"
            @click="login"
          >
            Sign in
          </button>
          <div class="error-message">
            {{ returnError }}
          </div>
        </div>

        <p style="text-align: center">
          Don't have an account?
          <router-link :to="'/signup/'">Sign Up</router-link>
        </p>
      </div>
      <div v-else>
        <div class="card">
          <div class="card-body">
            <div class="h3 mb-3 fw-normal text-primary">
              Welcome back, {{ useLoginStore.userEmail }}
            </div>
            <button
              class="btn btn-primary w-100 py-2"
              style="margin-bottom: 10px"
              @click="logout"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useLoginStore } from "../../stores/loginStore.js";

const auth = getAuth();

export default {
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        useLoginStore.userID = user.uid;
        useLoginStore.loggedIn = true;
        useLoginStore.userEmail = user.email;
      } else {
      }
      this.loading = false;
    });
  },

  data() {
    return {
      email: "",
      password: "",
      error: "",
      returnError: "",
      loading: true,
    };
  },

  methods: {
    login() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in
          this.error = "";
          const user = userCredential.user;
          useLoginStore.userID = user.uid;
          useLoginStore.userEmail = user.email;
          useLoginStore.loggedIn = true;
          this.$router.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          this.error = errorCode;
          this.buildErrorMessage();
        });
    },

    buildErrorMessage() {
      switch (this.error) {
        case "auth/missing-password":
          this.returnError = "Enter a password";
          break;
        case "auth/invalid-credential":
          this.returnError = "Wrong email or password";
          break;
        case "auth/invalid-email":
          this.returnError = "Invalid email address";
          break;
        default:
          this.returnError = "An error occurred";
      }
    },

    logout() {
      signOut(auth)
        .then(() => {
          useLoginStore.loggedIn = false;
          useLoginStore.userID = "";
          useLoginStore.userEmail = "";
          this.$router.push("/");
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
};
</script>

<style scoped>
.form-signin {
  width: 30%;
  min-width: 300px;
}

.form-floating {
  margin-bottom: 10px; /* adjust as needed */
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.h3 {
  font-size: 24px;
  text-align: center;
  font-weight: 400;
}

.error-message {
  color: rgb(209, 0, 0);
  text-align: center;
  margin-bottom: 4px;
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
