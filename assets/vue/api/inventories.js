import axios from 'axios'

export default {
    create() {
        return axios.post('/api/inventory')
    },
    getAll() {
        return axios.get('/api/inventory')
    },
    fetchMissingBooks() {
        return axios.get('/api/inventory/missing-books')
    },
    addCode(data) {
        return axios.put(`/api/inventory/${data.id}/${data.code}`)
    },
    endInventory(inventoryId) {
        return axios.post('/api/inventory/' + inventoryId)
    }
}
