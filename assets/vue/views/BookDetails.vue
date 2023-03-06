<template>
    <div class="row mb-4" v-if="Boolean(book)">
        <div class="col-sm-12 col-md-6">
            <div class="card">
                <div class="card-header">
                    <span class="float-right ml-2 badge badge-primary">{{ book.code }}</span>
                    <span>{{ book.title }}</span>
                </div>
                <div class="card-body">
                    <span><i class="fas fa-store mr-2"></i>{{ bookLocation }}</span>
                </div>
                <ul v-if="activeLoans.length > 0" class="list-group list-group-flush">
                    <li @click="displayBorrower(loan.borrower)" v-for="loan in activeLoans" class="list-group-item">
                        <p><i class="fas fa-user"></i> {{ loan.borrower.fullName }}</p>
                        <p :class="loanClasses(loan)"><i class="far fa-calendar-alt"></i>
                            {{loan.startedAt }}</p>
                        <p v-if="book.stats.loansCount > 0">Borrowed {{ book.stats.loansCount === 1 ?  'once' : `${book.stats.loansCount} times`}}</p>
                        <p v-else>Never borrowed</p>
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
                if (book === null) {
                    return this.$router.replace('/home')
                }

                return book
            },
            bookLocation() {
                return this.book !== null && this.book.location !== null ? this.book.location.name : 'Unknown'
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
            },
            displayBorrower(borrower) {
                this.$store.dispatch('activeBorrower/setCurrent', borrower)
                this.$router.push('/borrower-details/')
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
