import axios from 'axios'

export default {
    getAll() {
        return axios.get('/api/locations')
    },
    save(payload) {
        let data = new FormData()
        for (let key in payload) {
            if (payload[key] !== null) {
                data.append(key, payload[key])
            }
        }
        return axios.post('/api/locations', data)
    },
    delete(locationId) {
        return axios.delete(`/api/locations/${locationId}`)
    }
}
