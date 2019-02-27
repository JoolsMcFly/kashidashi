<template>
    <div>
        <div v-show="activeInventories.length === 0" class="col-xs-12">
            No open inventory:
            <button @click="create()" class="btn btn-primary">Start one</button>
        </div>
        <div v-show="activeInventories.length > 0" class="col-xs-12">
            <h3>Open inventories</h3>
            <div v-for="inv in activeInventories">
                Created: {{ inv.started_at }} :
                <button @click="setSelected(inv)" class="btn btn-primary">GO!</button>
            </div>
        </div>
        <div v-show="closedInventories.length > 0" class="col-xs-12">
            <h3>Closed inventories</h3>
            <div v-for="inv in closedInventories" class="mb-3">
                <i class="fas fa-calendar-alt mr-2"></i>{{ inv.started_at }} - {{ inv.stopped_at }}
                <button @click="setSelected(inv)" class="btn btn-secondary">INFO</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                bookCode: null,
                $addBtn: null
            }
        },

        methods: {
            create() {
                this.$store.dispatch('inventory/create', this.bookCode)
                this.$router.push('/inventory-details')
            },
            setSelected(inventory) {
                this.$store.dispatch('inventory/setSelected', inventory)
                this.$router.push('/inventory-details')
            },
        },

        computed: {
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

        mounted() {
            this.$store.dispatch('inventory/getAll')
        }
    }
</script>
