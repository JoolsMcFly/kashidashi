<template>
    <div>
        <div class="row">
            <div class="col-sm-12 col-md-6">
                <div class="card">
                    <div class="card-header">Overdue Loans
                        <span v-if="loansCount > 0" v-text="': ' + loans.length"></span>
                        <span v-if="loansCount > 0" class="pointer float-right" @click="downloadOverdue">Export <i
                            class="far fa-file-excel"></i></span>
                    </div>
                    <ul v-if="loansCount > 0" class="list-group list-group-flush">
                        <li v-for="loan in loans" class="list-group-item">
                            <loan
                                :loan="loan"
                                @end-loan="endLoan(loan)"
                            ></loan>
                        </li>
                    </ul>
                    <p v-show="loading">loading...</p>
                    <div class="card-body" v-show="!loading && loansCount <= 0">No overdue loans</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Loan from '../components/OverdueLoan'

    export default {
        components: {Loan},

        data() {
            return {
                loading: true,
            }
        },

        computed: {
            loans() {
                return this.$store.getters['loans/overdue']
            },
            loansCount() {
                if (!Boolean(this.loans)) {
                    return 0
                }

                return this.loans.length
            }
        },

        watch: {
            loans() {
                this.loading = false
            }
        },

        methods: {
            downloadOverdue() {
                document.location = '/download/overdue-loans'
            },
            fetchOverdueLoans() {
                this.$store.dispatch('loans/overdue')
            }
        },

        mounted() {
            this.fetchOverdueLoans()
        }
    }
</script>
