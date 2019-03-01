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
                <i class="fas fa-calendar-alt mr-2"></i>{{ inventoryDates(inv)}}
                <button @click="setSelected(inv)" class="btn btn-secondary btn-sm">INFO</button>
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
            inventoryDates(inventory) {
                let start = moment(inventory.started_at)
                let stop = moment(inventory.stopped_at)
                if (start.format('YYYY-MM-DD') === stop.format('YYYY-MM-DD')) {
                    return start.format('YYYY-MM-DD') + ' from ' + start.format('HH:mm:ss') + ' to ' + stop.format('HH:mm:ss')
                }

                return start.format('YYYY-MM-DD') + ' - ' + stop.format('YYYY-MM-DD')
            }
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
