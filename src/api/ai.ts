import api from './index';

export interface AiGenerateDto {
  poseImage: any; // ImagePicker result
  personImage: any; // ImagePicker result
  pos: string;
  neg: string;
  seed: string;
}

export const aiApi = {
  /** AI 페르소나 이미지 생성 */
  generatePersona: (formData: FormData) =>
    api.post('/ai/generate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
