<template>
    <div class="card mt-2">
        <div class="card-header">Locations</div>
        <div class="card-body" v-if="!loading">
            <p v-if="locations.length === 0">No locations.</p>
            <ul class="list-group list-group-flush" v-else>
                <li v-for="location in locations" class="list-group-item d-flex align-items-center justify-content-between">
                    <div class="">
                        {{ location.name }}
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="mr-3 cursor-pointer" @click="removeLocation(location)"><i class="fas fa-trash"></i></div>
                        <div class="mr-3 cursor-pointer" @click="editLocation(location)"><i class="fas fa-pen"></i></div>
                    </div>
                </li>
            </ul>
            <p @click="addLocation" class="cursor-pointer"><i class="fas fa-plus mr-2 mt-2"></i>Add one</p>
        </div>
        <div class="card-body" v-else><p>loading...</p></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: true,
            }
        },

        computed: {
            locations() {
                return this.$store.getters['locations/all']
            }
        },

        watch: {
            locations() {
                this.loading = false
            }
        },

        methods: {
            addLocation() {
                return this.$router.push('/locations/add')
            },
            editLocation(location) {
                this.$store.commit('locations/setCurrent', location)
                this.$router.push('locations/add')
            },
            removeLocation(location) {
                this.$store.dispatch('locations/delete', location.id).then(() => {
                    iziToast.success({
                        title: 'Location deleted.',
                        position: 'bottomCenter'
                    });
                })
            }
        },

        created() {
            this.$store.dispatch('locations/all')
        }
    }
</script>
