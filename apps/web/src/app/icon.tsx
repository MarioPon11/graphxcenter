import { ImageResponse } from "next/og";
import { Logo } from "@/components/icons/logo";

export const size = {
  width: 24,
  height: 24,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<Logo width={size.width} height={size.height} />, {
    width: size.width,
    height: size.height,
  });
}
