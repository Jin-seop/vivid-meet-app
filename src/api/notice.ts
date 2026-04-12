import api from './index';

export const noticeApi = {
  /** 공지사항 전체 목록 조회 */
  getNotices: () => api.get('/notice'),

  /** 공지사항 상세 조회 */
  getNoticeDetail: (id: string) => api.get(`/notice/${id}`),
};
