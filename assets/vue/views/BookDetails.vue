<template>
    <div class="row mt-4 mb-4" v-if="Boolean(book)">
        <div class="col-sm-12 col-md-6">
            <div class="card">
                <div class="card-header">
                    <span class="float-right ml-2 badge badge-primary">{{ book.code }}</span>
                    <span>{{ book.title }}</span>
                </div>
                <div class="card-body">
                    <span><i class="fas fa-store mr-2"></i>{{ book.location !== null ? book.location : 'Unknown' }}</span>
                </div>
                <ul v-if="activeLoans.length > 0" class="list-group list-group-flush">
                    <li v-for="loan in activeLoans" class="list-group-item">
                        <p><i class="fas fa-user"></i> {{ loan.borrower.surname + ` (${loan.borrower.katakana})`}} {{
                            loan.borrower.surname !== loan.borrower.french_surname ? loan.borrower.french_surname : '' }}</p>
                        <p :class="loanClasses(loan)"><i class="far fa-calendar-alt"></i> {{
                            loan.started_at }}</p>
                        <p>Loans count: {{ book.stats.loansCount }}</p>
                    </li>
                </ul>
                <div class="card-body" v-else>No active loans</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        computed: {
            book() {
                let book = this.$store.getters['activeBook/current']
                if (!Boolean(book)) {
                    return this.$router.replace('/home')
                }

                return book
            },
            activeLoans() {
                return this.$store.getters['activeBook/activeLoans']
            }
        },

        methods: {
            loanClasses(loan) {
                if (loan.duration > 21) {
                    return 'text-danger'
                }

                return ''
            },
            fetchLoans() {
                this.$store.dispatch('activeBook/activeLoans', this.book.id)
            }
        },

        watch: {
            book() {
                this.fetchLoans()
            }
        },

        mounted() {
            if (Boolean(this.book)) {
                this.fetchLoans()
            }
        }
    }
</script>
