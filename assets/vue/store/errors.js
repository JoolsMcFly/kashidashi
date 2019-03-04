export default {
    namespaced: true,

    state: {
        errors: []
    },

    getters: {
        all(state) {
            return state.errors
        }
    },

    mutations: {
        addError(state, error) {
            state.errors.push(error)
        },
        popError(state) {
            state.errors.pop()
        },
    },

    actions: {
        addError({commit}, error) {
            commit('addError', error)
        },
        popError({commit}) {
            commit('popError')
        },
    }
}
