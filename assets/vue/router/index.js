import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';
import Borrowers from '../views/Borrowers'
import BorrowerDetails from "../views/BorrowerDetails";
import BookDetails from "../views/BookDetails";
import BookUpload from "../views/BookUpload";
import BorrowerUpload from "../views/BorrowerUpload";
import Inventory from "../views/Inventory";
import InventoryDetails from "../views/InventoryDetails";
import Login from '../views/Login';
import store from '../store/main';

Vue.use(VueRouter);

let router = new VueRouter({
    mode: 'history',

    routes: [
        {path: '/home', component: Home, meta: {requiresAuth: true}},
        {path: '/login', component: Login},
        {path: '/borrowers', component: Borrowers, meta: {requiresAuth: true}},
        {path: '/borrower-details', component: BorrowerDetails, meta: {requiresAuth: true}},
        {path: '/book-details', component: BookDetails, meta: {requiresAuth: true}},
        {path: '/books', component: BookUpload, meta: {requiresAuth: true}},
        {path: '/borrowers-upload', component: BorrowerUpload, meta: {requiresAuth: true}},
        {path: '/inventory', component: Inventory, meta: {requiresAuth: true}},
        {path: '/inventory-details', component: InventoryDetails, meta: {requiresAuth: true}},
        {path: '*', redirect: '/home'}
    ],
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (store.getters['security/isAuthenticated']) {
            next();
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            });
        }
    } else {
        next(); // make sure to always call next()!
    }
});
export default router;
