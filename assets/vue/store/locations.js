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
        setCurrent(state, location) {
            state.currentLocation = location
        },
        addLocation(state, location) {
            let locationIndex = state.locations.findIndex( u => u.id === location.id)
            if (locationIndex !== -1) {
                state.locations.splice(locationIndex, 1, location)
            } else {
                state.locations.push(location)
            }
        },
        deleteLocation(state, locationId) {
            state.locations = state.locations.filter( u => u.id !== locationId)
        }
    },

    actions: {
        all({commit}) {
            return LocationsAPI
                .getAll()
                .then(res => commit('setLocations', res.data))
        },
        save({commit}, payload) {
            return LocationsAPI
                .save(payload)
                .then(res => commit('addLocation', res.data))
        },
        delete({commit}, locationId) {
            return LocationsAPI
                .delete(locationId)
                .then( res => commit('deleteLocation', locationId))
        },
    }
}
