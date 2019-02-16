import axios from 'axios'

export default {
    activeLoans(bookId) {
        return axios.get(`/api/loans/by-book/${bookId}`)
    },
}
