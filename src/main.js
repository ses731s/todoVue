import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import BootstrapVue from "bootstrap-vue";
import Vuelidate from "vuelidate";
import JwPagination from "jw-vue-pagination";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueSweetalert2 from "vue-sweetalert2";
import swal from "sweetalert2/dist/sweetalert2.all.min.js";

Vue.use(VueSweetalert2, swal);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("jw-pagination", JwPagination);
Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
