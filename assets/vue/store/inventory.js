import InventoryAPI from '../api/inventories'

export default {
    namespaced: true,

    state: {
        inventories: [],
        selectedInventory: {},
        details: [],
        lastAddedBooks: []
    },

    getters: {
        inventories(state) {
            return state.inventories
        },
        selectedInventory(state) {
            return state.selectedInventory
        },
        details(state) {
            return state.details
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
            if (typeof inventoryData.inventory !== "undefined") {
                state.selectedInventory = {
                    ...inventoryData.inventory,
                    ...{books_to_move: inventoryData.books_to_move},
                }
                state.lastAddedBooks.unshift({
                    ...inventoryData.book,
                    ...{inventory_item: inventoryData.inventory_item},
                    ...{borrowed_by: inventoryData.borrowed_by || null},
                })
            }
            state.lastAddedBooks = state.lastAddedBooks.slice(0, 5)
        },
        setSelected(state, inventory) {
            state.selectedInventory = inventory
        },
        closeInventory(state) {
            state.inventories = state.inventories.filter(inv => inv.id !== state.selectedInventory.id)
            state.selectedInventory = null
        },
        setDetails(state, books) {
            state.details = books
        },
        removeBook(state, payload) {
            state.selectedInventory = {
                ...payload.inventory,
                ...{books_to_move: payload.books_to_move},
            }
            state.lastAddedBooks = state.lastAddedBooks.filter(book => book.code !== payload.bookCode)
        }
    },

    actions: {
        getAll({commit}) {
            return InventoryAPI
                .getAll()
                .then(res => commit('setInventories', res.data))
        },
        create({commit}) {
            return InventoryAPI
                .create()
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
                .then(res => commit('removeBook', {
                    inventory: res.data.inventory,
                    bookCode: payload.bookCode,
                    books_to_move: res.data.books_to_move || null
                }))
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
        fetchDetails({commit}, inventoryId) {
            return InventoryAPI
                .fetchDetails(inventoryId)
                .then(res => commit('setDetails', res.data))
        }
    }
}
