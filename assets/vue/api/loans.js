import axios from 'axios'

export default {
    overdue() {
        return axios.get('/api/loans/overdue')
    },
}
