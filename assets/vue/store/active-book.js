import BooksApi from '../api/books'

export default {
    namespaced: true,

    state: {
        current: null,
        activeLoans: [],
    },

    getters: {
        current(state) {
            return state.current
        },

        activeLoans(state) {
            return state.activeLoans
        }
    },

    mutations: {
        setCurrent(state, book) {
            state.current = book
        },

        setActiveLoans(state, activeLoans) {
            state.activeLoans = activeLoans
        },
    },

    actions: {
        setCurrent({commit}, book) {
            commit('setCurrent', book)
        },

        activeLoans({commit}, id) {
            BooksApi.activeLoans(id)
                .then(res => commit('setActiveLoans', res.data))
                .catch(err => console.log("erreur fetching activeLoans", err))
        },
    }
}
