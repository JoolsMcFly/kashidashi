import axios from 'axios'

export default {
    namespaced: true,

    state: {
        current: null,
        details: null,
    },

    getters: {
        current(state) {
            return state.current
        },

        details(state) {
            console.log("returning details");
            return state.details
        }
    },

    mutations: {
        setCurrent(state, borrower) {
            state.current = borrower
        },

        setDetails(state, details) {
            console.log("settingh details");
            state.details = details
        }
    },

    actions: {
        setCurrent({commit}, borrower) {
            commit('setCurrent', borrower)
        },

        fetchDetails({commit}, id) {
            axios.get('/api/loans/by-user/' + id)
                .then(res => commit('setDetails', res.data))
                .catch(err => console.log("erreur fetching details", err))
        }
    }
}
