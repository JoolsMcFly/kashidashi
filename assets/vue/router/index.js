import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';
import Borrowers from '../views/Borrowers'
import BorrowerDetails from "../views/BorrowerDetails";
import BookUpload from "../views/BookUpload";

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',

    routes: [
        { path: '/home', component: Home },
        { path: '/borrowers', component: Borrowers },
        { path: '/borrower-details', component: BorrowerDetails },
        { path: '/books', component: BookUpload },
        { path: '*', redirect: '/home' }
    ],
});
