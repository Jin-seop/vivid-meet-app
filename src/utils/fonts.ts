export enum PretendardFont {
  Thin = 'Pretendard-Thin',
  ExtraLight = 'Pretendard-ExtraLight',
  Light = 'Pretendard-Light',
  Regular = 'Pretendard-Regular',
  Medium = 'Pretendard-Medium',
  SemiBold = 'Pretendard-SemiBold',
  Bold = 'Pretendard-Bold',
  ExtraBold = 'Pretendard-ExtraBold',
  Black = 'Pretendard-Black',
}

export enum PretendardFontWeight {
  Thin = 100,
  ExtraLight = 200,
  Light = 300,
  Regular = 400,
  Medium = 500,
  SemiBold = 600,
  Bold = 700,
  ExtraBold = 800,
  Black = 900,
}

/**
 * Pretendard 폰트 패밀리명을 반환합니다.
 *
 * @param fontWeight PretendardFontWeight enum 값(100~900, 선택)
 * @param fontFamily 이미 Pretendard 계열의 폰트 패밀리명을 직접 지정할 경우(선택)
 * @returns Pretendard 폰트 패밀리명 문자열
 */
export const getPretendardFont = (
  fontWeight?: PretendardFontWeight,
  fontFamily?: PretendardFont,
): string => {
  if (fontFamily && fontFamily.startsWith('Pretendard')) return fontFamily;
  switch (fontWeight) {
    case PretendardFontWeight.Thin:
      return PretendardFont.Thin;
    case PretendardFontWeight.ExtraLight:
      return PretendardFont.ExtraLight;
    case PretendardFontWeight.Light:
      return PretendardFont.Light;
    case PretendardFontWeight.Regular:
      return PretendardFont.Regular;
    case PretendardFontWeight.Medium:
      return PretendardFont.Medium;
    case PretendardFontWeight.SemiBold:
      return PretendardFont.SemiBold;
    case PretendardFontWeight.Bold:
      return PretendardFont.Bold;
    case PretendardFontWeight.ExtraBold:
      return PretendardFont.ExtraBold;
    case PretendardFontWeight.Black:
      return PretendardFont.Black;
    default:
      return PretendardFont.Regular;
  }
};
