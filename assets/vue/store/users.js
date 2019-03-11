import UsersAPI from '../api/users'

export default {
    namespaced: true,

    state: {
        users: [],
    },

    getters: {
        all(state) {
            return state.users
        },
    },

    mutations: {
        setUsers(state, users) {
            state.users = users
        },
        addUser(state, user) {
            let userIndex = state.users.findIndex( u => u.id === user.id)
            if (userIndex !== -1) {
                state.users.splice(userIndex, 1, user)
            } else {
                state.users.push(user)
            }
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
                .then(res => commit('addUser', res.data))
        }
    }
}
