import { createApp } from "vue";
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './components/App.vue'     //Our .vue startup file
import PrimeVue from 'primevue/config';
import VueTree from 'primevue/tree';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faList, faAngleRight, faAngleDown, faEllipsisV, faCircle, faCheckCircle, faExclamationCircle, faTimesCircle, faPauseCircle, faStopCircle, faInfoCircle, faPlus, faTrash, faFilter } from "@fortawesome/free-solid-svg-icons";
import { faClone as farClone } from "@fortawesome/free-regular-svg-icons";
import routes from "./common/routes";
import {createBootstrap} from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './style/main.css';    //Import css files as modules
import 'primevue/resources/themes/aura-light-green/theme.css';
import 'primeicons/primeicons.css';
// import Breadcrumbs from "./components/home/breadcrumbs.vue";
import Tree from "./components/home/tree.vue";
import FlatTree from "./components/flat-tree/flat-tree.vue";
import { authClient } from "./utils/utils.ts";

//Will mount the vue app inside a HTML element which id equals to "app" (div into templetes/index.html file)
const app = createApp(App);
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});
app.use(router);
app.use(PrimeVue);
app.use(createBootstrap({components: true, directives: true}));
app.component('vue-tree', VueTree);
app.use(ToastService);
app.component('Toast', Toast);
library.add(faList, faAngleRight, faAngleDown, farClone, faEllipsisV, faCircle, faCheckCircle, faExclamationCircle, faTimesCircle, faPauseCircle, faStopCircle, faInfoCircle, faPlus, faTrash, faFilter);
app.component('fai', FontAwesomeIcon);
// app.component('breadcrumbs', Breadcrumbs);
app.component('tree', Tree);
app.component('flat-tree', FlatTree);

app.config.globalProperties.$authClient = authClient;

app.mount('#app');