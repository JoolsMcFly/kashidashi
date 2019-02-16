<template>
    <div class="col-xs-12">
        <div v-for="borrower in borrowers">
            <borrower :borrower="borrower" @show-borrower="showBorrower(borrower)"></borrower>
        </div>
    </div>
</template>

<script>
    import Borrower from '../components/Borrower'

    export default {
        name: 'home',
        components: {Borrower},

        data() {
            return {
                filterBorrowers: '',
            }
        },

        methods: {
            showBorrower(borrower) {
                this.$store.dispatch('activeBorrower/setCurrent', borrower)
                this.$router.push('/borrower-details')
            }
        },

        computed: {
            borrowers: function () {
                let borrowers = this.$store.getters['borrower/borrowers']
                if (this.filterBorrowers === '') {
                    return borrowers
                }

                let lowercaseFilter = this.filterBorrowers.toLowerCase()

                return borrowers.filter(borrower => borrower.surname.toLowerCase().indexOf(lowercaseFilter) !== -1)
            }
        }
    }
</script>
