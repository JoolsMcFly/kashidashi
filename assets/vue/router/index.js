import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';
import Borrowers from '../views/Borrowers'
import BorrowerDetails from "../views/BorrowerDetails";
import BookDetails from "../views/BookDetails";
import BookUpload from "../views/BookUpload";
import BorrowerUpload from "../views/BorrowerUpload";
import Inventory from "../views/Inventory";

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',

    routes: [
        { path: '/home', component: Home },
        { path: '/borrowers', component: Borrowers },
        { path: '/borrower-details', component: BorrowerDetails },
        { path: '/book-details', component: BookDetails },
        { path: '/books', component: BookUpload },
        { path: '/borrowers-upload', component: BorrowerUpload },
        { path: '/inventory', component: Inventory },
        { path: '*', redirect: '/home' }
    ],
});
