<template>
    <div>
        <h3 class="mt-2">{{ fullName }}</h3>
        <div class="row mb-2">
            <div class="col" id="book-search">
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
                    <ul v-if="loans.length > 0" class="list-group list-group-flush">
                        <li v-for="loan in loans" class="list-group-item">
                            <loan
                                :loan="loan"
                                @end-loan="endLoan(loan)"
                            ></loan>
                        </li>
                    </ul>
                    <div class="card-body" v-else>No active loans</div>
                </div>
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
                bookCode: '',
            }
        },

        computed: {
            fullName() {
                if (!Boolean(this.borrower)) {
                    return '';
                }

                return this.borrower.fullName
            },

            loans() {
                this.bookCode = ''
                return this.$store.getters['activeBorrower/details']
            },

            suggestions() {
                return this.$store.getters['search/results']
            },

            borrower() {
                let borrower = this.$store.getters['activeBorrower/current']
                if (!Boolean(borrower)) {
                    this.$router.replace('/home')
                }

                return borrower
            }
        },

        methods: {
            saveLoan(loan) {
                this.bookCode = ''
                this.$store.dispatch('activeBorrower/borrow', {
                    code: loan.item.code,
                    borrower: this.$store.getters['activeBorrower/current']
                })
                this.$refs.typeahead.inputValue = ''
            },

            endLoan(loan) {
                this.$store.dispatch('activeBorrower/endLoan', loan)
            },

            fetchLoans() {
                this.$store.dispatch('activeBorrower/fetchDetails', this.borrower.id)
            }
        },

        watch: {
            bookCode() {
                if (this.bookCode.replace(/\s/g, '') !== '') {
                    this.$store.dispatch('search/search', this.bookCode)
                }
            },

            borrower() {
                this.fetchLoans()
            }
        },

        mounted() {
            if (Boolean(this.borrower)) {
                this.fetchLoans()
            }

            $('#book-search').find('input[type="search"]').attr("type", "tel")
        }
    }
</script>
