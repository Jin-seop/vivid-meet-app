import { Text, TextProps } from 'react-native';

interface AppTextProps extends TextProps {
  children?: React.ReactNode;
  fontWeight?: string;
  fontFamily?: string;
}

const getPretendardFont = (fontWeight?: string, fontFamily?: string) => {
  if (fontFamily && fontFamily.startsWith('Pretendard')) return fontFamily;
  switch (fontWeight) {
    case '100':
    case 'thin':
      return 'Pretendard-Thin';
    case '200':
    case 'extralight':
      return 'Pretendard-ExtraLight';
    case '300':
    case 'light':
      return 'Pretendard-Light';
    case '400':
    case 'normal':
      return 'Pretendard-Regular';
    case '500':
    case 'medium':
      return 'Pretendard-Medium';
    case '600':
    case 'semibold':
      return 'Pretendard-SemiBold';
    case '700':
    case 'bold':
      return 'Pretendard-Bold';
    case '800':
    case 'extrabold':
      return 'Pretendard-ExtraBold';
    case '900':
    case 'black':
      return 'Pretendard-Black';
    default:
      return 'Pretendard-Regular';
  }
};

const AppText = (props: AppTextProps) => {
  const { style, fontWeight, fontFamily, ...rest } = props;
  const resolvedFontFamily = getPretendardFont(
    fontWeight as string,
    fontFamily,
  );
  return (
    <Text {...rest} style={[{ fontFamily: resolvedFontFamily }, style]}>
      {props.children}
    </Text>
  );
};

export default AppText;
