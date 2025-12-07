import api from './api';
import type { Inventory, InventoryItem, Book } from '../types';

export const inventoryService = {
  async getCurrent(): Promise<Inventory | null> {
    try {
      const response = await api.get<Inventory>('/inventory/current');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getAll(): Promise<Inventory[]> {
    const response = await api.get<Inventory[]>('/inventory');
    return response.data;
  },

  async create(): Promise<Inventory> {
    const response = await api.post<Inventory>('/inventory');
    return response.data;
  },

  async close(id: number): Promise<Inventory> {
    const response = await api.put<Inventory>(`/inventory/${id}/close`);
    return response.data;
  },

  async addItem(inventoryId: number, bookId: number, foundAtId: number): Promise<InventoryItem> {
    const response = await api.post<InventoryItem>(`/inventory/${inventoryId}/items`, {
      bookId,
      foundAtId,
    });
    return response.data;
  },

  async removeItem(inventoryId: number, itemId: number): Promise<void> {
    await api.delete(`/inventory/${inventoryId}/items/${itemId}`);
  },

  async getMisplaced(inventoryId: number): Promise<InventoryItem[]> {
    const response = await api.get<InventoryItem[]>(`/inventory/${inventoryId}/misplaced`);
    return response.data;
  },

  async getByLocation(inventoryId: number): Promise<Record<string, InventoryItem[]>> {
    const response = await api.get<Record<string, InventoryItem[]>>(`/inventory/${inventoryId}/by-location`);
    return response.data;
  },
};
