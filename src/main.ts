import './assets/main.css'
import PrimeVue from 'primevue/config';
import Menubar from 'primevue/menubar';
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css';
import Aura from '@primevue/themes/aura';
import { initializeApp } from "firebase/app";
import ToastService from 'primevue/toastservice';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext';
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import ConfirmationService from 'primevue/confirmationservice'
import InlineMessage from 'primevue/inlinemessage'
import Textarea from 'primevue/textarea'
import Badge from 'primevue/badge'
import DatePicker from 'primevue/datepicker';
import Tooltip from 'primevue/tooltip';
import Radio from 'primevue/radiobutton'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Chart from 'primevue/chart';

import App from './App.vue'
import router from './router'
import ProgressSpinner from 'primevue/progressspinner'
import ConfirmDialog from 'primevue/confirmdialog'
import InputNumber from 'primevue/inputnumber'

const firebaseConfig = {
  apiKey: "AIzaSyB0UHIdXoHN9dLT1kIebHZGCdrMnKsz2AM",
  authDomain: "interviewlist-ca532.firebaseapp.com",
  projectId: "interviewlist-ca532",
  storageBucket: "interviewlist-ca532.appspot.com",
  messagingSenderId: "555649813424",
  appId: "1:555649813424:web:c6551d72e4b4da57a02475"
};

 initializeApp(firebaseConfig);

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(ConfirmationService)

app.use(PrimeVue, {
  theme: {
    preset:Aura
  }
});
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)
app.component('app-card', Card)
app.component('app-datatable', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', InlineMessage)
app.component('app-input-number', InputNumber)
app.component('app-textarea', Textarea)
app.component('app-date-picker', DatePicker)
app.component('app-radio', Radio)
app.component('app-badge', Badge)
app.component('app-chart', Chart)

app.directive('tooltip', Tooltip)

app.mount('#app')
