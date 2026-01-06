import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config';
import Theme from '@primeuix/themes/nora';
import 'primeicons/primeicons.css'

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Theme,
        options: {
            darkModeSelector: false
        }
    }
});


app.mount('#app')

