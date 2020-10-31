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
                <span>Role</span><br />
                <div class="form-check-inline form-check">
                    <input type="radio" name="role" class="form-check-input" id="role_admin" value="ROLE_USER"
                           v-model="role">
                    <label class="form-check-label" for="role_admin">Standard</label>
                </div>
                <div class="form-check-inline form-check">
                    <input type="radio" name="role" class="form-check-input" id="role_inventory" value="ROLE_INVENTORY"
                           v-model="role">
                    <label class="form-check-label" for="role_inventory">Inventory</label>
                </div>
            </div>
            <input v-else type="hidden" value="ROLE_USER" v-model="role"/>
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
                role: this.isAdmin ? '' : 'ROLE_USER',
            }
        },

        methods: {
            addUser() {
                return this.$store.dispatch('users/add')
            },
            saveUser() {
                this.$store.dispatch('users/save', this.$data).then(() => this.$router.push('/users'))
            },
            cancel() {
                this.$store.commit('users/setCurrent', null)
                this.$router.push('/users')
            }
        },

        computed: {
            currentUser() {
                return this.$store.getters['users/current']
            },
            isAdmin() {
                return this.$store.getters['security/hasRole']('ROLE_ADMIN')
            }
        },

        created() {
            for (let prop in this.currentUser) {
                this[prop] = this.currentUser[prop]
            }
            if (this.currentUser !== null) {
                this.role = JSON.parse(this.currentUser.roles)[0]
            }
        }
    }
</script>
