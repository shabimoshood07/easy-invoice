import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";
// @ts-ignore
import { VsxIcon } from "vue-iconsax";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import { createPinia } from "pinia";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(ToastService);
app.component("VsxIcon", VsxIcon);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "vueuse-color-scheme",
      cssLayer: {
        name: "primevue",
        order: "tailwind-base, primevue, tailwind-utilities",
      },
    },
  },
});
app.mount("#app");
