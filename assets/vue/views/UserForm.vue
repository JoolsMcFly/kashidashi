<template>
    <div class="card mt-2">
        <div class="card-header">New User</div>
        <div class="card-body">
            <div class="form-group">
                <label for="firstname">First name</label>
                <input class="form-control" type="text" id="firstname" v-model="firstname">
            </div>
            <div class="form-group">
                <label for="surname">Surname</label>
                <input class="form-control" type="text" id="surname" v-model="surname">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input class="form-control" type="email" id="email" v-model="email">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input class="form-control" type="password" id="password" v-model="password">
            </div>
            <div v-if="isAdmin">
                <p>Role</p>
                <div class="form-check-inline form-check">
                    <input type="radio" name="role" class="form-check-input" id="role_admin" value="ROLE_USER"
                           v-model="role">
                    <label class="form-check-label" for="role_admin">Standard</label>
                </div>
                <div class="form-check-inline form-check">
                    <input type="radio" name="role" class="form-check-input" id="role_sup" value="ROLE_SUPER"
                           v-model="role">
                    <label class="form-check-label" for="role_sup">Power</label>
                </div>
            </div>
            <input v-else type="hidden" value="ROLE_USER" v-model="role"/>
            <div class="form-group mt-3">
                <button @click="saveUser" type="submit" class="btn btn-primary">Save</button>
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
                role: '',
            }
        },

        methods: {
            addUser() {
                return this.$store.dispatch('users/add')
            },
            saveUser() {
                this.$store.dispatch('users/save', this.$data).then(() => this.$router.push('/users'))
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
            this.role = JSON.parse(this.currentUser.roles)[0]
        }
    }
</script>
