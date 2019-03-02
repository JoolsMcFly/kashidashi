import axios from 'axios'

export default {
    search(borrowerName) {
        return axios.get(`/api/borrowers/search/${borrowerName}`)
    }
}
