<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import Password from "primevue/password";
import { loginValidationSchema } from "../schemas";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import { useUserStore } from "../store/store";
// user store
const userStore = useUserStore();
const { handleLogin } = userStore;


//Refs
const loading = ref(false);
const toast = useToast();

const router = useRouter();
const initialState = {
  email: "",
  Password: "",
};

const { handleSubmit, errors } = useForm({
  validationSchema: loginValidationSchema,
  validateOnMount: false,
  keepValuesOnUnmount: true,
  initialValues: initialState,
});

const { value: email } = useField("email", loginValidationSchema);
const { value: password } = useField("password", loginValidationSchema);

const login = handleSubmit(async (values) => {
  loading.value = true;
  signInWithEmailAndPassword(getAuth(), values.email, values.password)
    .then((data) => {
      handleLogin(data.user);
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Login successful",
        life: 3000,
      });
      router.replace({ name: "Dashboard" });
    })
    .catch((err) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Invalid credentials",
        life: 3000,
      });
    })
    .finally(() => (loading.value = false));
});

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((data) => {
      console.log(data);
      handleLogin(data.user);
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Login successful",
        life: 3000,
      });
      router.replace({ name: "Dashboard" });
    })
    .catch((err) => {
      console.log(err.message, typeof err.message);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Invalid credentials",
        life: 3000,
      });
    });
};
</script>
<template>
  <section class="h-screen flex justify-center gap-6 my-8">
    <div
      class="bg-primary-1/40 dark:bg-primary-4 p-6 rounded-lg h-fit w-full max-w-[600px]"
    >
      <h1 class="text-4xl text-primary-5 dark:text-secondary-1 my-9">Login</h1>
      <form action="" @submit.prevent="login">
        <div class="space-y-10">
          <div>
            <FloatLabel>
              <InputText
                id="email"
                v-model="email"
                class="w-full h-10 px-2"
                :invalid="errors.email"
              />
              <label for="email" class="text-primary-5 dark:text-primary-3"
                >Email</label
              >
            </FloatLabel>
            <span v-if="errors.email" class="text-red-400 text-sm">{{
              errors.email
            }}</span>
          </div>

          <div>
            <FloatLabel>
              <Password
                v-model="password"
                inputId="password"
                class="w-full h-10"
                toggleMask
                :invalid="errors.password"
                :feedback="false"
              >
              </Password>
              <label for="password" class="text-primary-5 dark:text-primary-3"
                >Password</label
              >
            </FloatLabel>
            <span v-if="errors.password" class="text-red-400 text-sm">{{
              errors.password
            }}</span>
          </div>
        </div>
        <Button
          type="submit"
          :loading="loading"
          label="Login"
          class="primary-btn w-full mt-6"
          :disabled="loading"
        />
      </form>
      <p class="py-3 text-center dark:text-secondary-1 text-lg">or</p>
      <Button
        label="Continue with Google"
        class="primary-btn w-full mb-6"
        icon="pi pi-google"
        iconPos="right"
        :disabled="loading"
        @click="signInWithGoogle"
      />
      <p class="text-right dark:text-secondary-1 text-primary-5 text-lg">
        Don't have an account?
        <RouterLink to="/sign-up" class="underline">Sign up</RouterLink>
      </p>
    </div>
    <div class="hidden lg:block shadow-2xl h-fit p-4">
      <img src="../assets/mock4.png" alt="" />
    </div>
  </section>
</template>

<style scoped></style>
