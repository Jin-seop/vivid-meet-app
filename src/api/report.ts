import api from './index';

export interface CreateReportDto {
  targetId: string;
  reason: string;
}

export const reportApi = {
  createReport: (data: CreateReportDto) => api.post('/report', data),
};
