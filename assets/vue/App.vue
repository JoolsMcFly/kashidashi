<template>
    <div class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link class="navbar-brand" to="/home"><i class="fas fa-home"></i></router-link>
        </nav>

        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
    }
</script>
