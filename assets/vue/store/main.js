import Vue from 'vue'
import Vuex from 'vuex'
import BorrowersModule from './borrowers';
import ActiveBorrowerModule from './active-borrower'
import ActiveBookModule from './active-book'
import InventoryModule from './inventory'
import SearchModule from './search'
import StatsModule from './stats'
import ErrorsModule from './errors'
import SecurityModule from './security'
import UsersModule from './users'
import LocationsModule from './locations'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        borrower: BorrowersModule,
        activeBorrower: ActiveBorrowerModule,
        activeBook: ActiveBookModule,
        inventory: InventoryModule,
        search: SearchModule,
        stats: StatsModule,
        errors: ErrorsModule,
        security: SecurityModule,
        users: UsersModule,
        locations: LocationsModule,
    }
})
