<template>
    <div>
        <div>
            <h1>Current borrowers</h1>
        </div>

        <div v-for="borrower in borrowers">
            <borrower :borrower="borrower"></borrower>
        </div>

    </div>
</template>

<script>
    import Borrower from '../components/Borrower'

    export default {
        name: 'borrowers',
        components: {Borrower},

        computed: {
            borrowers() {
                return this.$store.getters['borrower/borrowers']
            }
        }
    }
</script>
