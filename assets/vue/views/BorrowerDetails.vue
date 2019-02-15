<template>
    <div>
        <div class="row">
            <div class="col">
                <p>{{ fullname }}</p>
                <p>Loan info</p>
                <div v-if="loans && loans.length > 0" v-for="loan in loans" class="loan-detasils">
                    <loan
                        :loan="loan"
                        @clicked="endLoan(loan)"
                    ></loan>
                </div>
                <p v-if="loans && loans.length === 0">No current loans.</p>
            </div>
            <div class="col">
                <p>Add book by number</p>
                <div class="numpad">
                    <div class="row">
                        <div class="col-3 p-2" @click="handleInput('7')"><button class="btn btn-primary">7</button></div>
                        <div class="col-3 p-2" @click="handleInput('8')"><button class="btn btn-primary">8</button></div>
                        <div class="col-3 p-2" @click="handleInput('9')"><button class="btn btn-primary">9</button></div>
                    </div>
                    <div class="row">
                        <div class="col-3 p-2" @click="handleInput('4')"><button class="btn btn-primary">4</button></div>
                        <div class="col-3 p-2" @click="handleInput('5')"><button class="btn btn-primary">5</button></div>
                        <div class="col-3 p-2" @click="handleInput('6')"><button class="btn btn-primary">6</button></div>
                    </div>
                    <div class="row">
                        <div class="col-3 p-2" @click="handleInput('1')"><button class="btn btn-primary">1</button></div>
                        <div class="col-3 p-2" @click="handleInput('2')"><button class="btn btn-primary">2</button></div>
                        <div class="col-3 p-2" @click="handleInput('3')"><button class="btn btn-primary">3</button></div>
                    </div>
                    <div class="row">
                        <div class="col-3 p-2" @click="handleInput('del')"><button class="btn btn-primary">Del</button></div>
                        <div class="col-3 p-2" @click="handleInput('0')"><button class="btn btn-primary">0</button></div>
                        <div class="col-3 p-2" @click="saveLoan()"><button class="btn btn-primary">OK</button></div>
                    </div>
                </div>
                <div class="row">
                    <input type="text" :value="bookCode" readonly/>
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
                bookCode: ''
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
            }
        },

        methods: {
            handleInput(key) {
                if (key === 'del') {
                    return this.bookCode = this.bookCode.substring(0, this.bookCode.length - 1)
                }
                let code = parseInt(key, 10)
                if (!isNaN(code)) {
                    this.bookCode += key
                }
            },
            saveLoan() {
                this.$store.dispatch('activeBorrower/borrow', {
                    code: this.bookCode,
                    borrower: this.$store.getters['activeBorrower/current']
                })
            },
            endLoan(loan) {
                this.$store.dispatch('activeBorrower/endLoan', loan)
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
