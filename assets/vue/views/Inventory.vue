<template>
    <div>
        <div class="card">
            <div class="card-header">Open inventories</div>
            <ul v-if="activeInventories.length > 0" class="mb-3 list-group list-group-flush">
                <li v-for="inv in activeInventories" class="list-group-item">
                    <i class="fas fa-calendar-alt mr-2"></i>{{ inv.started_at }}
                    <a href="#" @click="setSelected(inv)" class="card-link float-right"><i class="fas fa-play mr-2"></i>Resume</a>
                </li>
            </ul>
            <div v-else class="card-body">No open inventories.<br/>
                <i class="fas fa-plus-circle mr-2" @click="create()"></i>Start one
            </div>
        </div>
        <div v-show="closedInventories.length > 0">
            <div class="card">
                <div class="card-header">Closed inventories</div>
                <ul class="mb-3 list-group list-group-flush">
                    <li v-for="inv in closedInventories" class="list-group-item">
                        <i class="fas fa-calendar-alt mr-2"></i>{{ inventoryDates(inv)}}
                        <a href="#" @click="setSelected(inv)" class="card-link float-right"><i
                            class="fas fa-info-circle mr-2"></i>Details</a>
                    </li>
                </ul>
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
                    return start.format('YYYY-MM-DD') + ' from ' + start.format('HH:mm') + ' to ' + stop.format('HH:mm')
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
