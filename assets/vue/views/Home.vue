<template>
    <div>
        <div class="col-xs-12">
            <div class="form-group">
                <input type="text" v-model="filterBorrowers" class="form-input" placeholder="recherche"/>
            </div>
        </div>

        <div class="col-xs-12">
            <div v-for="borrower in borrowers">
                <borrower :borrower="borrower" @show-borrower="showBorrower(borrower)"></borrower>
            </div>
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
            borrowers() {
                let borrowers = this.$store.getters['borrower/borrowers']
                if (this.filterBorrowers === '') {
                    return borrowers
                }

                return borrowers.filter((borrower) => borrower.surname.indexOf(this.filterBorrowers) !== -1)
            }
        }
    }
</script>
