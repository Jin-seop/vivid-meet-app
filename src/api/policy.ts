import api from './index';

export interface Policy {
  id: string;
  type: string;
  content: string;
  updatedAt: string;
}

export const getPolicies = async (): Promise<Policy[]> => {
  const res = await api.get<Policy[]>('/policy');
  return res.data;
};
