<template>
    <div class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link class="navbar-brand" to="/home"><i class="fas fa-home"></i></router-link>
            <vue-bootstrap-typeahead
                ref="typeahead"
                v-model="query"
                :data="suggestions"
                :serializer="s => s.text"
                placeholder="book code or person name"
                @hit="handleSuggestion($event)"
                :minMatchingChars="0"
            />
            <router-link class="ml-1 ml-sm-3 navbar-brand" to="/inventory"><i class="fas fa-book"></i></router-link>
        </nav>

        <router-view></router-view>

        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link class="navbar-brand" to="/books"><i class="fas fa-book"></i></router-link>
            <router-link class="navbar-brand" to="/borrowers-upload"><i class="fas fa-user"></i></router-link>
        </nav>
    </div>
</template>

<script>
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';

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
            }
        },

        computed: {
            suggestions() {
                return this.$store.getters['search/results']
            }
        },

        watch: {
            query() {
                if (this.query !== '') {
                    this.$store.dispatch('search/search', this.query)
                }
            }
        }
    }
</script>
