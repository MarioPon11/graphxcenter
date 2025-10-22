import { ImageResponse } from "next/og";
import { Gxsio } from "@repo/icons";

export const size = {
  width: 24,
  height: 24,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<Gxsio width={size.width} height={size.height} />, {
    width: size.width,
    height: size.height,
  });
}
