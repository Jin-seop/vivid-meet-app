import { Text, TextProps } from 'react-native';
import {
  getPretendardFont,
  PretendardFont,
  PretendardFontWeight,
} from '../../utils/fonts';

interface AMTextProps extends TextProps {
  children?: React.ReactNode;
  fontWeight?: PretendardFontWeight;
  fontFamily?: PretendardFont;
}

const AMText = (props: AMTextProps) => {
  const { style, fontWeight = 400, fontFamily, ...rest } = props;
  const resolvedFontFamily = getPretendardFont(fontWeight, fontFamily);
  return (
    <Text {...rest} style={[{ fontFamily: resolvedFontFamily }, style]}>
      {props.children}
    </Text>
  );
};

export default AMText;
