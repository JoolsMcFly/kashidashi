<template>
    <div>
        <div class="row">
            <div class="col">
                {{ fullname }}
                <p>Loan info</p>
                <div v-for="loan in loans" class="loan-details">
                    <loan :loan="loan"></loan>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Loan from '../components/Loan'

    export default {
        components: {Loan},

        data() {
            return {
                borrower: null,
            }
        },

        computed: {
            fullname() {
                if (!Boolean(this.borrower)) {
                    return '';
                }

                return this.borrower.firstname + ' ' + this.borrower.surname
            },

            loans() {
                return this.$store.getters['activeBorrower/details']
            }
        },

        mounted() {
            this.borrower = this.$store.getters['activeBorrower/current']
            if (!Boolean(this.borrower)) {
                return this.$router.replace('/home')
            }

            this.details = this.$store.dispatch('activeBorrower/fetchDetails', this.borrower.id)
        }
    }
</script>
