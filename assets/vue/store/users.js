import UsersAPI from '../api/users'

export default {
    namespaced: true,

    state: {
        users: [],
        savedUser: null
    },

    getters: {
        all(state) {
            return state.users
        },
        savedUser(state) {
            return state.savedUser
        }
    },

    mutations: {
        setUsers(state, users) {
            state.users = users
        },
        setSavedUser(state, user) {
            state.savedUser = user
        }
    },

    actions: {
        all({commit}) {
            return UsersAPI
                .getAll()
                .then(res => commit('setUsers', res.data))
        },
        save({commit}, payload) {
            return UsersAPI
                .save(payload)
                .then(res => commit('setSavedUser', res.data))

        }
    }
}
