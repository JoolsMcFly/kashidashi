import Vue from 'vue'
import Vuex from 'vuex'
import BorrowersModule from './borrowers';
import ActiveBorrowerModule from './active-borrower'
import InventoryModule from './inventory'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        borrower: BorrowersModule,
        activeBorrower: ActiveBorrowerModule,
        inventory: InventoryModule,
    }
})
