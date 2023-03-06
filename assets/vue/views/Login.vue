<template>
    <div>
        <div class="row col">
            <h1>Login</h1>
        </div>

        <div class="row col">
            <form>
                <div class="form-row">
                    <div class="col">
                        <input v-model="username" type="text" class="form-control" placeholder="email">
                    </div>
                </div>
                <div class="row">
                    <div class="col mt-4">
                        <input v-model="password" type="password" class="form-control mb-2" placeholder="password" @keyup.13="performLogin()">
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <button @click="performLogin()"
                                :disabled="username.length === 0 || password.length === 0 || isLoading" type="button"
                                class="btn btn-primary">Login
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <div v-if="isLoading" class="row col">
            <p>Loading...</p>
        </div>

        <div v-else-if="hasError" class="row col">
            <div class="alert alert-danger" role="alert">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                username: '',
                password: '',
            };
        },
        created() {
            let redirect = this.$route.query.redirect;

            if (this.$store.getters['security/isAuthenticated']) {
                if (typeof redirect !== 'undefined') {
                    this.$router.push({path: redirect});
                } else {
                    this.$router.push({path: '/home'});
                }
            }
        },
        computed: {
            isLoading() {
                return this.$store.getters['security/isLoading'];
            },
            hasError() {
                return this.$store.getters['security/hasError'];
            },
            error() {
                return this.$store.getters['security/error'];
            },
        },
        methods: {
            performLogin() {
                let payload = {username: this.$data.username, password: this.$data.password},
                    redirect = this.$route.query.redirect;

                this.$store.dispatch('security/login', payload)
                    .then(() => {
                        if (!this.$store.getters['security/hasError']) {
                            if (typeof redirect !== 'undefined') {
                                this.$router.push({path: redirect});
                            } else {
                                this.$router.push({path: '/home'});
                            }
                        }
                    });
            },
        },
    }
</script>
