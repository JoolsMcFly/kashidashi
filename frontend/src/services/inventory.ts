import api from './api';
import type { Inventory, InventoryItem } from '../types';

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

  async getOne(id: number): Promise<Inventory> {
    const response = await api.get<Inventory>(`/inventory/${id}`);
    return response.data;
  },

  async getStats(id: number): Promise<{ toMove: number; missing: number }> {
    const response = await api.get<{ toMove: number; missing: number }>(`/inventory/${id}/stats`);
    return response.data;
  },

  async downloadBooksToMove(id: number): Promise<void> {
    const response = await api.get(`/inventory/${id}/download/books-to-move`, { responseType: 'blob' });
    triggerBlobDownload(response.data, `inventory-${id}-books-to-move.xlsx`);
  },

  async downloadMissingBooks(id: number): Promise<void> {
    const response = await api.get(`/inventory/${id}/download/missing`, { responseType: 'blob' });
    triggerBlobDownload(response.data, `inventory-${id}-missing-books.xlsx`);
  },
};

function triggerBlobDownload(data: BlobPart, filename: string) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
