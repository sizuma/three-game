import VueRouter from 'vue-router';
import Index from './pages/index';

const routes = [
    {
        path: '/',
        component: Index,
    }
];

export default new VueRouter({routes});
