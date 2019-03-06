<template>
    <div>
        <div v-if="!Boolean(selectedInventory.stopped_at)">
            <div class="card">
                <div class="card-header">Inventory started on {{ selectedInventory.started_at }}</div>
                <div class="card-body">
                    <div class="input-group">
                        <input id="add-book-field" placeholder="book code and enter" type="number" @keyup.13="addCode()"
                               class="form-control"
                               v-model="bookCode"/>
                        <div class="input-group-append">
                            <span class="input-group-text cursor-pointer" @click="addCode()">Add</span>
                        </div>
                    </div>
                    <p><i class="fas fa-book mr-2"></i>{{ selectedInventory.book_count }} /
                        {{selectedInventory.available_book_count}}</p>
                    <div v-show="lastAddedBooks.length > 0">
                        <p>Last <span v-text="lastAddedBooks.length"></span> books</p>
                        <ul class="list-group list-group-flush">
                            <li v-for="book in lastAddedBooks" :key="book.code" class="list-group-item">
                                <span @click="removeBook(book)" class="badge badge-primary float-right ml-2 cursor-not-allowed">{{ book.code }}</span>
                                <span>{{ book.title }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="#" class="card-link" @click="endInventory()"><i class="fas fa-flag-checkered mr-2"></i>Close
                        inventory</a>
                </div>
            </div>
        </div>
        <div v-else class="card">
            <div class="card-header">Inventory summary</div>
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
                if (this.bookCode.length > 0) {
                    this.$store.dispatch('inventory/addCode', {id: this.selectedInventory.id, code: this.bookCode})
                }
                this.$addBtn.focus()
            },
            removeBook(book) {
                this.$store.dispatch('inventory/removeBook', {inventoryId: this.selectedInventory.id, bookCode: book.code})
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
                let inventory = this.$store.getters['inventory/selectedInventory'];
                if (inventory.id === undefined) {
                    this.$router.replace('/home')
                }
                return inventory
            },
            missingBooks() {
                return this.$store.getters['inventory/missingBooks']
            },
            lastAddedBooks() {
                return this.$store.getters['inventory/lastAddedBooks']
            }
        },

        watch: {
            selectedInventory() {
                this.bookCode = ''
            }
        },

        mounted() {
            this.$addBtn = $('#add-book-field')
            if (Boolean(this.selectedInventory.stopped_at)) {
                this.loadMissingBooks()
            }
        }
    }
</script>
