<template>
    <div class="card mt-2">
        <div class="card-header">Users</div>
        <div class="card-body" v-if="!loading">
            <p v-if="users.length === 0">No users.</p>
            <ul class="list-group list-group-flush" v-else>
                <li v-for="user in users" class="list-group-item d-flex align-items-center justify-content-between">
                    <div class="">
                        {{ user.firstname }} {{user.surname }}
                        <span class="badge badge-primary ml-2">{{ getdisplayableRole(user)}}</span>
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="mr-3"><i class="fas fa-trash"></i></div>
                        <div><i class="fas fa-pen"></i></div>
                    </div>
                </li>
            </ul>
            <p @click="addUser" class="cursor-pointer"><i class="fas fa-plus mr-2 mt-2"></i>Add one</p>
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
            addUser() {
                return this.$router.push('/users/add')
            },
            getdisplayableRole(user) {
                if (user.roles.indexOf('ROLE_USER') !== -1) {
                    return 'Standard'
                }

                return 'Power'
            }
        },

        created() {
            this.$store.dispatch('users/all')
        }
    }
</script>
