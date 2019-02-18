import SearchAPI from '../api/search'

export default {
    namespaced: true,

    state: {
        results: []
    },

    getters: {
        results(state) {
            return state.results
        }
    },

    mutations: {
        setResults(state, results) {
            state.results = results
        }
    },

    actions: {
        search({commit}, query) {
            return SearchAPI.search(query)
                .then(res => commit('setResults', res.data))
                .catch(err => console.log('error performing search', err))
        }
    }
}
