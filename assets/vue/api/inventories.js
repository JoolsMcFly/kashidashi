import axios from 'axios'

export default {
    create() {
        return axios.post('/api/inventory')
    },
    getAll() {
        return axios.get('/api/inventory')
    },
    fetchMissingBooks(inventoryId) {
        return axios.get(`/api/inventory/${inventoryId}/missing-books`)
    },
    addCode(payload) {
        return axios.put(`/api/inventory/${payload.id}/${payload.code}`)
    },
    removeBook(payload) {
        return axios.delete(`/api/inventory/${payload.inventoryId}/${payload.bookCode}`)
    },
    endInventory(inventoryId) {
        return axios.post('/api/inventory/' + inventoryId)
    }
}
