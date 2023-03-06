import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';
import Borrowers from '../views/Borrowers'
import OverdueLoans from '../views/OverdueLoans'
import BorrowerDetails from "../views/BorrowerDetails";
import BookDetails from "../views/BookDetails";
import BookUpload from "../views/BookUpload";
import BorrowerUpload from "../views/BorrowerUpload";
import Inventory from "../views/Inventory";
import InventoryDetails from "../views/InventoryDetails";
import Login from '../views/Login';
import Users from '../views/Users';
import UserForm from '../views/UserForm';
import store from '../store/main';
import Locations from "../views/Locations";

Vue.use(VueRouter);

let router = new VueRouter({
    mode: 'history',

    routes: [
        {path: '/home', name: 'home', component: Home, meta: {requiresAuth: true}},
        {path: '/login', component: Login},
        {path: '/loans/overdue', component: OverdueLoans, meta: {requiresAuth: true}},
        {path: '/borrowers', component: Borrowers, meta: {requiresAuth: true}},
        {path: '/borrower-details', component: BorrowerDetails, meta: {requiresAuth: true}},
        {path: '/book-details', component: BookDetails, meta: {requiresAuth: true}},
        {path: '/books', component: BookUpload, meta: {requiresAuth: true}},
        {path: '/users', component: Users, meta: {requiresAuth: true}},
        {path: '/users/add', component: UserForm, meta: {requiresAuth: true}},
        {path: '/borrowers-upload', component: BorrowerUpload, meta: {requiresAuth: true}},
        {path: '/inventory', component: Inventory, meta: {requiresAuth: true}},
        {path: '/inventory-details', name: 'inventory-details', component: InventoryDetails, meta: {requiresAuth: true}},
        {path: '/locations', component: Locations, meta: {requiresAuth: true}},
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
