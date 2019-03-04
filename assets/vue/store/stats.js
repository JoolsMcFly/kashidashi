import StatsAPI from '../api/stats'

export default {
    namespaced: true,

    state: {
        stats: null
    },

    getters: {
        all(state) {
            return state.stats
        }
    },

    mutations: {
        setStats(state, stats) {
            state.stats = stats
        },
    },

    actions: {
        all({commit}) {
            return StatsAPI
                .getStats()
                .then(res => commit('setStats', res.data))
        },
    }
}
