import axios from 'axios'

export default {
    actions: {
        getLoans() {
            return axios.get('/loans-by-user/{id}')
        }
    }
}
