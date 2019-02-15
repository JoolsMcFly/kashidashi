<template>
    <div>
        <div v-if="Boolean(selectedInventory)" class="col-xs-12">
            <input type="number" v-model="bookCode"/>
            <button type="button" @click="addCode()">ADD</button>
            <p>{{ selectedInventory.book_count }} books added so far.</p>
            <button type="button" @click="endInventory()">Close</button>
        </div>
        <div v-show="activeInventories.length === 0" class="col-xs-12">
            No open inventory:
            <button @click="create()" class="btn btn-primary">Start one</button>
        </div>
        <div v-show="!Boolean(selectedInventory) && activeInventories.length > 0" class="col-xs-12">
            <h3>Open inventories</h3>
            <div v-for="inv in activeInventories">
                {{inv.id}} created at {{ inv.started_at }} :
                <button @click="setSelected(inv)" class="btn btn-primary">GO!</button>
            </div>
        </div>
        <div v-show="closedInventories.length > 0" class="col-xs-12">
            <h3>Closed inventories</h3>
            <div v-for="inv in closedInventories" class="mb-3">
                {{inv.id}} created at {{ inv.started_at }} :
                <button @click="showDetails(inv)" class="btn btn-secondary">INFO</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                bookCode: null,
            }
        },

        methods: {
            create() {
                this.$store.dispatch('inventory/create', this.bookCode)
            },
            addCode() {
                this.$store.dispatch('inventory/addCode', {id: this.selectedInventory.id, code: this.bookCode})
            },
            endInventory() {
                this.$store.dispatch('inventory/end', this.selectedInventory.id)
            },
            setSelected(inventory) {
                this.$store.dispatch('inventory/setSelected', inventory)
            },
            showDetails(inv) {
                alert(`${inv.book_count} out of ${inv.available_book_count} were added.`)
            }
        },

        computed: {
            selectedInventory() {
                return this.$store.getters['inventory/selectedInventory']
            },
            inventories() {
                return this.$store.getters['inventory/inventories']
            },
            activeInventories() {
                return this.inventories.filter(inv => typeof inv.stopped_at === "undefined")
            },
            closedInventories() {
                return this.inventories.filter(inv => typeof inv.stopped_at !== "undefined")
            }
        },

        watch: {
            selectedInventory() {
                this.bookCode = ''
            }
        },

        mounted() {
            this.$store.dispatch('inventory/getAll')
        }
    }
</script>
