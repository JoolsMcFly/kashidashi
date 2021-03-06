import axios from './axios-config'

export default {
    getLoans(id) {
        return axios.get(`/api/loans/by-user/${id}`)
    },
    saveLoan(loanInfo) {
        return axios.post(`/api/loans/by-user/${loanInfo.borrower.id}/${loanInfo.code}`)
    },
    endLoan(loan) {
        return axios.put(`/api/loans/${loan.id}`)
    }
}
