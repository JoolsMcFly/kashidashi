import LocationsAPI from '../api/locations'

export default {
    namespaced: true,

    state: {
        locations: [],
        currentLocation: null
    },

    getters: {
        all(state) {
            return state.locations
        },
        current(state) {
            return state.currentLocation
        }
    },

    mutations: {
        setLocations(state, locations) {
            state.locations = locations
        },
    },

    actions: {
        all({commit}) {
            return LocationsAPI
                .getAll()
                .then(res => commit('setLocations', res.data))
        },
    }
}
