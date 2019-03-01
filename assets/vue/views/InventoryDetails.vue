<template>
    <div>
        <div v-if="!Boolean(selectedInventory.stopped_at)">
            <h3><i class="fas fa-calendar-alt mr-2"></i>{{ selectedInventory.started_at }}</h3>
            <input id="add-book-field" placeholder="book code and enter" type="number" @keyup.13="addCode()"
                   v-model="bookCode"/>
            <button type="button" class="btn btn-primary btn-sm" @click="addCode()">Add</button>
            <p><i class="fas fa-book mr-2"></i>{{ selectedInventory.book_count }} /
                {{selectedInventory.available_book_count}}</p>
            <button type="button" class="btn btn-secondary" @click="endInventory()">Close</button>
        </div>
        <div v-else class="card">
            <div class="card-header">Inventory details</div>
            <div class="card-body">
                <span><i class="fas fa-calendar-alt mr-2"></i>{{ inventoryDates(selectedInventory)}}</span><br/>
                <span><i class="fas fa-stopwatch mr-2"></i>{{ inventoryDuration(selectedInventory) }} hours</span><br/>
                <span>
                    <i class="fas fa-book mr-2"></i>{{ selectedInventory.book_count }} / {{selectedInventory.available_book_count}}
                </span><br/>
                <span v-if="selectedInventory.book_count < selectedInventory.available_book_count">
                    <i class="fas fa-book-dead mr-2"></i>{{ selectedInventory.available_book_count -
                    selectedInventory.book_count }} missing books.
                </span>
            </div>
        </div>

        <div class="card mt-2" v-if="missingBooks.length > 0">
            <div class="card-header">Missing books</div>
            <ul class="list-group list-group-flush">
                <li v-for="book in missingBooks" class="list-group-item">
                    <span class="badge badge-primary float-right ml-2">{{ book.code }}</span>
                    <p>{{ book.title }}</p>
                    <p v-if="book.loans.length > 0" :class="loanClasses(book.loans[0])">
                        <i class="far fa-calendar-alt"></i> {{ book.loans[0].started_at }}<br/>
                        <i class="fas fa-user"></i> {{ book.loans[0].borrower.firstname}} {{
                        book.loans[0].borrower.surname }}
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                $addBtn: null,
                bookCode: '',
            }
        },

        methods: {
            addCode() {
                this.$store.dispatch('inventory/addCode', {id: this.selectedInventory.id, code: this.bookCode})
                this.$addBtn.focus()
            },
            endInventory() {
                this.$store.dispatch('inventory/end', this.selectedInventory.id)
                this.$router.push('inventory')
            },
            loadMissingBooks() {
                this.$store.dispatch('inventory/fetchMissingBooks', this.selectedInventory.id)
            },
            loanClasses(loan) {
                if (loan.duration > 21) {
                    return 'text-danger'
                }

                return ''
            },
            inventoryDates(inventory) {
                let start = moment(inventory.started_at)
                let stop = moment(inventory.stopped_at)
                if (start.format('YYYY-MM-DD') === stop.format('YYYY-MM-DD')) {
                    return start.format('YYYY-MM-DD') + ' from ' + start.format('HH:mm') + ' to ' + stop.format('HH:mm')
                }

                return start.format('YYYY-MM-DD') + ' - ' + stop.format('YYYY-MM-DD')
            },
            inventoryDuration(inventory) {
                let start = moment(inventory.started_at)
                let stop = moment(inventory.stopped_at)

                return stop.diff(start, 'hours')
            }
        },

        computed: {
            selectedInventory() {
                return this.$store.getters['inventory/selectedInventory']
            },
            missingBooks() {
                return this.$store.getters['inventory/missingBooks']
            }
        },

        mounted() {
            this.loadMissingBooks()
        }
    }
</script>
