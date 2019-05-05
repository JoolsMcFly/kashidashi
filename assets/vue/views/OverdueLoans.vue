<template>
    <div>
        <div class="row">
            <div class="col-sm-12 col-md-6">
                <div class="card">
                    <div class="card-header">Overdue Loans</div>
                    <ul v-if="loans && loans.length > 0" class="list-group list-group-flush">
                        <li v-for="loan in loans" class="list-group-item">
                            <loan
                                :loan="loan"
                                @end-loan="endLoan(loan)"
                            ></loan>
                        </li>
                    </ul>
                    <div class="card-body" v-else>No overdue loans</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Loan from '../components/OverdueLoan'

    export default {
        components: {Loan},

        computed: {
            loans() {
                return this.$store.getters['loans/overdue']
            },
        },

        methods: {
            fetchOverdueLoans() {
                this.$store.dispatch('loans/overdue')
            }
        },

        mounted() {
            this.fetchOverdueLoans()
        }
    }
</script>
