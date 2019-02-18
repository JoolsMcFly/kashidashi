<template>
    <div class="row mt-4 mb-4" v-if="Boolean(book)">
        <div class="col-sm-12 col-md-6">
            <div class="card">
                <div class="card-header">
                    {{ book.title }}<span class="float-right ml-2 badge badge-primary">{{ book.code }}</span>
                </div>
                <ul v-if="activeLoans && activeLoans.length > 0" class="list-group list-group-flush">
                    <li v-for="loan in activeLoans" class="list-group-item">
                        <p><i class="fas fa-user"></i> {{ loan.borrower.surname }} {{ loan.borrower.firstname }}</p>
                        <p :class="loanClasses(loan)"><i class="far fa-calendar-alt"></i> {{
                            loan.started_at }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                book: null
            }
        },

        computed: {
            activeLoans() {
                return this.$store.getters['activeBook/activeLoans']
            },
        },

        methods: {
            loanClasses(loan) {
                if (loan.duration > 21) {
                    return 'text-white bg-danger'
                }

                return ''
            }
        },

        mounted() {
            this.book = this.$store.getters['activeBook/current']
            if (!Boolean(this.book)) {
                return this.$router.replace('/home')
            }

            this.details = this.$store.dispatch('activeBook/activeLoans', this.book.id)
        }
    }
</script>
