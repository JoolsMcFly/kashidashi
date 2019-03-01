import InventoryAPI from '../api/inventories'

export default {
    namespaced: true,

    state: {
        inventories: [],
        selectedInventory: {},
        missingBooks: []
    },

    getters: {
        inventories(state) {
            return state.inventories
        },
        selectedInventory(state) {
            return state.selectedInventory
        },
        missingBooks(state) {
            return state.missingBooks
        }
    },

    mutations: {
        setInventories(state, inventories) {
            state.inventories = inventories
        },
        addInventory(state, inventory) {
            state.inventories.push(inventory)
            state.selectedInventory = inventory
        },
        updateInventory(state, inventory) {
            state.selectedInventory = inventory
        },
        setSelected(state, inventory) {
            state.selectedInventory = inventory
        },
        closeInventory(state) {
            state.inventories = state.inventories.filter(inv => inv.id !== state.selectedInventory.id)
            state.selectedInventory = null
        },
        setMissingBooks(state, books) {
            state.missingBooks = books
        }
    },

    actions: {
        getAll({commit}) {
            return InventoryAPI
                .getAll()
                .then(res => commit('setInventories', res.data))
                .catch(err => console.log('Error fetching inventories', err))
        },
        create({commit}) {
            return InventoryAPI
                .create()
                .then(res => commit('addInventory', res.data))
                .catch(err => console.log('Error creating inventory', err))
        },
        addCode({commit}, data) {
            return InventoryAPI
                .addCode(data)
                .then(res => commit('updateInventory', res.data))
                .catch(err => console.log('Error updating inventory', err))
        },
        setSelected({commit}, inventory) {
            commit('setSelected', inventory)
        },
        end({commit, dispatch}, inventoryId) {
            return InventoryAPI
                .endInventory(inventoryId)
                .then(() => {
                    commit('closeInventory');
                    dispatch('getAll')
                })
                .catch(err => console.log('Error closing inventory', err))
        },
        fetchMissingBooks({commit}, inventoryId) {
            return InventoryAPI
                .fetchMissingBooks(inventoryId)
                .then(res => commit('setMissingBooks', res.data))
                .catch(err => console.log('Error fetching missing books', err))
        }
    }
}
