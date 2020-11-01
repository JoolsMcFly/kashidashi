import InventoryAPI from '../api/inventories'

export default {
    namespaced: true,

    state: {
        inventories: [],
        selectedInventory: {},
        missingBooks: [],
        lastAddedBooks: []
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
        },
        lastAddedBooks(state) {
            return state.lastAddedBooks
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
        updateInventory(state, inventoryData) {
            state.selectedInventory = inventoryData.inventory
            state.lastAddedBooks.unshift(inventoryData.book)
            state.lastAddedBooks = state.lastAddedBooks.slice(0, 5)
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
        },
        removeBook(state, payload) {
            state.selectedInventory = payload.inventory
            state.lastAddedBooks = state.lastAddedBooks.filter(book => book.code !== payload.bookCode)
        }
    },

    actions: {
        getAll({commit}) {
            return InventoryAPI
                .getAll()
                .then(res => commit('setInventories', res.data))
        },
        create({commit}, payload) {
            return InventoryAPI
                .create(payload)
                .then(res => commit('addInventory', res.data))
        },
        addCode({commit}, payload) {
            return InventoryAPI
                .addCode(payload)
                .then(res => commit('updateInventory', res.data))
        },
        removeBook({commit}, payload) {
            return InventoryAPI
                .removeBook(payload)
                .then(res => commit('removeBook', {inventory: res.data, bookCode: payload.bookCode}))
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
        },
        fetchMissingBooks({commit}, inventoryId) {
            return InventoryAPI
                .fetchMissingBooks(inventoryId)
                .then(res => commit('setMissingBooks', res.data))
        }
    }
}
