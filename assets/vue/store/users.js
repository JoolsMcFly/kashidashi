import UsersAPI from '../api/users'

export default {
    namespaced: true,

    state: {
        users: [],
        currentUser: null
    },

    getters: {
        all(state) {
            return state.users
        },
        current(state) {
            return state.currentUser
        }
    },

    mutations: {
        setUsers(state, users) {
            state.users = users
        },
        setCurrent(state, user) {
            state.currentUser = user
        },
        addUser(state, user) {
            let userIndex = state.users.findIndex( u => u.id === user.id)
            if (userIndex !== -1) {
                state.users.splice(userIndex, 1, user)
            } else {
                state.users.push(user)
            }
        },
        deleteUser(state, userId) {
            state.users = state.users.filter( u => u.id !== userId)
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
        },
        delete({commit}, userId) {
            return UsersAPI
                .delete(userId)
                .then( res => commit('deleteUser', userId))
        },
    }
}
