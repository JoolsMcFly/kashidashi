import BorrowersAPI from '../api/borrowers'

export default {
    namespaced: true,

    state: {
        borrowers: []
    },

    getters: {
        borrowers(state) {
            return state.borrowers
        }
    },

    mutations: {
        setBorrowers(state, borrowers) {
            state.borrowers = borrowers
        }
    },

    actions: {
        getAll({commit}) {
            return BorrowersAPI.getAll()
                .then(res => commit('setBorrowers', res.data))
                .catch(err => console.log('Error fetching borrowers', err))
        }
    }
}
