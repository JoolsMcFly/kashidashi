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
                .catch(err => console.log("erreur fetching details", err))
        },

        borrow({commit}, loanInfo) {
            BorrowerLoansApi.saveLoan(loanInfo)
                .then(res => commit('addLoan', res.data))
                .catch(err => console.log("erreur saving loan", err))
        },

        endLoan({commit}, loan) {
            BorrowerLoansApi.endLoan(loan)
                .then(commit('endLoan', loan))
                .catch(err => console.log("erreur ending loan", err))
        }
    }
}
