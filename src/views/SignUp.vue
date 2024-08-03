<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import Password from "primevue/password";
import { signUpValidationSchema } from "../schemas";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Divider from "primevue/divider";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "../store/store";

//Refs
const loading = ref(false);
const toast = useToast();
// user store
const userStore = useUserStore();
const { handleLogin } = userStore;
const router = useRouter();
const initialState = {
  email: "",
  Password: "",
};

const { handleSubmit, errors } = useForm({
  validationSchema: signUpValidationSchema,
  validateOnMount: false,
  keepValuesOnUnmount: true,
  initialValues: initialState,
});

const { value: email } = useField("email", signUpValidationSchema);
const { value: password } = useField("password", signUpValidationSchema);
const { value: confirm_password } = useField(
  "confirm_password",
  signUpValidationSchema
);

const register = handleSubmit(async (values) => {
  loading.value = true;
  createUserWithEmailAndPassword(getAuth(), values.email, values.password)
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
      console.log(err.message, typeof err.message);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: err.message.split(":")[1],
        life: 3000,
      });
    })
    .finally(() => (loading.value = false));
});

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
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
      console.log(err.message, typeof err.message);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: err.message,
        life: 3000,
      });
    });
};
</script>
<template>
  <section class="h-screen flex justify-center gap-6 my-8">
    <div
      class="bg-primary-1/40 dark:bg-primary-4 p-6 rounded-lg h-fit w-full max-w-[600px] mx-auto"
    >
      <h1 class="text-primary-5 text-4xl dark:text-secondary-1 my-9">
        Sign up
      </h1>
      <form action="" @submit.prevent="register">
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
              >
                <template #footer>
                  <Divider />
                  <ul class="pl-2 ml-2 my-0 leading-normal">
                    <li>At least one lowercase</li>
                    <li>At least one uppercase</li>
                    <li>At least one numeric</li>
                    <li>Minimum 8 characters</li>
                  </ul>
                </template>
              </Password>
              <label for="password" class="text-primary-5 dark:text-primary-3"
                >Password</label
              >
            </FloatLabel>
            <span v-if="errors.password" class="text-red-400 text-sm">{{
              errors.password
            }}</span>
          </div>

          <div>
            <FloatLabel>
              <Password
                v-model="confirm_password"
                inputId="confirm_password"
                class="w-full h-10"
                :feedback="false"
                toggleMask
                :invalid="errors.password"
              />
              <label for="password" class="text-primary-5 dark:text-primary-3"
                >confirm Password</label
              >
            </FloatLabel>
            <span v-if="errors.confirm_password" class="text-red-400 text-sm">{{
              errors.confirm_password
            }}</span>
          </div>
        </div>
        <Button
          type="submit"
          :loading="loading"
          label="Sign up"
          class="primary-btn w-full my-6"
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
        Already have an account?
        <RouterLink to="/login" class="underline">Login</RouterLink>
      </p>
    </div>
    <div class="hidden lg:block shadow-2xl h-fit p-4">
      <img src="../assets/mock4.png" alt="" />
    </div>
  </section>
</template>

<style scoped></style>
