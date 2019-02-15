import BorrowerLoansApi from '../api/borrower-loans'

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
            return state.details
        }
    },

    mutations: {
        setCurrent(state, borrower) {
            state.current = borrower
        },

        setDetails(state, details) {
            state.details = details
        },
        addLoan(loanInfo) {

        }
    },

    actions: {
        setCurrent({commit}, borrower) {
            commit('setCurrent', borrower)
        },

        fetchDetails({commit}, id) {
            BorrowerLoansApi.getLoans(id)
                .then(res => commit('setDetails', res.data))
                .catch(err => console.log("erreur fetching details", err))
        },

        borrow({commit}, loanInfo) {
            BorrowerLoansApi.saveLoan(loanInfo)
                .then(commit('addLoan', loanInfo))
                .catch(err => console.log("erreur saving loan", err))
        }
    }
}
