import api from './api';

export type Stats = {
  books: number;
  borrowers: number;
  loans: {
    count: number;
    overdue: number;
  };
};

export const statsService = {
  async get(): Promise<Stats> {
    const response = await api.get<Stats>('/stats');
    return response.data;
  },
};
