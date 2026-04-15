export interface CreateUserDto {
  email: string;
  nickname: string;
  provider: 'GooGle' | 'Apple' | 'Line';
  providerId: string;
  region: 'KR' | 'JP';
  gender: 'MALE' | 'FEMALE';
  mbti?: string;
  aiPhotoUrl: string;
  posePhotoUrl: string;
  realPhotos: string[];
}
