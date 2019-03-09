import UsersAPI from '../api/users'

export default {
    namespaced: true,

    state: {
        users: []
    },

    getters: {
        all(state) {
            return state.users
        }
    },

    mutations: {
        setUsers(state, users) {
            state.users = users
        },
    },

    actions: {
        all({commit}) {
            return UsersAPI
                .getAll()
                .then(res => commit('setUsers', res.data))
        },
    }
}
