import { createApp } from "vue";
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './components/App.vue'     //Our .vue startup file
import PrimeVue from 'primevue/config';
import Tree from 'primevue/tree';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faList, faAngleRight, faAngleDown, faEllipsisV, faCircle } from "@fortawesome/free-solid-svg-icons";
import { faClone as farClone } from "@fortawesome/free-regular-svg-icons";
import './style/main.css';    //Import css files as modules
import 'primevue/resources/themes/aura-light-green/theme.css';
import 'primeicons/primeicons.css';

//Will mount the vue app inside a HTML element which id equals to "app" (div into templetes/index.html file)
const app = createApp(App);
const router = createRouter({
    history: createWebHashHistory(),
    routes: []
});
app.use(router);
app.use(PrimeVue);
app.component('tree', Tree);
library.add(faList, faAngleRight, faAngleDown, farClone, faEllipsisV, faCircle);
app.component('fai', FontAwesomeIcon);
app.mount('#app');