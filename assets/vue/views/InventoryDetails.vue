<template>
    <div>
        <div v-if="!Boolean(selectedInventory.stoppedAt)">
            <div class="card">
                <div class="card-header">Inventory <strong v-if="userLocation">for {{ userLocation.name  }}</strong><br>
                    <small>Started at {{ selectedInventory.startedAt }}</small>
                </div>
                <div class="card-body" v-if="!isAdmin">
                    <p @click="showToMove = !showToMove"><i
                    :class="!showToMove ? 'fas fa-caret-right fa-fw' : 'fas fa-caret-down fa-fw'"
                    class="fas fa-book mr-2"></i>{{ showToMove ? 'Hide' : 'Show' }} {{ nbBooksToMove }} book<span v-if="nbBooksToMove > 1">s</span> to move</p>
                    <div v-if="showToMove">
                        <ul class="nav nav-tabs" id="booksToMove" role="tablist">
                            <li v-for="(toMove, index) in Object.entries(selectedInventory.books_to_move)" class="nav-item" role="presentation">
                                <button class="nav-link" :class="index === 0 ? 'active' : ''" :id="toMove[0].toLowerCase() + '-tab'"
                                        data-toggle="tab" :data-target="'#'+toMove[0].toLowerCase()" type="button" role="tab"
                                        :aria-controls="toMove[0].toLowerCase()" aria-selected="true">
                                    {{ toMove[0] }}
                                </button>
                            </li>
                        </ul>
                        <div class="tab-content" id="booksToMoveContent">
                            <div v-for="(toMove, index) in Object.entries(selectedInventory.books_to_move)" class="tab-pane fade show"
                                 :class="index === 0 ? 'active' : ''"
                                 :id="toMove[0].toLowerCase()" role="tabpanel"
                                 :aria-labelledby="toMove[0].toLowerCase()+'-tab'">
                                <p>{{ toMove[1].length }} book<span v-if="toMove[1].length > 1">s</span> to move.<br>
                                <template v-for="book in toMove[1]">
                                    <small>{{ book.title }}</small><span class="badge badge-primary float-right ml-2">{{ book.code }}</span><br>
                                </template>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row mb-2">
                        <div class="col">
                            <small><i class="fas fa-book mr-2"></i>
                                {{ selectedInventory.bookCount }} / {{selectedInventory.availableBookCount}}</small>
                        </div>
                    </div>
                    <div v-if="isInventory" class="input-group">
                        <input id="add-book-field" placeholder="book code and enter" type="tel" @keyup.13="addCode()"
                               class="form-control"
                               v-model="bookCode"/>
                        <div class="input-group-append">
                            <span class="input-group-text cursor-pointer" @click="addCode()">Add</span>
                        </div>
                    </div>
                    <p v-if="lastAddedBooks.length > 0">Latest 5 books added during this session:</p>
                    <div v-show="lastAddedBooks.length > 0">
                        <ul class="list-group list-group-flush">
                            <li v-for="book in lastAddedBooks" :key="book.code" class="list-group-item">
                                <span @click="removeBook(book)" class="fas fa-trash-alt fa-fw float-right ml-2 cursor-pointer" title="remove from inventory"></span>
                                <span class="badge badge-primary float-right ml-2">{{ book.code }}</span>
                                <span>{{ book.title || 'No title' }}</span>
                                <template v-if="!book.inventory_item.belongsAt || book.inventory_item.foundAt.id !== book.inventory_item.belongsAt.id">
                                    <br><span class="text-danger"><i class="fas fa-exclamation-triangle fa-fw mr-2"></i>{{ book.inventory_item.foundAt.name }} => {{ book.inventory_item.belongsAt ? book.inventory_item.belongsAt.name : '?' }}</span>
                                </template>
                                <template v-if="book.borrowed_by">
                                    <br><span class="text-danger"><i class="fas fa-exclamation-triangle fa-fw mr-2"></i>Borrowed by {{ book.borrowed_by }}</span>
                                </template>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="card-footer">
                    <a v-if="isAdmin" href="#" class="card-link" @click="endInventory()">
                        <i class="fas fa-flag-checkered mr-2"></i>Close inventory
                    </a>
                </div>
            </div>
        </div>
        <div v-else class="card">
            <div class="card-header">Inventory summary</div>
            <div class="card-body">
                <span><i class="fas fa-calendar-alt mr-2"></i>{{ inventoryDates(selectedInventory)}}</span><br/>
                <span><i class="fas fa-stopwatch mr-2"></i>{{ inventoryDuration(selectedInventory) }} hours</span><br/>
                <span>
                    <i class="fas fa-book mr-2"></i>{{ selectedInventory.bookCount }} / {{selectedInventory.availableBookCount}}
                </span><br/>
                <span v-if="selectedInventory.bookCount < selectedInventory.availableBookCount">
                    <i class="fas fa-book-dead mr-2"></i>{{ selectedInventory.availableBookCount -
                    selectedInventory.bookCount }} missing books.
                </span>
            </div>
            <div class="card-header">Download center</div>
            <div class="card-body">
                <p v-if="inventoryDetails.to_move !== undefined && inventoryDetails.to_move > 0"
                    class="pointer"
                   @click="downloadBooksToMove">Books to move ({{ inventoryDetails.to_move }})<i class="fa fa-download ml-2"></i>
                </p>
                <p v-if="inventoryDetails.missing !== undefined && inventoryDetails.missing > 0"
                    class="pointer"
                   @click="downloadMissingBooks()">Download missing books ({{ inventoryDetails.missing }})<i class="fa fa-download ml-2"></i>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                $addBtn: null,
                bookCode: '',
                showToMove: false,
            }
        },

        methods: {
            addCode() {
                if (!this.bookCode) {
                    return;
                }
                this.$store.dispatch(
                    'inventory/addCode',
                    {id: this.selectedInventory.id, code: this.bookCode}
                ).then(() => {
                    this.$store.dispatch('search/clearSearch')
                    this.bookCode = null
                    this.$addBtn.focus()
                })
            },
            removeBook(book) {
                this.$store.dispatch('inventory/removeBook', {inventoryId: this.selectedInventory.id, bookCode: book.code})
            },
            endInventory() {
                this.$store.dispatch('inventory/end', this.selectedInventory.id)
                this.$router.push('inventory')
            },
            fetchDetails() {
                this.$store.dispatch('inventory/fetchDetails', this.selectedInventory.id)
            },
            loanClasses(loan) {
                if (loan.duration > 21) {
                    return 'text-danger'
                }

                return ''
            },
            inventoryDates(inventory) {
                let start = moment(inventory.startedAt)
                let stop = moment(inventory.stoppedAt)
                if (start.format('YYYY-MM-DD') === stop.format('YYYY-MM-DD')) {
                    return start.format('YYYY-MM-DD') + ' from ' + start.format('HH:mm') + ' to ' + stop.format('HH:mm')
                }

                return start.format('YYYY-MM-DD') + ' - ' + stop.format('YYYY-MM-DD')
            },
            inventoryDuration(inventory) {
                let start = moment(inventory.startedAt)
                let stop = moment(inventory.stoppedAt)

                if (stop.diff(start) < 3600000) {
                    return stop.diff(start, 'minutes')
                }

                return stop.diff(start, 'hours')
            },
            downloadBooksToMove() {
                if (this.selectedInventory && typeof this.selectedInventory.id !== "undefined") {
                    document.location = `/download/inventory-details/${this.selectedInventory.id}/to-move`
                }
            },
            downloadMissingBooks() {
                if (this.selectedInventory && typeof this.selectedInventory.id !== "undefined") {
                    document.location = `/download/inventory-details/${this.selectedInventory.id}/missing`
                }
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
            lastAddedBooks() {
                return this.$store.getters['inventory/lastAddedBooks']
            },
            inventoryDetails() {
                return this.$store.getters['inventory/details']
            },
            locations() {
                return this.$store.getters['locations/all']
            },
            userLocation() {
                return this.$store.getters['security/userLocation']
            },
            isInventory() {
                return this.$store.getters['security/hasRole']('ROLE_INVENTORY')
            },
            isAdmin() {
                return this.$store.getters['security/hasRole']('ROLE_ADMIN')
            },
            nbBooksToMove() {
                if (!this.selectedInventory || !this.selectedInventory.books_to_move) {
                    return 0
                }
                return Object.values(this.selectedInventory.books_to_move).reduce((total, item) => total + item.length, 0)
            }
        },

        watch: {
            selectedInventory() {
                this.bookCode = ''
            }
        },

        created() {
            this.$addBtn = $('#add-book-field')
            if (Boolean(this.selectedInventory.stoppedAt)) {
                this.fetchDetails()
            }
            this.$store.dispatch('locations/all')
        }
    }
</script>
