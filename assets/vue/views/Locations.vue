<template>
    <div class="card mt-2">
        <div class="card-header">Locations</div>
        <div class="card-body" v-if="!loading">
            <p v-if="locations.length === 0">No locations.</p>
            <ul class="list-group list-group-flush" v-else>
                <li v-for="location in locations"
                    class="list-group-item d-flex align-items-center justify-content-between">
                    <div class="">
                        {{ location.name }}
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="mr-3 cursor-pointer" @click="removeLocation(location)"><i class="fas fa-trash"></i>
                        </div>
                        <div class="mr-3 cursor-pointer" @click="editLocation(location)"><i class="fas fa-pen"></i>
                        </div>
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

        methods: {
            addLocation() {
                iziToast.info({
                    timeout: false,
                    overlay: true,
                    displayMode: 'once',
                    id: 'inputs',
                    color: 'white',
                    zindex: 999,
                    title: 'Inputs',
                    message: 'Add a new location',
                    position: 'center',
                    drag: false,
                    inputs: [
                        ['<input type="text" value="' + this.locationName + '">', 'change', function (instance, toast, input, e) {
                            this.locationName = input.value
                        }.bind(this)],
                    ],
                    buttons: [
                        ['<button class="btn btn-primary"><b>Save</b></button>', function (instance, toast) {
                            this.saveNewLocation()
                            instance.hide({transitionOut: 'fadeOut'}, toast, 'button');
                        }.bind(this), true],
                        ['<button class="btn btn-secondary">Cancel</button>', function (instance, toast) {
                            instance.hide({transitionOut: 'fadeOut'}, toast, 'button');
                        }],
                    ],
                });
            },
            saveNewLocation() {
                this.$store.dispatch('locations/save', {id: this.locationId, name: this.locationName})
            },
            editLocation(location) {
                this.locationId = location.id
                this.locationName = location.name
                this.addLocation()
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
