import axios from 'axios'

export default {
    getLoans(id) {
        return axios.get(`/api/loans/by-user/${id}`)
    }
}
