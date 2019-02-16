import BorrowersAPI from '../api/borrowers'

export default {
    namespaced: true,

    state: {
        borrowers: [],
        searchResults: []
    },

    getters: {
        borrowers(state) {
            return state.borrowers
        },
        searchResults(state) {
            return state.searchResults
        }
    },

    mutations: {
        setBorrowers(state, borrowers) {
            state.borrowers = borrowers
        },
        setSearchResults(state, searchResults) {
            state.searchResults = searchResults
        }
    },

    actions: {
        getAll({commit}) {
            return BorrowersAPI.getAll()
                .then(res => commit('setBorrowers', res.data))
                .catch(err => console.log('Error fetching borrowers', err))
        },
        search({commit}, borrowerName) {
            return BorrowersAPI.search(borrowerName)
                .then(res => commit('setSearchResults', res.data))
                .catch(err => console.log('error searching borrowers', err))
        }
    }
}
