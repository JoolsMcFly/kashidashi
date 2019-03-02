import axios from 'axios'

export default {
    getStats() {
        return axios.get('/api/stats')
    },
}
