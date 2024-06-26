import QRCodeSvg from "react-native-qrcode-svg";

import { View } from "react-native";
import { colors } from "@/styles/colors";

type Props = {
  value: string,
  size: number
}

export function QrCode({value, size}: Props) {
  return <QRCodeSvg value={value} size={size} color={colors.white} backgroundColor="transparent"/>;
}
