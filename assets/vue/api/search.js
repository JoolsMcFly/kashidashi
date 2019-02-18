import axios from 'axios'

export default {
    search(query) {
        return axios.get(`/api/search/${query}`)
    }
}
