<template>
    <div class="card mt-2">
        <div class="card-header">Users</div>
        <div class="card-body" v-if="!loading">
            <p v-if="users.length === 0">No users.</p>
            <ul class="list-group list-group-flush" v-else>
                <li v-for="user in users" class="list-group-item">
                    <span class="badge badge-primary float-right ml-2">{{ user.firstname }} {{user.surname }}</span>
                    <div class="form-group" v-for="role in available_roles">
                        <label :for="'cb_' + role">
                            <input type="checkbox"
                                   :id="'cb_' + role"
                                   :value="role"
                                   class="input-form"
                                   :checked="hasRole(role)"
                            />
                            {{ role }}
                        </label>
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
                available_roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_OTHER'],
            }
        },

        computed: {
            roles() {
                return this.$store.getters['security/roles']
            },

            users() {
                return this.$store.getters['users/all']
            }
        },

        watch: {
            users() {
                this.loading = false
            }
        },

        methods: {
            hasRole(role) {
                return this.roles.indexOf(role) !== -1
            }
        },

        created() {
            this.$store.dispatch('users/all')
        }
    }
</script>
