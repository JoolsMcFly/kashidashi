import axios from 'axios'

export default {
    create() {
        return axios.post('/api/inventory')
    },
    getAll() {
        return axios.get('/api/inventory')
    },
    fetchDetails(inventoryId) {
        return axios.get(`/api/inventory/${inventoryId}/details`)
    },
    addCode(payload) {
        let url = `/api/inventory/${payload.id}/${payload.code}`;
        return axios.put(url)
    },
    removeBook(payload) {
        return axios.delete(`/api/inventory/${payload.inventoryId}/${payload.bookCode}`)
    },
    endInventory(inventoryId) {
        return axios.post('/api/inventory/' + inventoryId)
    }
}
