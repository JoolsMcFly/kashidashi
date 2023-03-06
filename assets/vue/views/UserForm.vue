<template>
    <div class="card mt-2">
        <div class="card-header">New User</div>
        <div class="card-body">
            <div class="form-group">
                <input class="form-control" type="text" id="firstname" v-model="firstname" placeholder="First name">
            </div>
            <div class="form-group">
                <input class="form-control" type="text" id="surname" v-model="surname" placeholder="Surname">
            </div>
            <div class="form-group">
                <input class="form-control" type="email" id="email" v-model="email" placeholder="Email">
            </div>
            <div class="form-group">
                <input class="form-control" type="password" id="password" v-model="password" placeholder="Password">
            </div>
            <div v-if="isAdmin">
                <span>Roles</span><br>
                <div class="form-check form-check">
                    <input type="checkbox" class="form-check-input" id="role_admin" value="ROLE_USER"
                           v-model="roles">
                    <label class="form-check-label" for="role_admin">Standard</label>
                </div>
                <div class="form-check form-check">
                    <input type="checkbox" class="form-check-input" id="role_inventory" value="ROLE_INVENTORY"
                           v-model="roles">
                    <label class="form-check-label" for="role_inventory">Inventory</label>
                    <div v-if="isInventory">
                        <label for="location">Assigned location:</label>
                        <select id="location" class="ml-4 custom-select custom-select-sm" style="width: auto" v-model="location">
                            <option value="0">No location</option>
                            <option v-for="location in locations" :value="location.id">{{ location.name }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <input v-else type="hidden" value="ROLE_USER" v-model="roles"/>
            <div class="form-group mt-3">
                <button @click="saveUser" type="submit" class="btn btn-primary">Save</button>
                <button @click="cancel" type="submit" class="btn btn-secondary">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                id: null,
                firstname: '',
                surname: '',
                email: '',
                password: '',
                location: 0,
                roles: this.isAdmin ? [] : ['ROLE_USER'],
            }
        },

        methods: {
            addUser() {
                return this.$store.dispatch('users/add')
            },
            saveUser() {
                if (this.roles.filter(r => !!r).length < 1) {
                    iziToast.error({
                        title: 'Error',
                        message: 'User must have at least one role.',
                        position: 'bottomCenter'
                    });

                    return
                }
                if (this.roles.includes('ROLE_INVENTORY') && this.location === 0) {
                    iziToast.error({
                        title: 'Error',
                        message: 'You must assign a location to inventory users.',
                        position: 'bottomCenter'
                    });
                    return;
                }
                this.$store.dispatch('users/save', this.$data).then(() => this.$router.push('/users'))
            },
            cancel() {
                this.$store.commit('users/setCurrent', null)
                this.$router.push('/users')
            }
        },

        computed: {
            locations() {
                return this.$store.getters['locations/all']
            },
            currentUser() {
                return this.$store.getters['users/current']
            },
            isAdmin() {
                return this.$store.getters['security/hasRole']('ROLE_ADMIN')
            },
            isInventory() {
                return this.roles.includes('ROLE_INVENTORY')
            }
        },

        created() {
            if (this.currentUser !== null) {
                for (let prop in this.currentUser) {
                    if (prop === 'location' && this.currentUser[prop] != null) {
                        this.location = this.currentUser[prop].id
                    } else if (prop !== 'roles') {
                        this[prop] = this.currentUser[prop]
                    }
                }
                this.roles = this.currentUser.roles
            }

            this.$store.dispatch('locations/all')
        }
    }
</script>
