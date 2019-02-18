import axios from 'axios'

export default {
    getAll() {
        return axios.get('/api/borrowers')
    },
    search(borrowerName) {
        return axios.get(`/api/borrowers/search/${borrowerName}`)
    }
}
