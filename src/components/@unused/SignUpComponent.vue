<template>
  <main class="form-signin m-auto">
    <div>
      <h1 class="h3 mb-3 fw-normal text-primary">Hello, nice to meet you!</h1>

      <div class="form-floating">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="name@example.com"
          required
          v-model="email"
        />
        <label for="email">Email address</label>
      </div>
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          id="password1"
          placeholder="Password"
          v-model="password"
          required
        />
        <label for="password1">Password</label>
      </div>
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          id="password2"
          placeholder="Password"
          v-model="password2"
          required
        />
        <label for="password2">Re-Enter Password</label>
      </div>
      <div class="error-message">
        {{ returnError }}
      </div>
      <button
        class="btn btn-primary w-100 py-2"
        style="margin-bottom: 10px"
        @click="checkForm"
      >
        Sign in
      </button>
    </div>

    <p style="text-align: center">
      Already have an account? <router-link :to="'/login/'">Login</router-link>
    </p>
  </main>
</template>

<script>
import {
  createUserWithEmailAndPassword,
  getAuth,
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
        this.$router.push("/login");
      } else {
      }
      this.loading = false;
    });
  },

  data() {
    return {
      email: "",
      password: "",
      password2: "",
      error: "",
      returnError: "",
    };
  },
  methods: {
    signUp() {
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          useLoginStore.loggedIn = true;
          useLoginStore.userEmail = auth.currentUser.email;
          useLoginStore.userId = auth.currentUser.uid;
        })
        .then(() => {
          this.$router.push("/login");
        })
        .catch((error) => {
          const errorCode = error.code;
          this.error = errorCode;
          this.buildErrorMessage();
        });
    },

    buildErrorMessage() {
      switch (this.error) {
        case "auth/missing-password":
          this.returnError = "Enter a password";
          break;
        case "auth/email-already-in-use":
          this.returnError = "Email already in use";
          break;
        case "auth/invalid-email":
          this.returnError = "Invalid email address";
          break;
        case "auth/weak-password":
          this.returnError = "Password should be at least 6 characters";
          break;
        default:
          this.returnError = "An error occurred";
      }
    },

    validatePassword2() {
      return this.password2 === this.password;
    },

    checkForm() {
      if (!this.validatePassword2()) {
        this.returnError = "Passwords do not match";
      } else {
        this.signUp();
      }
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
</style>
