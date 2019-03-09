import axios from 'axios'

export default {
    getAll() {
        return axios.get('/api/users')
    },
    save(payload) {
        return axios.post('/api/users', payload)
    }
}
