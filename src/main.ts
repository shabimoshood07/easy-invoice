import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import { VsxIcon } from "vue-iconsax";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";

const app = createApp(App);

app.use(router);
app.component("VsxIcon", VsxIcon);
// app.use(PrimeVue, {
//   unstyled: true,
// });
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "dark",
      // cssLayer: false,
      cssLayer: {
        name: "primevue",
        order: "tailwind-utilities,tailwind-base, primevue",
      },
      // cssLayer: {
      //   name: "primevue",
      //   order: "tailwind-base, primevue,tailwind-utilities,",
      // },
    },
  },
});
app.mount("#app");

// cssLayer: {
//   name: "primevue",
//   order: "tailwind-base, primevue, tailwind-utilities",
// },
