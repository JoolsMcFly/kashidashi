import SecurityAPI from '../api/security';

export default {
    namespaced: true,
    state: {
        isLoading: false,
        error: null,
        isAuthenticated: false,
        roles: [],
        userLocation: null,
    },
    getters: {
        isLoading(state) {
            return state.isLoading;
        },
        hasError(state) {
            return state.error !== null;
        },
        error(state) {
            return state.error;
        },
        isAuthenticated(state) {
            return state.isAuthenticated;
        },
        roles(state) {
            return state.roles
        },
        hasRole(state) {
            return role => {
                return state.roles.indexOf(role) !== -1;
            }
        },
        userLocation(state) {
            return state.userLocation
        }
    },
    mutations: {
        ['AUTHENTICATING'](state) {
            state.isLoading = true;
            state.error = null;
            state.isAuthenticated = false;
            state.roles = [];
        },
        ['AUTHENTICATING_SUCCESS'](state, roles) {
            state.isLoading = false;
            state.error = null;
            state.isAuthenticated = true;
            state.roles = roles;
        },
        ['AUTHENTICATING_ERROR'](state, error) {
            state.isLoading = false;
            state.error = error;
            state.isAuthenticated = false;
            state.roles = [];
        },
        ['PROVIDING_DATA_ON_REFRESH_SUCCESS'](state, payload) {
            state.isLoading = false;
            state.error = null;
            state.isAuthenticated = payload.isAuthenticated;
            state.roles = payload.roles;
        },
        ['SET_USER_LOCATION'](state, payload) {
            state.userLocation = payload
        }
    },
    actions: {
        login({commit}, payload) {
            commit('AUTHENTICATING');
            return SecurityAPI.login(payload.username, payload.password)
                .then(res => commit('AUTHENTICATING_SUCCESS', res.data))
                .catch(err => commit('AUTHENTICATING_ERROR', err));
        },
        onRefresh({commit}, payload) {
            commit('PROVIDING_DATA_ON_REFRESH_SUCCESS', payload);
        },
        setUserLocation({commit}, payload) {
            commit('SET_USER_LOCATION', payload)
        }
    },
}
