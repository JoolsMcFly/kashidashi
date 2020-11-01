<template>
    <div>
        <div id="searchbox" v-if="showSearchBox">
            <div class="row">
                <div class="col">
                    <nav class="navbar navbar-expand-xs navbar-light bg-light">
                        <vue-bootstrap-typeahead
                            ref="typeahead"
                            v-model="query"
                            :data="suggestions"
                            :serializer="s => s.text"
                            placeholder="book code or person name"
                            @hit="handleSuggestion($event)"
                            :minMatchingChars="0"
                        />
                    </nav>
                </div>
            </div>
        </div>
        <div v-if="isAdmin">
            <div class="row">
                <div class="col">
                    <nav class="navbar navbar-expand-xs navbar-light bg-light">
                        <router-link class="navbar-brand" to="/users">
                            <i class="fas fa-users"></i>
                            <span class="router-link-subtitle">Users</span>
                        </router-link>
                        <router-link class="navbar-brand mr-0 text-right" to="/locations">
                            <i class="fas fa-store"></i>
                            <span class="router-link-subtitle">Locations</span>
                        </router-link>
                    </nav>
                </div>
            </div>
        </div>
        <div class="container" v-bind:style="{ paddingTop: (!isStandard ? '0'  : 70) + 'px'}">
            <router-view></router-view>

            <template v-if="isAuthenticated">
                <div class="row">
                    <div class="col">
                        <nav class="navbar navbar-expand-xs navbar-light bg-light">
                            <template v-if="isAdmin">
                                <router-link class="navbar-brand text-center" to="/books"><i class="fas fa-book"></i>
                                    <span class="router-link-subtitle">Books</span>
                                </router-link>
                                <router-link class="navbar-brand text-center" to="/borrowers-upload">
                                    <i class="fas fa-address-card"></i>
                                    <span class="router-link-subtitle">Borrowers</span>
                                </router-link>
                            </template>
                            <template v-if="isStandard">
                                <router-link class="ml-1 ml-lg-3 navbar-brand text-center" to="/loans/overdue">
                                    <span @click="closeMenu">
                                        <i class="fas fa-cash-register"></i>
                                    </span>
                                    <span class="router-link-subtitle">Overdue</span>
                                </router-link>
                            </template>
                            <template v-if="isInventory || isAdmin">
                                <router-link class="ml-1 ml-lg-3 navbar-brand text-center" to="/inventory">
                                    <span @click="closeMenu">
                                        <i class="fas fa-warehouse"></i></span>
                                    <span class="router-link-subtitle">Inventories</span>
                                </router-link>
                            </template>
                            <a class="navbar-brand text-right mr-0" href="/api/security/logout">
                                <i class="fas fa-sign-out-alt"></i>
                                <span class="router-link-subtitle">Logout</span>
                            </a>
                        </nav>
                    </div>
                </div>
            </template>
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
            },
            closeMenu() {
                $('#navbarToggler').click()
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
            },
            isStandard() {
                return this.$store.getters['security/hasRole']('ROLE_STANDARD')
            },
            isInventory() {
                return this.$store.getters['security/hasRole']('ROLE_INVENTORY')
            },
            showSearchBox() {
                return this.isAuthenticated && this.isStandard
            }
        },

        watch: {
            query() {
                if (this.query.replace(/\s/g, '') !== '') {
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
