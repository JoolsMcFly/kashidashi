<template>
    <div class="row">
        <div class="col-sm-12 col-md-6">
            <div class="card">
                <div class="card-header">Users</div>
                <div class="card-body" v-if="!loading">
                    <p v-if="users.length === 0">No users.</p>
                    <ul class="list-group list-group-flush" v-else>
                        <li v-for="user in users"
                            class="list-group-item d-flex align-items-center justify-content-between">
                            <div @click="editUser(user)" class="cursor-pointer">
                                {{ user.firstname }} {{ user.surname }}
                                <span class="badge badge-primary ml-2">{{ getdisplayableRole(user) }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="mr-3 cursor-pointer" @click="removeUser(user)"><i class="fas fa-trash"></i>
                                </div>
                                <div class="mr-3 cursor-pointer" @click="editUser(user)"><i class="fas fa-pen"></i>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <p @click="addUser" class="cursor-pointer mt-1"><i class="fas fa-plus mr-2 mt-2"></i>Add user</p>
                </div>
                <div class="card-body" v-else><p>loading...</p></div>
            </div>
        </div>
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
            editUser(user) {
                this.$store.commit('users/setCurrent', user)
                this.$router.push('users/add')
            },
            getdisplayableRole(user) {
                if (user.roles.indexOf('ROLE_STANDARD') !== -1) {
                    return 'Standard'
                }

                if (user.roles.indexOf('ROLE_INVENTORY') !== -1) {
                    return 'Inventory'
                }

                return 'Power'
            },
            removeUser(user) {
                this.$store.dispatch('users/delete', user.id).then(() => {
                    iziToast.success({
                        title: 'User deleted.',
                        position: 'bottomCenter'
                    });
                })
            }
        },

        created() {
            this.$store.dispatch('users/all')
        }
    }
</script>
