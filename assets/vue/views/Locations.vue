<template>
    <div class="card">
        <div class="card-header">Locations and book count</div>
        <div class="card-body" v-if="!loading">
            <p v-if="locations.length === 0">No locations.</p>
            <ul class="list-group list-group-flush" v-else>
                <li v-for="location in locations"
                    class="list-group-item d-flex align-items-center justify-content-between">
                    <div class="">
                        {{ location.name }}
                    </div>
                    <div class="">
                        {{ location.book_count }}
                    </div>
                </li>
            </ul>
        </div>
        <div class="card-body" v-else><p>loading...</p></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: true,
                locationName: '',
                locationId: null
            }
        },

        computed: {
            locations() {
                this.locationName = ''
                this.locationId = null
                return this.$store.getters['locations/all']
            }
        },

        watch: {
            locations() {
                this.loading = false
            }
        },

        created() {
            this.$store.dispatch('locations/all')
        }
    }
</script>
