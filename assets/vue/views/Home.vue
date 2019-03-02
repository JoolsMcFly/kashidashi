<template>
    <div class="col-xs-12 col-sm-6">
        <h3>Hello</h3>
        <div v-if="stats !== null">
            <p>Book count: {{stats.books}}</p>
            <p>Active loan count: {{stats.loans}}</p>
            <p>Family count: {{stats.borrowers}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'home',

        computed: {
            stats() {
                return this.$store.getters['stats/all']
            }
        },

        mounted() {
            this.$store.dispatch('stats/all')
        }
    }
</script>
