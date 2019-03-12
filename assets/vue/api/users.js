import axios from 'axios'

export default {
    getAll() {
        return axios.get('/api/users')
    },
    save(payload) {
        let data = new FormData()
        for (let key in payload) {
            if (payload[key] !== null) {
                data.append(key, payload[key])
            }
        }
        return axios.post('/api/users', data)
    },
    delete(userId) {
        return axios.delete(`/api/users/${userId}`)
    }
}
