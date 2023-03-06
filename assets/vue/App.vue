<template>
    <div>
        <template v-if="isAuthenticated">
            <div class="row">
                <div v-if="!isAdmin" class="col">
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <div class="row">
                            <div class="col-4">
                                <div class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                        Menu
                                    </button>
                                    <div class="dropdown-menu">
                                        <router-link class="dropdown-item" to="/home">
                                        <span @click="closeMenu">
                                            <i class="fas fa-home d-xs-block d-lg-none mr-2"></i>Home
                                        </span>
                                        </router-link>
                                        <router-link v-if="showInventoryMenu" class="dropdown-item" to="/inventory-details">
                                            <span @click="closeMenu">
                                                <i class="fas fa-warehouse d-xs-block d-lg-none mr-2"></i>Inventory
                                            </span>
                                        </router-link>
                                        <a class="dropdown-item" href="/api/security/logout">
                                            <i class="fas fa-sign-out-alt fs-22px d-xs-block d-lg-none mr-1"></i>Logout
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8" v-if="showSearchField">
                                <vue-bootstrap-typeahead
                                    ref="typeahead"
                                    v-model="query"
                                    :data="suggestions"
                                    :serializer="s => s.text"
                                    placeholder="book code or person name"
                                    @hit="handleSuggestion($event)"
                                    :minMatchingChars="1"
                                />
                            </div>
                        </div>
                    </nav>
                </div>
                <div class="row" v-if="isAdmin">
                    <div class="col">
                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                            <div class="col-4">
                                <div class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                        Menu
                                    </button>
                                    <div class="dropdown-menu">
                                        <router-link class="dropdown-item" to="/books">
                                            <i class="fas fa-book mr-2"></i>Books
                                        </router-link>
                                        <router-link class="dropdown-item" to="/borrowers-upload">
                                            <i class="fas fa-address-card mr-2"></i>Borrowers
                                        </router-link>
                                        <router-link class="dropdown-item" to="/locations">
                                            <i class="fas fa-store mr-2"></i>Locations
                                        </router-link>
                                        <router-link class="dropdown-item" to="/users">
                                            <i class="fas fa-users mr-2"></i>Users
                                        </router-link>
                                        <router-link class="dropdown-item" to="/inventory"><i class="fas fa-warehouse mr-2"></i>Inventory</router-link>
                                        <a class="dropdown-item" href="/api/security/logout">
                                            <i class="fas fa-sign-out-alt fs-22px d-xs-block d-lg-none mr-2"></i>Logout
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8" v-if="isStandardUser">
                                <vue-bootstrap-typeahead
                                    ref="typeahead"
                                    v-model="query"
                                    :data="suggestions"
                                    :serializer="s => s.text"
                                    placeholder="book code or person name"
                                    @hit="handleSuggestion($event)"
                                    :minMatchingChars="2"
                                />
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </template>
        <div class="container" v-bind:style="{ paddingTop: (isAdmin ? '0'  : 30) + 'px'}">
            <router-view></router-view>
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
                query: '',
                activeInventory: null,
                locations: [],
                userLocation: null
            }
        },

        components: {VueBootstrapTypeahead},

        methods: {
            clearSearch() {
                this.query = ''
                this.$refs.typeahead.inputValue = ''
            },
            handleSuggestion(suggestion) {
                this.clearSearch()
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
            showSearchField() {
                return this.$router.currentRoute.name !== 'inventory-details'
            },
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
            isStandardUser() {
                return this.$store.getters['security/hasRole']('ROLE_USER')
            },
            isInventory() {
                return this.$store.getters['security/hasRole']('ROLE_INVENTORY')
            },
            selectedInventory() {
                return this.$store.getters['inventory/selectedInventory']
            },
            showInventoryMenu() {
                return this.isInventory && this.selectedInventory.id !== undefined
            }
        },

        watch: {
            query() {
                // condition sur la vue au lieu de celle-ci
                if (this.$router.currentRoute.name === 'inventory-details') {
                    return
                }
                let cleanQuery = this.query.replace(/\s/g, '');
                if (cleanQuery !== '' && (cleanQuery.length >= 2 || parseInt(cleanQuery, 10))) {
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
                roles = JSON.parse(this.$parent.$el.attributes['data-roles'].value)
            ;
            let activeInventory = this.$parent.$el.attributes['data-active-inventory'].value;
            let booksToMove = this.$parent.$el.attributes['data-books-to-move'].value;
            if (activeInventory !== '') {
                this.activeInventory = JSON.parse(activeInventory)
                this.activeInventory.books_to_move = booksToMove !== '' ? JSON.parse(booksToMove) : null
            }
            if (this.activeInventory) {
                this.$store.dispatch('inventory/setSelected', this.activeInventory)
            }
            this.$store.dispatch(
                'security/setUserLocation',
                JSON.parse(this.$parent.$el.attributes['data-user-location'].value)
            );

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
