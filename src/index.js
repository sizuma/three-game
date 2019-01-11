import Vue from 'vue'
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';

import router from './routes.js';

Vue.use(VueRouter);
Vue.use(Vuetify);

new Vue({
    el: '#app',
    router,
});
