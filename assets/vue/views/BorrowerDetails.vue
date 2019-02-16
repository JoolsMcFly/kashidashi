<template>
    <div>
        <h3 class="mt-4">{{ fullname }}</h3>
        <div class="row mb-4">
            <div class="col">
                <vue-bootstrap-typeahead
                    ref="typeahead"
                    v-model="bookCode"
                    :data="suggestions"
                    placeholder="enter a book code"
                    :serializer="s => s.text"
                    @hit="saveLoan($event)"
                    :minMatchingChars="0"
                />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 col-md-6">
                <div class="card">
                    <div class="card-header">
                        Loan info
                    </div>
                    <ul v-if="loans && loans.length > 0" class="list-group list-group-flush">
                        <li v-for="loan in loans" class="list-group-item">
                            <loan
                                :loan="loan"
                                @clicked="endLoan(loan)"
                            ></loan>
                        </li>
                    </ul>
                </div>
                <p v-if="loans && loans.length === 0">No current loans.</p>
            </div>
        </div>
    </div>
</template>

<script>
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
    import Loan from '../components/Loan'

    export default {
        components: {Loan, VueBootstrapTypeahead},

        data() {
            return {
                borrower: null,
                bookCode: '',
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
                this.bookCode = ''
                return this.$store.getters['activeBorrower/details']
            },

            suggestions() {
                return this.$store.getters['search/results']
            }
        },

        methods: {
            saveLoan(loan) {
                this.$store.dispatch('activeBorrower/borrow', {
                    code: loan.code,
                    borrower: this.$store.getters['activeBorrower/current']
                })
                this.$refs.typeahead.inputValue = ''
            },
            endLoan(loan) {
                this.$store.dispatch('activeBorrower/endLoan', loan)
            }
        },

        watch: {
            bookCode() {
                if (this.bookCode !== '') {
                    this.$store.dispatch('search/search', this.bookCode)
                }
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
