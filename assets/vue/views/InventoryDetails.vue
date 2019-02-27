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
        <div v-else>
            <h3>
                <i class="fas fa-calendar-alt mr-2"></i>
                {{ selectedInventory.started_at }} - {{selectedInventory.stopped_at }}
            </h3>
            <p>
                <i class="fas fa-book mr-2"></i>
                {{ selectedInventory.book_count }} / {{selectedInventory.available_book_count}}
            </p>
            <p v-if="selectedInventory.book_count < selectedInventory.available_book_count">
                {{ selectedInventory.available_book_count - selectedInventory.book_count }} missing books.
                <button class="btn btn-primary btn-sm" type="button" @click="loadMissingBooks()">details</button>
            </p>
            <div v-if="Boolean(missingBooks)">
                Coucou les libres
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

        watch: {
            selectedInventory() {
                this.bookCode = ''
            }
        },

        mounted() {
            this.$addBtn = $('#add-book-field')
        }
    }
</script>
