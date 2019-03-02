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
        search({commit}, borrowerName) {
            return BorrowersAPI.search(borrowerName)
                .then(res => commit('setSearchResults', res.data))
                .catch(err => console.log('error searching borrowers', err))
        }
    }
}
