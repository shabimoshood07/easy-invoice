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
import store from "./store/store";
// import {store} from "./store/store"
const app = createApp(App);

app.use(router);
app.use(ToastService);
app.use(store);
app.component("VsxIcon", VsxIcon);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "vueuse-color-scheme",
      // cssLayer: false,
      cssLayer: {
        name: "primevue",
        order: "tailwind-base, primevue, tailwind-utilities",
      },
    },
  },
});
app.mount("#app");
