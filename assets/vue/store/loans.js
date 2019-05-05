import LoansAPI from '../api/loans'

export default {
    namespaced: true,

    state: {
        loans: [],
    },

    getters: {
        overdue(state) {
            return state.loans
        },
    },

    mutations: {
        setOverdueLoans(state, loans) {
            state.loans = loans
        },
    },

    actions: {
        overdue({commit}) {
            return LoansAPI.overdue()
                .then(res => commit('setOverdueLoans', res.data))
        }
    }
}
