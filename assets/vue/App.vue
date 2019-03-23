<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <nav class="navbar navbar-expand-lg navbar-light bg-light" v-if="isAuthenticated">
                    <div class="navbar-brand">
                        <vue-bootstrap-typeahead
                            ref="typeahead"
                            v-model="query"
                            :data="suggestions"
                            :serializer="s => s.text"
                            placeholder="book code or person name"
                            @hit="handleSuggestion($event)"
                            :minMatchingChars="0"
                        />
                    </div>
                    <button class="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li class="nav-item">
                                <router-link class="navbar-brand" to="/home">
                                    <i class="fas fa-home d-xs-block d-lg-none mr-2"></i><span>Home</span>
                                </router-link>
                            </li>
                            <li class="nav-item active">
                                <router-link class="ml-1 ml-lg-3 navbar-brand" to="/inventory">
                                    <i class="fas fa-book d-xs-block d-lg-none mr-2"></i><span>Inventories</span>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="ml-1 ml-lg-3 navbar-brand" to="/users">
                                    <i class="fas fa-user d-xs-block d-lg-none mr-2"></i><span>Users</span>
                                </router-link>
                            </li>
                            <li class="nav-item" v-if="isAuthenticated">
                                <a class="navbar-brand" href="/api/security/logout">
                                    <i class="fas fa-sign-out-alt fs-22px d-xs-block d-lg-none mr-2"></i><span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>

        <router-view></router-view>

        <div class="row">
            <div class="col">
                <nav class="navbar navbar-expand-lg navbar-light bg-light" v-if="isAdmin">
                    <router-link class="navbar-brand" to="/books"><i class="fas fa-book"></i></router-link>
                    <router-link class="navbar-brand" to="/borrowers-upload"><i class="fas fa-user"></i></router-link>
                    <router-link class="navbar-brand" to="/locations"><i class="fas fa-store"></i></router-link>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
    import axios from 'axios'

    export default {
        name: 'app',

        data() {
            return {
                query: ''
            }
        },

        components: {VueBootstrapTypeahead},

        methods: {
            handleSuggestion(suggestion) {
                this.query = ''
                this.$refs.typeahead.inputValue = ''
                let action, route
                if (suggestion.type === 'book') {
                    action = 'activeBook/setCurrent'
                    route = '/book-details'
                } else {
                    action = 'activeBorrower/setCurrent'
                    route = '/borrower-details/'
                }

                this.$store.dispatch(action, suggestion.item)
                this.$router.push(route)
            },
            showError(error) {
                iziToast.error({
                    title: 'Error',
                    message: error,
                    position: 'bottomCenter'
                });
            }
        },

        computed: {
            suggestions() {
                return this.$store.getters['search/results']
            },
            errors() {
                return this.$store.getters['errors/all']
            },
            isAuthenticated() {
                return this.$store.getters['security/isAuthenticated']
            },
            isAdmin() {
                return this.$store.getters['security/hasRole']('ROLE_ADMIN')
            }
        },

        watch: {
            query() {
                if (this.query !== '') {
                    this.$store.dispatch('search/search', this.query)
                }
            },
            errors() {
                if (this.errors.length <= 0) {
                    return
                }

                this.showError(this.errors[0])
                this.$store.dispatch('errors/popError')
            }
        },

        created() {
            let isAuthenticated = JSON.parse(this.$parent.$el.attributes['data-is-authenticated'].value),
                roles = JSON.parse(this.$parent.$el.attributes['data-roles'].value);

            let payload = {isAuthenticated: isAuthenticated, roles: roles};
            this.$store.dispatch('security/onRefresh', payload);

            axios.interceptors.response.use(undefined, (err) => {
                return new Promise(() => {
                    if (err.response.status === 403) {
                        this.$router.push({path: '/login'})
                    }
                    throw err;
                });
            });
        },
    }
</script>
