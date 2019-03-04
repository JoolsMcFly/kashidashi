import BorrowerLoansApi from '../api/borrower-loans'

export default {
    namespaced: true,

    state: {
        current: null,
        details: [],
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
        addLoan(state, loan) {
            state.details.push(loan)
        },
        endLoan(state, loan) {
            state.details = state.details.filter(l => l.id !== loan.id)
        }
    },

    actions: {
        setCurrent({commit}, borrower) {
            commit('setCurrent', borrower)
        },

        fetchDetails({commit}, id) {
            BorrowerLoansApi.getLoans(id)
                .then(res => commit('setDetails', res.data))
        },

        borrow({commit, dispatch}, loanInfo) {
            BorrowerLoansApi.saveLoan(loanInfo)
                .then(res => commit('addLoan', res.data))
        },

        endLoan({commit}, loan) {
            BorrowerLoansApi.endLoan(loan)
                .then(commit('endLoan', loan))
        }
    }
}
